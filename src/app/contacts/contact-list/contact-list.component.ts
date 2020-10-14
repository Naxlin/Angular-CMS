import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelected(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }
}
