import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.css']
})
export class NewChatComponent implements OnInit {

  responses: {
    message: string, buttons?: {
      IntentId: string,
      IntentValue: string
    }[]
  }[] = [];

  prompt = 'Create a reservation '
  userName = 'ALEN'
  userRole = 'Admin'
  customerKey = 'IE'
  jsonBody = false;
  loading = false;



  constructor(
    // private http: HttpClient
  ) { }

  ngOnInit() {
  }



  send(msg?: string) {
    // this.http.post('http://chat-api.alenalex.me/KnowledgeBase/simple-stream', {
    //   userName: this.userName,
    //   userRole: this.userRole,
    //   customerKey: this.customerKey,
    //   text: this.prompt
    // }, {
    //   responseType: 'text'
    // }).subscribe(res => {
    //   console.log(res)
    // })
    let responseObj = ''
    this.loading = true;
    fetch("http://chat-api.alenalex.me/KnowledgeBase/simple-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the correct Content-Type
        "Cache": "no-cache", // Disable caching of this request
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        userName: this.userName,
        userRole: this.userRole,
        customerKey: this.customerKey,
        text: msg ?? this.prompt
      })
    }).then(async (res) => {
      const reader = res.body.getReader();
      const index = this.responses.length;
      for await (const chunk of readChunks(reader)) {
        // if (this.jsonBody) {
        //   console.log("-----------")
        //   console.log(chunk)
        //   console.log(JSON.parse(chunk))
        //   console.log("-------------")
        //   continue;
        // }
        // if (chunk === "_END_") {
        //   this.jsonBody = true;
        //   continue;
        // }
        console.log(chunk)
        responseObj += chunk
        this.responses[index] = {
          message: responseObj
        };
      }
      this.loading = false;
      console.log(this.responses[index])
      const endIndex = this.responses[index].message.indexOf("_END_")
      if (endIndex !== -1) {
        const json = this.responses[index].message.substring(endIndex + 6);
        console.log(json)
        this.responses[index].message = this.responses[index].message.substring(0, endIndex);
        const jsonParsed = this.getJsonIfJsonBody(json);
        if (typeof jsonParsed === 'object') {
          this.responses[index].buttons = jsonParsed;
        }
      }
    }).catch(err => {
      console.log(err)
      this.loading = false;
    })
  }
  // readChunks() reads from the provided reader and yields the results into an async iterable
  // Modify the readChunks function to decode the binary data

  private getJsonIfJsonBody(text: string) {
    try {
      return JSON.parse(text)
    } catch (e) {
      console.log(e)
      return text
    }
  }
}
async function* readChunks(reader) {
  const textDecoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunk = textDecoder.decode(value);
    yield chunk;
  }
} 