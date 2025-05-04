import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // Importación directa de forkJoin
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  // Tipado mejorado para los Pokémon destacados
  pokemonDestacados: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null; // Para manejar errores

  constructor(
    private router: Router,
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.cargarPokemonDestacados();
  }

  cargarPokemonDestacados(): void {
    const idsPokemonDestacados = ["bulbasaur", "charmander", "squirtle", "pikachu", "mewtwo"];
    this.isLoading = true;
    this.errorMessage = null;

    const requests = idsPokemonDestacados.map(id => 
      this.pokemonService.getPokemonDetails(id) // Cambiado a getPokemonDetails
    );

    forkJoin(requests).subscribe(
      (pokemons) => {
        this.pokemonDestacados = pokemons;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los Pokémon destacados:', error);
        this.errorMessage = 'No se pudieron cargar los Pokémon destacados. Inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    );
  }

  navegarAPokedex(): void {
    this.router.navigate(['/pokedex']);
  }

  navegarACrearEquipo(): void {
    this.router.navigate(['/crear-equipo']);
  }

  navegarAMisEquipos(): void {
    this.router.navigate(['/mis-equipos']);
  }
}