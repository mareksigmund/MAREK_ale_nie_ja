import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuestComponent } from './pages/quest/quest.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CharacterComponent } from './pages/character/character.component';
import { ArenaComponent } from './pages/arena/arena.component';
import { FightComponent } from './components/fight/fight.component';
import { LevelupComponent } from './components/levelup/levelup.component';
import { ArenaFightComponent } from './components/arena-fight/arena-fight.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    QuestComponent,
    MainLayoutComponent,
    CharacterComponent,
    ArenaComponent,
    FightComponent,
    LevelupComponent,
    ArenaFightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
