import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from '../contacts/contact.model';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // All messages in application
  private messages: Message[] = [];
  // Database connection url
  private dbUrl: string = "http://localhost:3000/messages/";
  // Messages changed event emitter
  messageListChangedEvent = new Subject<Message[]>();

  // Get values from const message list
  constructor(private http: HttpClient) { }

  send() {
    this.messageListChangedEvent.next(this.messages.slice());
  }

  // Returns a copy of the message list
  getMessages() {
    this.http.get<{ message: String, messages: Message[]}>(this.dbUrl).subscribe((res: any) => {
      // Get messages from database
      this.messages = res.messages;
      // Emit the message list
      this.send();
    },
    (error: any) => {
      console.log("Get Messages Error: " + error);
    });
  }

  // Returns a single message by id or undefined if not found
  getMessage(id: string) {
    return this.messages.find(message => message.id === id);
  }

  // Adds a message to the message list and updates dependant parties
  addMessage(message: Message) {
    // Ensuring the message exists
    if (!message)
      return;

    // Removing id if it exists (db sets this)
    message.id = '';
      
    // setting headers for the http post
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, mess: Message }>(this.dbUrl, message, { headers: headers }).subscribe(
      (responseData) => {
        // add new message to messages
        this.messages.push(responseData.mess);
        this.send();
      }
    );
  }
}
