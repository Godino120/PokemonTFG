import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  pokemons: any[] = [];
  selectedType: string = '';
  pokemonTypes: string[] = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy'
  ];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  // Cargar los primeros 151 Pokémon con sus detalles
  loadPokemons(): void {
    this.pokemonService.getPokemons().subscribe(
      (data: any) => {
        const pokemonRequests: Observable<any>[] = data.results.map((pokemon: any) =>
          this.pokemonService.getPokemonDetails(this.getId(pokemon.url).toString())
        );
        forkJoin(pokemonRequests).subscribe(
          (details: any[]) => {
            this.pokemons = details; // Asigna los detalles cargados
          },
          (error) => {
            console.error('Error al cargar detalles de Pokémon:', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar Pokémon:', error);
      }
    );
  }

  // Filtrar Pokémon por tipo usando la nueva función
  filterByType(type: string): void {
    this.selectedType = type;
    if (type === 'all') {
      this.loadPokemons(); // Cargar todos los Pokémon
    } else {
      this.pokemonService.getPokemonByTypeLimited(type).subscribe(
        (data: any) => {
          const pokemonRequests: Observable<any>[] = data.pokemon.map((pokemon: any) =>
            this.pokemonService.getPokemonDetails(this.getId(pokemon.url).toString())
          );
          forkJoin(pokemonRequests).subscribe(
            (details: any[]) => {
              this.pokemons = details; // Asigna los detalles cargados
            },
            (error) => {
              console.error(`Error al filtrar Pokémon por tipo ${type}:`, error);
            }
          );
        },
        (error) => {
          console.error(`Error al obtener Pokémon de tipo ${type}:`, error);
        }
      );
    }
  }

  // Obtener el ID de un Pokémon desde su URL
  getId(url: string): number {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]);
  }
}