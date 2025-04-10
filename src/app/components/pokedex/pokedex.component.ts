import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Observable, catchError, map, of } from 'rxjs';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';

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
  // ViewChild nos permite acceder al componente hijo (PokemonDetailComponent)
  // Es como tener una referencia directa al componente del modal de detalle
  // Lo usamos para poder llamar a sus métodos (como toggleMostrar) de forma segura
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

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.cargarPokemons();
  }

  async cargarPokemons(): Promise<void> {
    try {
      const respuesta = await this.pokemonService.getPokemons().toPromise() as PokemonResponse;
      if (!respuesta?.results) return;

      const detallesPromesas = respuesta.results.map((pokemon: PokemonResult) => 
        this.pokemonService.getPokemonDetails(this.obtenerId(pokemon.url).toString()).toPromise()
      );

      const detalles = await Promise.all(detallesPromesas);
      this.pokemons = detalles.filter((pokemon): pokemon is Pokemon => pokemon !== null);
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

      const respuesta = await this.pokemonService.getPokemonByTypeLimited(tipo).toPromise() as PokemonTypeResponse;

      if (!respuesta?.pokemon) {
        console.error('No se encontraron Pokémon para el tipo:', tipo);
        return;
      }

      const detallesPromesas = respuesta.pokemon.map((pokemon: PokemonResult) => 
        this.pokemonService.getPokemonDetails(this.obtenerId(pokemon.url).toString()).toPromise()
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
    try {
      this.pokemonSeleccionado = pokemon;
      const speciesUrl = pokemon.species.url;
      const species = await this.pokemonService.getPokemonSpecies(speciesUrl).toPromise() as PokemonSpecies;
      
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

      // Usando ViewChild podemos acceder de forma segura al componente hijo
      // y llamar a su método toggleMostrar para abrir el modal
      if (this.detailComponent) {
        this.detailComponent.toggleMostrar();
      }
    } catch (error) {
      console.error('Error al cargar detalles del Pokémon:', error);
    }
  }
}