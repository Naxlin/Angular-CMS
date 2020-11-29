import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // List of documents for the whole application
  private documents: Document[] = [];
  // Database connection url
  private dbUrl: string = "http://localhost:3000/documents/";
  // Setting up event emitters
  documentListChangedEvent = new Subject<Document[]>();

  // Imports from constant list of documents
  constructor(private http: HttpClient) { }

  // returns the sorted document list.
  sortAndSend() {
    this.documents = this.documents.sort((a,b)=>a.name.toLowerCase()>b.name.toLowerCase()?1:b.name.toLowerCase()>a.name.toLowerCase()?-1:0);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  // Returns a copy of all documents
  getDocuments() {
    this.http.get<{ message: String, documents: Document[]}>(this.dbUrl).subscribe((res: any) => {
      // Get documents from database
      this.documents = res.documents;
      // Sort & Emit the document list
      this.sortAndSend();
    },
    (error: any) => {
      console.log("Get Documents Error: " + error);
    });
  }

  // Returns a single document by id or undefined if not found
  getDocument(id: string) {
    return this.documents.find(doc => doc.id === id);
  }

  // Adds a new document with a new unique ID to the documents array
  addDocument(newDoc: Document) {
    // Ensuring the new document exists
    if (!newDoc)
      return;

    // Removing id if it exists (db sets this)
    newDoc.id = '';
  
    // setting headers for the http post
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>(this.dbUrl, newDoc, { headers: headers }).subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      }
    );
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

    // Setting header
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put(this.dbUrl + ogDoc.id, newDoc, { headers: headers }).subscribe(
      (response: Response) => {
        this.documents[pos] = newDoc;
        this.sortAndSend();
      }
    );
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

    // delete from database
    this.http.delete(this.dbUrl + doc.id).subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      }
    );
  }
}