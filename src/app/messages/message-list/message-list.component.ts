import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(1, "subject 1", "this is message 1", "Jonathan Smith"),
    new Message(2, "subject 2", "this is message 2", "Jonathan Smith"),
    new Message(3, "subject 3", "this is message 3", "Jonathan Smith"),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
