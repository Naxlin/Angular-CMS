import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Application wide contacts list
  private contacts: Contact[] = [];
  // Selecting a contact Event Emitter
  contactSelectedEvent = new EventEmitter<Contact>();


  // grabs const contacts list from file
  constructor() {
    this.contacts = MOCKCONTACTS; 
  }

  // Returns a copy of contacts array
  getContacts() { 
    return this.contacts.slice();
  }

  // Returns a single contact by id
  getContact(id: string) { 
    // Array.find() returns contact object if found or the value undefined
    return this.contacts.find(contact => contact.id === id);
  }
}
