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
import { FiltersComponent } from './filters/filters.component';
import { GenreFilterComponent } from './genre-filter/genre-filter.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { RecommendTracksComponent } from './recommendations/recommend.tracks.component';
import { RecommendArtistsComponent } from './recommendations/recommend.artists.component';
import { RecommendOptionsComponent } from './recommendations/recommend.options.component';
import { TracksComponent } from './tracks/tracks.component';

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
  { path: 'test', component: TestComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'genre-filter', component: GenreFilterComponent },
  { path: 'recommendations', component: RecommendationsComponent,
    children: [
      { path: '', component: RecommendTracksComponent, outlet: 'recommendations' },
      { path: 'artist-view', component: RecommendArtistsComponent, outlet: 'recommendations' },
      { path: 'artists', component: ArtistsComponent, outlet: 'recommendations' },
      { path: 'genres', component: GenreFilterComponent, outlet: 'recommendations' },
      { path: 'options', component: RecommendOptionsComponent, outlet: 'recommendations' }
  ]},
  { path: 'tracks', component: TracksComponent } 
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
