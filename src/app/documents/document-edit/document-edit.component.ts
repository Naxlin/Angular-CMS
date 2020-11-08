import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode = false;

  constructor(private documentService: DocumentService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id: string = params.id;
        if (!id) {
          this.editMode = false;
          return;
        } 
        this.originalDocument = this.documentService.getDocument(id);
  
        if (!this.originalDocument)
          return;

        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onSubmit(form: NgForm) {
    if (this.editMode)
      this.documentService.updateDocument(this.originalDocument, form.value);
    else
      this.documentService.addDocument(form.value);
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
