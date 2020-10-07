import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [
    {id: 1, name: 'doc1', description: 'a blank doc', url: 'assets/images/template-doc.jpg'},
    {id: 2, name: 'doc2', description: 'a blank doc', url: 'assets/images/template-doc.jpg'},
    {id: 3, name: 'doc3', description: 'a blank doc', url: 'assets/images/template-doc.jpg'},
    {id: 4, name: 'doc4', description: 'a blank doc', url: 'assets/images/template-doc.jpg'},
  ]

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
