import { Component } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.css']
})
export class TeamBuilderComponent {
  team: any[] = [];
  userId = 'user123'; // Reemplazar con ID real

  constructor(private teamService: TeamService) {}

  addToTeam(pokemon: any) {
    if (this.team.length < 6) {
      this.team.push(pokemon);
    }
  }

  saveTeam() {
    this.teamService.saveTeam(this.userId, this.team).then(() => {
      alert('Equipo guardado con éxito');
    });
  }

  loadTeam() {
    this.teamService.getTeam(this.userId).subscribe(data => {
      this.team = data;
    });
  }
}

