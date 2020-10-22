import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { DocumentsComponent } from './documents/documents.component';
import { MessageListComponent } from './messages/message-list/message-list.component';

const cmsRoutes: Routes = [
    { path: "", component: DocumentsComponent},
    { path: "contacts", component: ContactsComponent},
    { path: "documents", component: DocumentsComponent},
    { path: "messages", component: MessageListComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(cmsRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    
}