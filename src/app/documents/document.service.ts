import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // List of documents for the whole application
  private documents: Document[] = [];
  // Current highest Id number
  private maxDocId: number;
  // Database connection url
  private dbUrl: string = "https://wdd-430-cms.firebaseio.com/documents.json"
  // Setting up event emitters
  documentListChangedEvent = new Subject<Document[]>();

  // Imports from constant list of documents
  constructor(private http: HttpClient) { 
    this.maxDocId = this.getMaxId();
  }

  // returns the sorted document list.
  sortDocuments() {
    this.documents = this.documents.sort((a,b)=>a.name.toLowerCase()>b.name.toLowerCase()?1:b.name.toLowerCase()>a.name.toLowerCase()?-1:0);
  }

  // Returns a copy of all documents
  getDocuments() {
    this.http.get<Document[]>(this.dbUrl).subscribe((documents: Document[]) => {
      // Get documents from database
      this.documents = documents;
      // Get the max id among them
      this.maxDocId = this.getMaxId();
      // Sort & Emit the document list
      this.sortDocuments();
      this.documentListChangedEvent.next(this.documents.slice());
    },
    (error: any) => {
      console.log("Get Documents Error: " + error);
    });
  }

  // Returns a single document by id or undefined if not found
  getDocument(id: string) {
    return this.documents.find(doc => doc.id === id);
  }

  // Returns the largest ID in the array
  getMaxId() {
    let maxId = 0;
    this.documents.map(doc => { if (maxId < +doc.id) { maxId = +doc.id }});
    return maxId;
  }

  // Stores the document list in the database 
  storeDocuments() {
    let documentsStr = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.dbUrl, documentsStr, { headers: headers }).subscribe(() => {
      // Sort & Emit the document list
      this.sortDocuments();
      this.documentListChangedEvent.next(this.documents.slice());
    });
  }

  // Adds a new document with a new unique ID to the documents array
  addDocument(newDoc: Document) {
    // Ensuring the new document exists
    if (!newDoc)
      return;

    // Creating and setting unique ID based on previous maxDocId
    this.maxDocId++;
    newDoc.id = this.maxDocId.toString();

    // Pushing the new doc onto the doc list
    this.documents.push(newDoc);

    // Store the document list in the database
    this.storeDocuments();
  }

  // Updates a document with a new one, replacing the old doc obj
  updateDocument(ogDoc: Document, newDoc: Document) {
    // Ensuring both docs exists
    if (!ogDoc || !newDoc)
      return;

    // If invalid index: leave function
    const pos = this.documents.indexOf(ogDoc);
    if (pos < 0) 
      return;

    // Replacing original doc with new one
    newDoc.id = ogDoc.id;
    this.documents[pos] = newDoc;

    // Store the document list in the database
    this.storeDocuments();
  }

  // Deletes a document from the document list and emits the change
  deleteDocument(doc: Document) {
    // If no document: leave function
    if (!doc)
      return;

    // If invalid index: leave function
    const pos = this.documents.indexOf(doc);
    if (pos < 0)
      return;

    // Removing document
    this.documents.splice(pos, 1);

    // Store the document list in the database
    this.storeDocuments();
  }
}
