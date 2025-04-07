import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Observable, catchError, map, of } from 'rxjs';

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

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  pokemons: Pokemon[] = [];
  tipoSeleccionado: string = '';
  tiposPokemon: string[] = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy'
  ];

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
}