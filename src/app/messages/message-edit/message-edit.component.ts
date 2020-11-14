import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @Output() addMessageEvent = new EventEmitter<Message>();
  @ViewChild('subject', {static:false}) subject: ElementRef;
  @ViewChild('message', {static:false}) msgText: ElementRef;
  sender = "1"; // id of sender

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    let toSend = new Message("1", '', '', this.sender);
    toSend.subject = this.subject.nativeElement.value;
    toSend.msgText = this.msgText.nativeElement.value;
    this.messageService.addMessage(toSend);
    // Likely a good step in production:
    // this.clearFields();
  }

  clearFields() {
    this.subject.nativeElement.value = "";
    this.msgText.nativeElement.value = "";
  }
}
