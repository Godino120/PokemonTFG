import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipoService } from '../../services/equipo.service';
import { CommonModule } from '@angular/common';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-equipos',
  standalone: true,
  templateUrl: './mis-equipos.component.html',
  imports: [CommonModule, PokemonDetailComponent],
  styleUrls: ['./mis-equipos.component.css']
})
export class MisEquiposComponent implements OnInit {
  equipos: any[] = [];
  equiposPokemons: any[][] = [];
  loading = true;
  error = '';
  pokemonSeleccionado: any = null;
  descripcionPokemon: string = '';
  categoriaPokemon: string = '';

  @ViewChild(PokemonDetailComponent) detailComponent?: PokemonDetailComponent;

  constructor(private equipoService: EquipoService, private http: HttpClient) {}

  ngOnInit(): void {
    const inicio = Date.now();
    this.equipoService.obtenerEquiposUsuario().subscribe({
      next: async (equipos) => {
        this.equipos = equipos;
        // Para cada equipo, carga los datos de los pokémon
        this.equiposPokemons = await Promise.all(
          equipos.map(async (equipo: any) => {
            const ids = [equipo.pokemon1, equipo.pokemon2, equipo.pokemon3, equipo.pokemon4, equipo.pokemon5, equipo.pokemon6].filter(Boolean);
            const detalles = await Promise.all(
              ids.map((id: number) =>
                this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise()
              )
            );
            return detalles;
          })
        );
        // Calcula el tiempo de carga y espera si es necesario
        const duracion = Date.now() - inicio;
        const tiempoMinimo = 1000;
        if (duracion < tiempoMinimo) {
          setTimeout(() => {
            this.loading = false;
          }, tiempoMinimo - duracion);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Error al cargar tus equipos.';
        this.loading = false;
      }
    });
  }

  async mostrarDetalle(pokemon: any) {
    // Carga species para descripción y categoría
    const species: any = await this.http.get(pokemon.species.url).toPromise();
    const descripcionEs = species.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'es'
    )?.flavor_text || '';
    const categoriaEs = species.genera.find(
      (genus: any) => genus.language.name === 'es'
    )?.genus || '';
    this.pokemonSeleccionado = { ...pokemon, gender_rate: species.gender_rate };
    this.descripcionPokemon = descripcionEs.replace(/\f/g, ' ');
    this.categoriaPokemon = categoriaEs;
    if (this.detailComponent) {
      this.detailComponent.toggleMostrar();
    }
  }

  borrarEquipo(id: number) {
    if (confirm('¿Seguro que quieres borrar este equipo?')) {
      this.equipoService.borrarEquipo(id).subscribe({
        next: () => {
          // Elimina el equipo del array local para refrescar la vista
          this.equipos = this.equipos.filter(e => e.id !== id);
          this.equiposPokemons = this.equiposPokemons.filter((_, idx) => this.equipos[idx]?.id !== id);
        },
        error: () => {
          alert('Error al borrar el equipo.');
        }
      });
    }
  }
}