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
  
}
