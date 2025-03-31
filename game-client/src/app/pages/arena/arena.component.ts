import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent {
  opponentName: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  findOpponent(): void {
    const charName = localStorage.getItem('currentChar');
    if (!charName || !this.opponentName) {
      alert("Missing character or opponent name");
      return;
    }

    const params = new HttpParams()
      .set('charName', charName)
      .set('opponentName', this.opponentName);

    this.http.get('http://localhost:8080/getArenaFight', { params }).subscribe({
      next: (data: any) => {
        localStorage.setItem('arenaFight', JSON.stringify(data));
        this.router.navigate(['/arena-fight']);
      },
      error: (err) => {
        console.error(err);
        alert("Opponent not found or error occurred.");
      }
    });
  }

  randomOpponent(): void {
    const charName = localStorage.getItem('currentChar');
    if (!charName) {
      alert("Missing character");
      return;
    }

    const params = new HttpParams()
      .set('charName', charName)
      .set('opponentName', 'random');

    this.http.get('http://localhost:8080/getArenaFight', { params }).subscribe({
      next: (data: any) => {
        localStorage.setItem('arenaFight', JSON.stringify(data));
        this.router.navigate(['/arena-fight']);
      },
      error: (err) => {
        console.error(err);
        alert("Could not find random opponent.");
      }
    });
  }
}
