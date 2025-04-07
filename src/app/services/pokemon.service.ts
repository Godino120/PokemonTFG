import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  constructor(private http: HttpClient) {}

  // Obtener todos los Pokémon
  getPokemons(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error al obtener Pokémon:', err);
        return throwError(() => new Error('Error al obtener la lista de Pokémon'));
      })
    );
  }

  // Obtener detalles de un Pokémon
  getPokemonDetails(name: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`).pipe(
      catchError(err => {
        console.error(`Error al obtener detalles de ${name}:`, err);
        return throwError(() => new Error(`Error al obtener detalles de ${name}`));
      })
    );
  }

  // Obtener detalles de la especie de un Pokémon
  getPokemonSpecies(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      catchError(err => {
        console.error('Error al obtener detalles de la especie:', err);
        return throwError(() => new Error('Error al obtener detalles de la especie'));
      })
    );
  }

  // Filtrar Pokémon por tipo (original)
  getPokemonByType(type: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/type/${type}`).pipe(
      catchError(err => {
        console.error(`Error al obtener Pokémon de tipo ${type}:`, err);
        return throwError(() => new Error(`Error al obtener Pokémon de tipo ${type}`));
      })
    );
  }

  // Nueva función: Filtrar Pokémon por tipo y limitar a los primeros 151
  getPokemonByTypeLimited(type: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/type/${type}`).pipe(
      map((response) => {
        const filteredPokemons = response.pokemon
          .map((p: any) => p.pokemon)
          .filter((pokemon: any) => {
            const id = this.getIdFromUrl(pokemon.url);
            return id <= 151; // Filtrar solo los Pokémon con ID ≤ 151
          });
        return { pokemon: filteredPokemons };
      }),
      catchError(err => {
        console.error(`Error al obtener Pokémon de tipo ${type}:`, err);
        return throwError(() => new Error(`Error al obtener Pokémon de tipo ${type}`));
      })
    );
  }

  // Función auxiliar para extraer el ID de la URL de un Pokémon
  private getIdFromUrl(url: string): number {
    const partes = url.split('/');
    return Number(partes[partes.length - 2]);
  }
}