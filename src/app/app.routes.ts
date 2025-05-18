import { Routes } from '@angular/router';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { MisEquiposComponent } from './components/mis-equipos/mis-equipos.component';

export const routes: Routes = [
  { path: 'pokedex', component: PokedexComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'mis-equipos', component: MisEquiposComponent },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
];
