import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  tab: 'login' | 'register' = 'login';
  nickname: string = '';
  selectedClass: 'Warrior' | 'Wizard' = 'Warrior';

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  login() {
    if (!this.nickname.trim()) return;

    this.characterService.getCharacterByName(this.nickname).subscribe({
      next: (charData) => {
        localStorage.setItem('currentChar', this.nickname);
        this.router.navigate(['/quest']);
      },
      error: () => {
        alert('Character not found!');
      }
    });
  }

  register() {
    if (!this.nickname.trim()) return;

    this.characterService.createCharacter(this.nickname, '1234', this.selectedClass).subscribe({
      next: () => {
        localStorage.setItem('currentChar', this.nickname);
        localStorage.setItem('currentClass', this.selectedClass);
        this.router.navigate(['/quest']);
      },
      error: () => {
        alert('Registration failed!');
      }
    });
  }
}
