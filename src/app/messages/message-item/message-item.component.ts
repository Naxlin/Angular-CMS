import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContactAPI(this.message.sender).subscribe((res: any) => {
      console.log(this.message.sender)
      const contact: Contact = res.contact
      this.messageSender = contact.name;
    });
  }
}
