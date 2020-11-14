import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  subscription: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.messageService.messageListChangedEvent.subscribe(
      (messages: Message[]) => { this.messages = messages; }
    );
    this.messageService.getMessages();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
