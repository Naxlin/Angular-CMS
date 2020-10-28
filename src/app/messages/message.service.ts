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
  // Messages changed event emitter
  messageListChangedEvent = new Subject<Message[]>();

  // Get values from const message list
  constructor() { 
    this.messages = MOCKMESSAGES;
  }

  // Returns a copy of the message list
  getMessages() {
    return this.messages.slice();
  }

  // Returns a single message by id or undefined if not found
  getMessage(id: string) {
    return this.messages.find(message => message.id === id);
  }

  // Adds a message to the message list and updates dependant parties
  addMessage(message: Message) {
    this.messages.push(message);
    this.messageListChangedEvent.next(this.messages.slice());
  }
}
