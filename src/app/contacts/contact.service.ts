import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts() { // Returns a copy of contacts array
    return this.contacts.slice();
  }

  getContact(id: string) { // Returns a single contact by id
    return this.contacts.find(contact => contact.id === id); // Array.find() returns undefined if none found
  }
}
