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
  // Highest Id number
  private maxContactId: number;
  // Selecting a contact Event Emitters
  contactListChangedEvent = new Subject<Contact[]>();


  // grabs const contacts list from file
  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
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

  // Returns the largest ID in the array
  getMaxId() {
    let maxId = 0;
    this.contacts.map(doc => { if (maxId < +doc.id) { maxId = +doc.id }});
    console.log(maxId);
    return maxId;
  }

  // Adds a new contact with a new unique ID to the contacts array
  addContact(newContact: Contact) {
    // Ensuring the new contact exists
    if (!newContact)
      return;

    // Creating and setting unique ID based on previous maxContactId
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    // Pushing the new contact onto the contact list
    this.contacts.push(newContact);
    
    // Emitting change (reusing getContacts() to reuse sort)
    this.contactListChangedEvent.next(this.getContacts());
  }

  // Updates a contact with a new one, replacing the old contact obj
  updateDocument(ogContact: Contact, newContact: Contact) {
    // Ensuring both contacts exists
    if (!ogContact || !newContact)
      return;

    // If invalid index: leave function
    const pos = this.contacts.indexOf(ogContact);
    if (pos < 0) 
      return;

    // Replacing original contact with new one
    newContact.id = ogContact.id;
    this.contacts[pos] = newContact;

    // Emitting change (reusing getContacts() to reuse sort)
    this.contactListChangedEvent.next(this.getContacts());
  }
  
  deleteContact(contact: Contact) {
    // If no contact: leave function
    if (!contact)
      return;
      
    // If invalid index: leave function
    const pos = this.contacts.indexOf(contact);
    if (pos < 0)
      return;

    // Removing document
    this.contacts.splice(pos, 1);

    // Emitting change (reusing getDocuments() to reuse sort)
    this.contactListChangedEvent.next(this.getContacts());
  }
}
