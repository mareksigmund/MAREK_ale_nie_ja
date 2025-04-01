import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.css']
})
export class FightComponent implements OnInit {
  charName = localStorage.getItem('currentChar') || '';
  fightData: any = null;
  currentTurnIndex = 0;
  skipMode = false;

  playerHp!: number;
  enemyHp!: number;

  showResultPopup = false;
  resultText = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const params = new HttpParams().set('charName', this.charName);
    this.http.get('http://localhost:8080/getQuestFight', { params }).subscribe((data: any) => {
      this.fightData = data;
      this.playerHp = data.hp1;
      this.enemyHp = data.hp2;
      this.playTurns();
    });
  }

  playTurns(): void {
    if (this.skipMode || this.currentTurnIndex >= this.fightData.turns.length) {
      this.endFight();
      return;
    }

    const turn = this.fightData.turns[this.currentTurnIndex];
    setTimeout(() => {
      if (turn.playerTurn && turn.hit) {
        this.enemyHp = turn.enemyHp;
      } else if (!turn.playerTurn && turn.hit) {
        this.playerHp = turn.playerHp;
      }

      this.currentTurnIndex++;
      this.playTurns();
    }, 800);
  }

  skip(): void {
    this.skipMode = true;
    const lastTurn = this.fightData.turns[this.fightData.turns.length - 1];
    this.playerHp = lastTurn.playerHp;
    this.enemyHp = lastTurn.enemyHp;
    this.endFight();
  }

  endFight(): void {
    const win = this.fightData.playerWin ? 'FIGHT WIN' : 'FIGHT LOSS';
    const unlock = this.fightData.unlockedStuff ? ' – NEW UNLOCK!' : '';
    this.resultText = `${win}${unlock}`;
    this.showResultPopup = true;

    setTimeout(() => {
      this.router.navigate(['/quest']);
    }, 4000);
  }
  
  // endFight(): void {
  //   const win = this.fightData.playerWin ? 'FIGHT WIN' : 'FIGHT LOSS';
  //   const unlock = this.fightData.unlockedStuff ? ' – NEW UNLOCK!' : '';
  //   this.resultText = `${win}${unlock}`;
  //   this.showResultPopup = true;
  
  //   setTimeout(() => {
  //     // rozwiązanie 1: przejście w inne miejsce i z powrotem (hack)
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //       this.router.navigate(['/quest']);
  //     });
  //   }, 4000);
  // }
  
  getColor(id: number): string {
    return ['#F3F3F3', '#F9F1A5', '#E74856', '#61D6D6'][id];
  }

  getTitle(id: number): string {
    const titles: Record<number, string> = {
      10: 'TITLE 0 WAR', 11: 'TITLE 1 WAR', 12: 'TITLE 2 WAR', 13: 'TITLE 3 WAR',
      20: 'TITLE 0 WIZ', 21: 'TITLE 1 WIZ', 22: 'TITLE 2 WIZ', 23: 'TITLE 3 WIZ'
    };
    return titles[id] || '';
  }

  getHpPercent(currentHp: number, maxHp: number): number {
    const percent = (currentHp / maxHp) * 100;
    return Math.max(0, percent); // nie pozwól zejść poniżej 0%
  }
  
}
