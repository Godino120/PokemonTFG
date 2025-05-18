import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EquipoService } from '../../services/equipo.service';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  species: {
    url: string;
  };
  gender_rate?: number;
}

interface PokemonResult {
  name: string;
  url: string;
}

interface PokemonResponse {
  results: PokemonResult[];
}

interface PokemonTypeResponse {
  pokemon: PokemonResult[];
}

interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
  gender_rate: number;
}

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, PokemonDetailComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  @ViewChild(PokemonDetailComponent) detailComponent?: PokemonDetailComponent;

  pokemons: Pokemon[] = [];
  tipoSeleccionado: string = '';
  tiposPokemon: string[] = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy'
  ];
  pokemonSeleccionado?: Pokemon;
  descripcionPokemon: string = '';
  categoriaPokemon: string = '';
  loadingPokemons: boolean = true;
  mostrarCrearEquipo = false;
  equipo: (Pokemon | null)[] = [null, null, null, null, null, null];
  equipoSlots = Array(6);
  slotSeleccionado: number | null = null;
  mensajeEquipo: string = '';

  constructor(
    private pokemonService: PokemonService,
    private authService: AuthService,
    private equipoService: EquipoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPokemons();
    this.loadingPokemons = true;
  }

  async cargarPokemons(): Promise<void> {
    try {
      
    this.loadingPokemons = true;

      const respuesta = await firstValueFrom(this.pokemonService.getPokemons()) as PokemonResponse;
      if (!respuesta?.results) return;

      const detallesPromesas = respuesta.results.map((pokemon: PokemonResult) =>
        firstValueFrom(this.pokemonService.getPokemonDetails(this.obtenerId(pokemon.url).toString()))
      );

      const detalles = await Promise.all(detallesPromesas);
      this.pokemons = detalles.filter((pokemon): pokemon is Pokemon => pokemon !== null);

      setTimeout(() => {
        this.loadingPokemons = false;
      }, 1000);
      
    } catch (error) {
      console.error('Error al cargar Pokémon:', error);
    }
  }

  async filtrarPorTipo(tipo: string): Promise<void> {
    this.tipoSeleccionado = tipo;

    try {
      if (tipo === 'all') {
        await this.cargarPokemons();
        return;
      }

      const respuesta = await firstValueFrom(this.pokemonService.getPokemonByTypeLimited(tipo)) as PokemonTypeResponse;

      if (!respuesta?.pokemon) {
        console.error('No se encontraron Pokémon para el tipo:', tipo);
        return;
      }

      const detallesPromesas = respuesta.pokemon.map((pokemon: PokemonResult) =>
        firstValueFrom(this.pokemonService.getPokemonDetails(this.obtenerId(pokemon.url).toString()))
      );

      const detalles = await Promise.all(detallesPromesas);
      this.pokemons = detalles.filter((pokemon): pokemon is Pokemon => pokemon !== null);
    } catch (error) {
      console.error(`Error al filtrar Pokémon por tipo ${tipo}:`, error);
    }
  }

  private obtenerId(url: string): number {
    const partes = url.split('/');
    return Number(partes[partes.length - 2]);
  }

  async mostrarDetalle(pokemon: Pokemon) {
    // Si estamos creando equipo y hay un slot seleccionado, añade el Pokémon a ese slot
    if (this.mostrarCrearEquipo && this.slotSeleccionado !== null) {
      this.equipo[this.slotSeleccionado] = pokemon;
      this.slotSeleccionado = null; // Opcional: deselecciona el slot tras añadir
      return;
    }

    try {
      this.pokemonSeleccionado = pokemon;
      const speciesUrl = pokemon.species.url;
      const species = await firstValueFrom(this.pokemonService.getPokemonSpecies(speciesUrl)) as PokemonSpecies;

      // Obtener descripción en español
      const descripcionEs = species.flavor_text_entries.find(
        entry => entry.language.name === 'es'
      )?.flavor_text || '';

      // Obtener categoría en español
      const categoriaEs = species.genera.find(
        genus => genus.language.name === 'es'
      )?.genus || '';

      this.descripcionPokemon = descripcionEs.replace(/\f/g, ' ');
      this.categoriaPokemon = categoriaEs;

      // Actualizar el gender_rate del Pokémon seleccionado
      this.pokemonSeleccionado = {
        ...pokemon,
        gender_rate: species.gender_rate
      };

      if (this.detailComponent) {
        this.detailComponent.toggleMostrar();
      }
    } catch (error) {
      console.error('Error al cargar detalles del Pokémon:', error);
    }
  }

  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  navegarACrearEquipo() {
    this.mostrarCrearEquipo = true;
    this.mensajeEquipo = '';
  }

  seleccionarSlot(index: number) {
    this.slotSeleccionado = index;
  }

  async guardarEquipo() {
    const equipoParaGuardar = this.equipo.filter(Boolean).map(p => ({
      id: p!.id,
      name: p!.name
    }));
    try {
      await firstValueFrom(this.equipoService.guardarEquipo(equipoParaGuardar));
      this.mensajeEquipo = '¡Equipo guardado correctamente!';
      this.mostrarCrearEquipo = false;
      this.equipo = [null, null, null, null, null, null];
    } catch (e) {
      this.mensajeEquipo = 'Error al guardar el equipo. Intenta de nuevo.';
    }
  }

  get equipoLlenoCount(): number {
    return this.equipo.filter(Boolean).length;
  }
}