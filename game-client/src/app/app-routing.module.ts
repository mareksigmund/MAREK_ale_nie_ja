import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { QuestComponent } from './pages/quest/quest.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CharacterComponent } from './pages/character/character.component';
import { ArenaComponent } from './pages/arena/arena.component';
import { FightComponent } from './components/fight/fight.component';

const routes: Routes = [
  // 👇 Strona logowania
  { path: '', component: LoginComponent },

  // 👇 Layout po zalogowaniu + jego dzieci (podstrony)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'quest', component: QuestComponent },
      { path: 'character', component: CharacterComponent },
      { path: 'arena', component: ArenaComponent },
      { path: 'fight', component: FightComponent }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
