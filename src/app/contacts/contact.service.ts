import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Application wide contacts list
  private contacts: Contact[] = [];
  // Selecting a contact Event Emitters
  contactListChangedEvent = new Subject<Contact[]>();


  // grabs const contacts list from file
  constructor() {
    this.contacts = MOCKCONTACTS; 
  }

  // Returns a copy of contacts array
  getContacts() { 
    return this.contacts.sort((a,b)=>a.name>b.name?1:b.name>a.name?-1:0).slice();
  }

  // Returns a single contact by id
  getContact(id: string) { 
    // Array.find() returns contact object if found or the value undefined
    return this.contacts.find(contact => contact.id === id);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      // If no contact: leave function
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      // If invalid index: leave function
      return;
    }

    // Removing document
    this.contacts.splice(pos, 1);
    // Emitting change (reusing getDocuments() to reuse sort)
    this.contactListChangedEvent.next(this.getContacts());
  }
}
