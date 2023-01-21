import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  

  public userName: string = '';
  showChat = false;
  message = '';

  constructor(
    public chats: ChatService
  ) { }

  ngOnInit() {
    new ResizeObserver(el => {
      setTimeout(() => {
        document.body.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }).observe(document.body)
  }

  onStart() {
    if (this.userName.length) {
      this.showChat = true;
      this.chats.getData();
      this.chats.listenChanges();
      this.chats.loading = true
    }
  }

  onSend() {
    if (this.message) {
      this.chats.addOne(this.message, this.userName);
      this.message = '';
      this.chats.loading = true
    }
  }

  onDelete(id: any) {
    this.chats.delete(id)
    this.chats.loading = true
  }
  
}
