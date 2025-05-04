import { Routes } from '@angular/router';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { TeamBuilderComponent } from './components/team-builder/team-builder.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: 'pokedex', component: PokedexComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'team-builder', component: TeamBuilderComponent },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
];
