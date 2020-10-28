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
  // Setting up event emitters
  documentSelectedEvent = new Subject<Document>();
  documentListChangedEvent = new Subject<Document[]>();


  // Imports from constant list of documents
  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  // Returns a copy of all documents
  getDocuments() {
    return this.documents.sort((a,b)=>a.name>b.name?1:b.name>a.name?-1:0).slice();
  }

  // Returns a single document by id or undefined if not found
  getDocument(id: string) {
    return this.documents.find(doc => doc.id === id);
  }

  // Deletes a document from the document list and emits the change
  deleteDocument(doc: Document) {
    if (!doc) {
      // If no document: leave function
      return;
    }

    const pos = this.documents.indexOf(doc);
    if (pos < 0) {
      // If invalid index: leave function
      return;
    }

    // Removing document
    this.documents.splice(pos, 1);
    // Emitting change (reusing getDocuments() to reuse sort)
    this.documentListChangedEvent.next(this.getDocuments());
  }
}
