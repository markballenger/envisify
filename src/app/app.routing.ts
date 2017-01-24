import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ArtistsComponent } from './artists/artists.component';
import { BubbleComponent } from './bubble/bubble.component';
import { ArtistBubbleComponent } from './artist-bubble/artist-bubble.component';
import { ChordComponent } from './chord/chord.component';
import { NetworkComponent } from './network/network.component';
import { RelatedComponent } from './related/related.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'artists', component: ArtistsComponent},
  { path: 'bubble', component: BubbleComponent },
  { path: 'chord', component: ChordComponent },
  { path: 'network', component: NetworkComponent },
  { path: 'artist-bubble', component: ArtistBubbleComponent },
  { path: 'related', component: RelatedComponent },
  { path: 'test', component: TestComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
