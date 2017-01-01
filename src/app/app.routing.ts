import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { BubbleComponent } from './bubble/bubble.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'account', component: AccountComponent},
  { path: 'bubble', component: BubbleComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
