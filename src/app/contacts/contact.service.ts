import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Application wide contacts list
  private contacts: Contact[] = [];
  // Database connection url
  private dbUrl: string = "http://localhost:3000/contacts/";
  // Selecting a contact Event Emitters
  contactListChangedEvent = new Subject<Contact[]>();


  // grabs const contacts list from file
  constructor(private http: HttpClient) { }

  // Sort Contacts
  sortAndSend() {
    this.contacts = this.contacts.sort((a,b)=>a.name.toLowerCase()>b.name.toLowerCase()?1:b.name.toLowerCase()>a.name.toLowerCase()?-1:0)
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  // Returns a copy of contacts array
  getContacts() { 
    this.http.get<{message: String, contacts: Contact[]}>(this.dbUrl).subscribe((res: any) => {
      // Get contacts from database
      this.contacts = res.contacts;
      // Sort & Emit the contact list
      this.sortAndSend();
    },
    (error: any) => {
      console.log("Get Contacts Error: " + error);
    });
  }

  // Return a single contact by id and through database
  getContactAPI(id: string) {
    return this.http.get<{message: String, contact: Contact}>(this.dbUrl + id);
  }

  // Returns a single contact by id
  getContact(id: string) { 
    // Array.find() returns contact object if found or the value undefined
    return this.contacts.find(contact => contact.id === id);
  }

  // Adds a new contact with a new unique ID to the contacts array
  addContact(newContact: Contact) {
    // Ensuring the new contact exists
    if (!newContact)
      return;

    // Removing id if it exists (db sets this)
    newContact.id = '';

    // setting headers for the http post
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    // add to database
    this.http.post<{ message: string, contact: Contact }>(this.dbUrl, newContact, { headers: headers }).subscribe(
      (responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      }
    );
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

    // Setting header
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put(this.dbUrl + ogContact.id, newContact, { headers: headers }).subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      }
    );
  }
  
  deleteContact(contact: Contact) {
    // If no contact: leave function
    if (!contact)
      return;
      
    // If invalid index: leave function
    const pos = this.contacts.indexOf(contact);
    if (pos < 0)
      return;

    // delete from database
    this.http.delete(this.dbUrl + contact.id).subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      }
    );
  }
}
