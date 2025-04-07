import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private db: AngularFireDatabase) {}

  // Guardar equipo en Firebase Realtime Database
  saveTeam(userId: string, team: any[]) {
    return this.db.list(`teams/${userId}`).set('pokemons', team);
  }

  // Obtener equipo del usuario
  getTeam(userId: string) {
    return this.db.list(`teams/${userId}/pokemons`).valueChanges();
  }
}
