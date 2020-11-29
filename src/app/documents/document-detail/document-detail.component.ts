import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WindRefService } from 'src/app/wind-ref.service';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document: Document;
  lastId: string;
  sub: Subscription;
  nativeWindow: any;

  constructor(private docService: DocumentService,
              private windowRefService: WindRefService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.nativeWindow = this.windowRefService.getNativeWindow();
    this.route.params.subscribe(
      (params: Params) => {
        this.lastId = params['id'];
       this.document = this.docService.getDocument(params['id']);
      }
    );
    this.sub = this.docService.documentListChangedEvent.subscribe(
      () => {
        this.document = this.docService.getDocument(this.lastId);
    })
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.docService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
