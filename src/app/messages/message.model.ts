import { Contact } from '../contacts/contact.model';

export class Message {
    constructor(
        public id: number,
        public subject: string,
        public msgText: string,
        public sender: Contact,
    ) { }
}