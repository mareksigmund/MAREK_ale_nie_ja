import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class QuestComponent implements OnInit, OnDestroy {
  charName: string = '';
  storyStage: number | null = null;
  onQuest: boolean | null = null;
  loading: boolean = true;

  // QUEST DATA
  questName: string = '';
  questDesc: string = '';
  questEnd: number = 0;
  timeLeft: string = '';

  intervalSub!: Subscription;

  constructor(
    private characterService: CharacterService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const charName = localStorage.getItem('currentChar');
    if (!charName) return;

    this.charName = charName;

    this.characterService.getCharacterByName(charName).subscribe({
      next: (data) => {
        this.storyStage = data.storyStage;
        this.onQuest = data.onQuest;
        this.loading = false;

        if (this.onQuest) {
          this.fetchQuestCountdown();
        }
      },
      error: (_) => {
        this.loading = false;
      }
    });
  }

  fetchQuestCountdown() {
    const params = new HttpParams().set('charName', this.charName);
    this.http.get<any>('http://localhost:8080/characterCheckQuest', { params })
      .subscribe({
        next: (data) => {
          this.questName = data.questName;
          this.questDesc = data.questDesc;
          this.questEnd = data.questEnd;

          this.updateTimeLeft();
          this.intervalSub = interval(1000).subscribe(() => {
            this.updateTimeLeft();
          });
        },
        error: (_) => {
          this.onQuest = false;
        }
      });
  }

  updateTimeLeft() {
    const now = Date.now();
    const diffMs = this.questEnd - now;

    if (diffMs <= 0) {
      this.timeLeft = '00:00';
      this.intervalSub?.unsubscribe();

      // ⬇️ Zamiast pokazywać komponent wewnątrz – przejdź na stronę walki
      this.router.navigate(['/fight']);
    } else {
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      this.timeLeft = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  }

  beginQuest(questId: number) {
    const params = new HttpParams()
      .set('charName', this.charName)
      .set('questId', questId);

    this.http.post('http://localhost:8080/characterBeginQuest', null, { params }).subscribe({
      next: () => {
        this.ngOnInit(); // odśwież dane
      }
    });
  }

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
  }
}
