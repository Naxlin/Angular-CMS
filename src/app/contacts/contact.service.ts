import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Application wide contacts list
  private contacts: Contact[] = [];
  // Highest Id number
  private maxContactId: number;
  // Database connection url
  private dbUrl: string = "https://wdd-430-cms.firebaseio.com/contacts.json";
  // Selecting a contact Event Emitters
  contactListChangedEvent = new Subject<Contact[]>();


  // grabs const contacts list from file
  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  // Sort Contacts
  sortContacts() {
    this.contacts = this.contacts.sort((a,b)=>a.name.toLowerCase()>b.name.toLowerCase()?1:b.name.toLowerCase()>a.name.toLowerCase()?-1:0)
  }

  // Returns a copy of contacts array
  getContacts() { 
    this.http.get<Contact[]>(this.dbUrl).subscribe((contacts: Contact[]) => {
      // Get documents from database
      this.contacts = contacts;
      // Get the max id among them
      this.maxContactId = this.getMaxId();
      // Sort & Emit the document list
      this.sortContacts();
      this.contactListChangedEvent.next(this.contacts.slice());
    },
    (error: any) => {
      console.log("Get Contacts Error: " + error);
    });
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

  // Stores the contact list in the database
  storeContact() {
    let contactsStr = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.dbUrl, contactsStr, { headers: headers }).subscribe(() => {
      // Sort & Emit the document list
      this.sortContacts();
      this.contactListChangedEvent.next(this.contacts.slice());
    });
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
    
    // Store the document list in the database
    this.storeContact();
  }

  // Updates a contact with a new one, replacing the old contact obj
  updateContact(ogContact: Contact, newContact: Contact) {
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

    // Store the document list in the database
    this.storeContact();
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

    // Store the document list in the database
    this.storeContact();
  }
}
