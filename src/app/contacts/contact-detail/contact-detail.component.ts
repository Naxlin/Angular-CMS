import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})

export class ContactDetailComponent implements OnInit, OnDestroy {
  contact: Contact;
  lastId: string;
  sub: Subscription;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.lastId = params['id'];
        this.contact = this.contactService.getContact(params['id']);
      }
    );
    this.sub = this.contactService.contactListChangedEvent.subscribe(
      () => {
        this.contact = this.contactService.getContact(this.lastId);
    })
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(["/contacts"]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
