import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // List of documents for the whole application
  private documents: Document[] = [];
  // Highest Id number
  private maxDocId: number;
  // Setting up event emitters
  documentListChangedEvent = new Subject<Document[]>();

  // Imports from constant list of documents
  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocId = this.getMaxId();
  }

  // Returns a copy of all documents
  getDocuments() {
    return this.documents.sort((a,b)=>a.name>b.name?1:b.name>a.name?-1:0).slice();
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
    
    // Emitting change (reusing getDocuments() to reuse sort)
    this.documentListChangedEvent.next(this.getDocuments());
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

    // Emitting change (reusing getDocuments() to reuse sort)
    this.documentListChangedEvent.next(this.getDocuments());
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

    // Emitting change (reusing getDocuments() to reuse sort)
    this.documentListChangedEvent.next(this.getDocuments());
  }
}
