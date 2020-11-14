import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // All messages in application
  private messages: Message[] = [];
  // Current highest Id number
  private maxMesId: number;
  // Database connection url
  private dbUrl: string = "https://wdd-430-cms.firebaseio.com/messages.json"
  // Messages changed event emitter
  messageListChangedEvent = new Subject<Message[]>();

  // Get values from const message list
  constructor(private http: HttpClient) { }

  // Returns a copy of the message list
  getMessages() {
    this.http.get<Message[]>(this.dbUrl).subscribe((messages: Message[]) => {
      // Get messages from database
      this.messages = messages;
      // Get the max id among them
      this.maxMesId = this.getMaxId();
      // Emit the message list
      this.messageListChangedEvent.next(this.messages.slice());
    },
    (error: any) => {
      console.log("Get Messages Error: " + error);
    });
  }

  // Returns a single message by id or undefined if not found
  getMessage(id: string) {
    return this.messages.find(message => message.id === id);
  }

  // Returns the largest ID in the array
  getMaxId() {
    let maxId = 0;
    this.messages.map(mes => { if (maxId < +mes.id) { maxId = +mes.id }});
    return maxId;
  }

  // Stores the message list in the database 
  storeMessages() {
    let messagesStr = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.dbUrl, messagesStr, { headers: headers }).subscribe(() => {
      // Emit the message list
      this.messageListChangedEvent.next(this.messages.slice());
    });
  }

  // Adds a message to the message list and updates dependant parties
  addMessage(message: Message) {
    // Ensuring the message exists
    if (!message)
      return;

    // Creating and setting unique ID based on previous maxMesId
    this.maxMesId++;
    message.id = this.maxMesId.toString();

    this.messages.push(message);
    this.storeMessages();
  }
}
