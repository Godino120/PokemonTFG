import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent {
  pokemon1: any;
  pokemon2: any;
  winner: string = '';

  constructor(private pokemonService: PokemonService) {}

  selectPokemon1(name: string) {
    this.pokemonService.getPokemonDetails(name).subscribe(data => this.pokemon1 = data);
  }

  selectPokemon2(name: string) {
    this.pokemonService.getPokemonDetails(name).subscribe(data => this.pokemon2 = data);
  }

  battle() {
    if (!this.pokemon1 || !this.pokemon2) return;
    const power1 = this.pokemon1.stats[0].base_stat; // HP como poder
    const power2 = this.pokemon2.stats[0].base_stat;
    this.winner = power1 > power2 ? this.pokemon1.name : this.pokemon2.name;
  }
}
