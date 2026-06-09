import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CareersComponent } from './careers/careers.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'careers', component: CareersComponent }
];

@NgModule({
  declarations: [AboutComponent, ContactComponent, CareersComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class PagesModule {}
