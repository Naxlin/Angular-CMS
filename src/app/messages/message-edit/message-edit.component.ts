import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
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
  sender: Contact; // sender

  constructor(private messageService: MessageService,
              private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContactAPI("101").subscribe((res: any) => {
      this.sender = res.contact;
    });
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
