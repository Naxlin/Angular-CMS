import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // List of documents for the whole application
  private documents: Document[] = [];
  // Setting up event emitter
  documentSelectedEvent = new EventEmitter<Document>();


  // Imports from constant list of documents
  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  // Returns a copy of all documents
  getDocuments() {
    return this.documents.slice();
  }

  // Returns a single document by id or undefined if not found
  getDocument(id: string) {
    return this.documents.find(doc => doc.id === id);
  }
}
