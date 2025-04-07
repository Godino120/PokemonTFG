import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PokemonDetallado {
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

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent {
  @Input() pokemon?: PokemonDetallado;
  @Input() descripcion: string = '';
  @Input() categoria: string = '';
  mostrar: boolean = false;

  toggleMostrar() {
    this.mostrar = !this.mostrar;
  }

  cerrar() {
    this.mostrar = false;
  }

  obtenerTipos(): string {
    return this.pokemon?.types.map(t => t.type.name).join(', ') || '';
  }

  obtenerHabilidades(): string {
    return this.pokemon?.abilities.map(a => a.ability.name).join(', ') || '';
  }

  mostrarGenero(): boolean {
    return this.pokemon?.gender_rate !== undefined && this.pokemon.gender_rate >= 0;
  }

  tieneMacho(): boolean {
    return this.pokemon?.gender_rate !== undefined && this.pokemon.gender_rate < 8;
  }

  tieneHembra(): boolean {
    return this.pokemon?.gender_rate !== undefined && this.pokemon.gender_rate > 0;
  }
}
