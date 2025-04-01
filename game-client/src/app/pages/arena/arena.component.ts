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

  private sendFightRequest(opponent: string): void {
    const charName = localStorage.getItem('currentChar');
    if (!charName) {
      alert('Brak aktywnej postaci!');
      return;
    }

    const params = new HttpParams()
      .set('charName', charName)
      .set('opponentName', opponent);

    this.http.get('http://localhost:8080/getArenaFight', { params }).subscribe({
      next: (data: any) => {
        localStorage.setItem('arenaFight', JSON.stringify(data));
        this.router.navigate(['/arena-fight']);
      },
      error: (err) => {
        console.error('Błąd pobierania areny:', err);
        alert('Nie udało się znaleźć przeciwnika!');
      }
    });
  }

  findOpponent(): void {
    if (!this.opponentName.trim()) {
      alert('Wpisz nazwę przeciwnika!');
      return;
    }
    this.sendFightRequest(this.opponentName.trim());
  }

  randomOpponent(): void {
    this.sendFightRequest('random');
  }
}
