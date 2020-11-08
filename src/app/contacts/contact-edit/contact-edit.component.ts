import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  emailPattern: RegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  phonePattern: RegExp = /^\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*$/;
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  blurred: string;
  
  constructor(private contactService: ContactService,
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
        this.originalContact = this.contactService.getContact(id);
  
        if (!this.originalContact)
          return;

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.contact.group)
          this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
    });
  }

  onSubmit(form: NgForm) {
    if (this.editMode)
      this.contactService.updateContact(this.originalContact, form.value);
    else
      this.contactService.addContact(form.value);
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onRemoveItem(index: string) {
    if (+index < 0 || +index >= this.groupContacts.length)
      return;
   this.groupContacts.splice(+index, 1);
  }

  onBlur(s: string) {
    this.blurred = s;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groupContacts, event.previousIndex, event.currentIndex);
  }
}
