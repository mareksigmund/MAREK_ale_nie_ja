import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-levelup',
  templateUrl: './levelup.component.html',
  styleUrls: ['./levelup.component.css']
})
export class LevelupComponent {
  charName: string = '';
  first: number = 0;
  second: number = 0;
  third: number = 0;

  constructor(private http: HttpClient, private router: Router) {
    const charNameFromStorage = localStorage.getItem('currentChar');

    if (!charNameFromStorage) {
      alert('Nie znaleziono currentChar w localStorage!');
      return;
    }

    this.charName = charNameFromStorage;
  }

  levelUp(): void {
    const sum = Number(this.first) + Number(this.second) + Number(this.third);
    if (sum !== 3) {
      alert('Rozdaj dokładnie 3 punkty!');
      return;
    }

    const params = new HttpParams()
      .set('charName', this.charName)
      .set('first', this.first)
      .set('second', this.second)
      .set('third', this.third);

    console.log('Wysyłane dane:', {
      charName: this.charName,
      first: this.first,
      second: this.second,
      third: this.third
    });

    this.http.post('http://localhost:8080/characterLevelUp', null, { params }).subscribe({
      next: () => this.router.navigate(['/character']),
      error: err => {
        console.error(err);
        alert('Nie udało się awansować postaci. Sprawdź limity atrybutów!');
      }
    });
  }
}
