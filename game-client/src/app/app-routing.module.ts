import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { QuestComponent } from './pages/quest/quest.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'quest', component: QuestComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
