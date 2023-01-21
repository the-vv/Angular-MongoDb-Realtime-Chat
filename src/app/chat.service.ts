import { Injectable } from '@angular/core';
import * as Realm from "realm-web";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public app = new Realm.App({ id: 'ie-chat-tweem' });
  public loading = false;

  public messages: any[] = [];

  constructor() {
    this.login();
  }

  public async login() {
    const credentials = Realm.Credentials.anonymous();
    const user = await this.app.logIn(credentials);
    console.assert(user.id === this.app?.currentUser?.id);
  }

  public delete(id: Realm.BSON.ObjectId) {
    const collection = this.getCollection()
    collection?.deleteOne({
      _id: id
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  public async getData() {
    const collection = this.getCollection()
    collection?.find().then(res => {
      this.messages = res;
      console.log(this.messages)
      this.loading = false;
    }).catch(err => {
      console.log(err)
    })
  }

  private getCollection() {
    const mongo = this.app?.currentUser?.mongoClient('ie-chat');
    const collection = mongo?.db('iechat').collection('chats');
    return collection;
  }

  public addOne(message: string, userName: string) {
    const collection = this.getCollection()
    collection?.insertOne({
      message,
      userName
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  public async listenChanges() {
    const collection = this.getCollection()
    const obj = collection?.watch();
    if (!obj) return;
    for await (const change of obj) {
      this.getData();
    }
  }

}
