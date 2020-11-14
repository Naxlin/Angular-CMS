import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term): any {
    let filtered: Contact[] = [];

    if (term || term.length > 0) {
      filtered = contacts.filter((contact: Contact) => {
        return contact.name.toLowerCase().includes(term.toLowerCase());
      });
    }
    
    if (filtered.length < 1)
      return contacts;

    return filtered;
  }
}
