import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewChatComponent } from './new-chat/new-chat.component';

const routes: Routes = [
  {
    path: 'new', component: NewChatComponent
  },
  {
    path: '', redirectTo: 'new', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
