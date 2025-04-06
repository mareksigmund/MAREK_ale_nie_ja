import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arena-fight',
  templateUrl: './arena-fight.component.html',
  styleUrls: ['./arena-fight.component.css']
})
export class ArenaFightComponent implements OnInit {
  fightData: any;
  currentTurnIndex: number = 0;
  interval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('arenaFight');
    if (!raw) {
      alert('Brak danych walki!');
      this.router.navigate(['/arena']);
      return;
    }

    this.fightData = JSON.parse(raw);
    this.startFight();
  }

  startFight(): void {
    this.interval = setInterval(() => {
      if (this.currentTurnIndex < this.fightData.turns.length - 1) {
        this.currentTurnIndex++;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  get currentTurn() {
    return this.fightData.turns[this.currentTurnIndex];
  }

  finish(): void {
    this.router.navigate(['/arena']);
  }

  getPlayerHpPercent(): string {
    const hp = this.currentTurn?.playerHp ?? 0;
    const maxHp = this.fightData?.hp1 ?? 1;
    return Math.max(0, (hp / maxHp) * 100) + '%';
  }
  
  getEnemyHpPercent(): string {
    const hp = this.currentTurn?.enemyHp ?? 0;
    const maxHp = this.fightData?.hp2 ?? 1;
    return Math.max(0, (hp / maxHp) * 100) + '%';
  }
  
  navigateTo(path: string) {
    this.router.navigate(['/' + path]);
  }
  
  logout() {
    localStorage.removeItem('charName');
    this.router.navigate(['/']);
  }

  getTitle(id: number, isWizard: boolean = false): string {
    const titles: Record<number, string> = {
      10: 'TITLE 0 WAR',
      11: 'TITLE 1 WAR',
      12: 'TITLE 2 WAR',
      13: 'TITLE 3 WAR',
      20: 'TITLE 0 WIZ',
      21: 'TITLE 1 WIZ',
      22: 'TITLE 2 WIZ',
      23: 'TITLE 3 WIZ'
    };
  
    const base = isWizard ? 20 : 10;
    const correctedId = base + id;
  
    return titles[correctedId] || `TITLE ${id}`;
  }
  
  
}
