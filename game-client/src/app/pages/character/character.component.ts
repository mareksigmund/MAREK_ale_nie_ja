import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {
  char: any = null;

  selectedAvatar = 0;
  selectedColor = 0;
  selectedTitle = 0;
  selectedWeapon = 0;
  selectedArmor = 0;

  constructor(
    private characterService: CharacterService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const charName = localStorage.getItem('currentChar');
    if (!charName) {
      console.warn('Brak currentChar w localStorage');
      return;
    }

    this.characterService.getCharacterByName(charName).subscribe({
      next: (data) => {
        if (data.toLevelUp === 0) {
          console.log('Redirect to levelup screen');
          this.router.navigate(['/levelup']);
          return;
        }

        this.char = data;

        // Debug postaci
        console.log('CHARACTER LOADED:', data);

        this.selectedAvatar = data.avatarId ?? 0;
        this.selectedColor = data.colorId ?? 0;
        this.selectedTitle = data.titleId ?? 0;
        this.selectedWeapon = data.equippedWeaponId ?? 0;
        this.selectedArmor = data.equippedArmorId ?? 0;
      },
      error: (err) => {
        console.error('Error loading character:', err);
        alert('Failed to load character.');
      }
    });
  }

  get titleOptions(): number[] {
    return this.char?.charClass === 'Warrior' ? [10, 11, 12, 13] : [20, 21, 22, 23];
  }

  getTitle(id: number): string {
    const titles: Record<number, string> = {
      10: 'TITLE 0 WAR', 11: 'TITLE 1 WAR', 12: 'TITLE 2 WAR', 13: 'TITLE 3 WAR',
      20: 'TITLE 0 WIZ', 21: 'TITLE 1 WIZ', 22: 'TITLE 2 WIZ', 23: 'TITLE 3 WIZ'
    };
    return titles[id] || '';
  }

  getColor(id: number): string {
    return ['#F3F3F3', '#F9F1A5', '#E74856', '#61D6D6'][id];
  }

  getAvatarPath(): string {
    const classDigit = this.char.charClass === 'Warrior' ? 1 : 2;
    return `../../../assets/avatars/${classDigit}${this.selectedAvatar}${this.selectedColor}.svg`;
  }

  saveChanges(): void {
    if (!this.char) {
      console.warn('Character data is null, cannot save.');
      return;
    }

    const charName = this.char.charName;
    const colorId = Number(this.selectedColor);
    const titleId = Number(this.selectedTitle % 10);
    const equippedArmorId = Number(this.selectedArmor);
    const equippedWeaponId = Number(this.selectedWeapon);

    const debugPayload = {
      charName,
      colorId,
      titleId,
      equippedArmorId,
      equippedWeaponId
    };

    console.log('SAVE DEBUG:', debugPayload);

    const params = new HttpParams()
    .set('charName', charName)
    .set('colorId', colorId.toString())
    .set('titleId', (this.selectedTitle % 10).toString())
    .set('equippedArmorId', equippedArmorId.toString())
    .set('equippedWeaponId', equippedWeaponId.toString())
    .set('avatarId', this.selectedAvatar.toString());
  

    this.http.post('http://localhost:8080/characterUpdateEquip', null, { params }).subscribe({
      next: () => {
        console.log('SAVE SUCCESS');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('SAVE ERROR:', err);
        alert("Something went wrong while saving.");
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate(['/' + path]);
  }
  
  logout() {
    localStorage.removeItem('charName');
    this.router.navigate(['/']);
  }
}
