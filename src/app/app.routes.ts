import { Routes } from '@angular/router';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { BattleComponent } from './components/battle/battle.component';
import { TeamBuilderComponent } from './components/team-builder/team-builder.component';

export const routes: Routes = [
  { path: 'pokedex', component: PokedexComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'team-builder', component: TeamBuilderComponent },
  { path: '', redirectTo: '/pokedex', pathMatch: 'full' },
];
