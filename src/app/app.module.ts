import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ng2-webstorage';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { LazyLoadImageModule } from 'ng2-lazyload-image';

import { AppComponent } from './app.component';
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
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { RecommendTracksComponent } from './recommendations/recommend.tracks.component';
import { RecommendArtistsComponent } from './recommendations/recommend.artists.component';
import { RecommendOptionsComponent } from './recommendations/recommend.options.component';
import { TracksComponent } from './tracks/tracks.component';

import { ConsoleComponent } from './console/console.component';

import { routing } from './app.routing'; 

import { ConsoleService, 
    ApiService, 
    ApiHttpClient, 
    AuthConfigService, 
    UtilsService, 
    ApiStore,
    FilterService,
    ImageComponent,
    ResizeService,
    RecommendOptionsService,
    GestureService } from './shared';

import { RadialPlacementService, RadialNetworkService } from './shared/network';
import { SliderComponent } from './shared/slider/slider.component';
import { Typeahead } from './shared/typeahead/components/typeahead.component';
import { FocusDirective } from './shared/focus/focus';
import { GenreFilterComponent } from './genre-filter/genre-filter.component';
import { SwipeablesComponent } from './shared/swipeable';
import { MinMaxComponent } from './shared/minmax/minmax.component';
import { AbcComponent } from './shared/abc/abc.component';

import { ListItemComponent, GenreItemComponent, ArtistItemComponent, TrackItemComponent } from './shared/lists';
import { BtnGroupComponent } from './shared/btn-group/btn.group.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    Ng2Webstorage,
    LazyLoadImageModule,  
    VirtualScrollModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ArtistsComponent,
    BubbleComponent,
    ArtistBubbleComponent,
    ChordComponent,
    NetworkComponent,
    FiltersComponent,
    TestComponent,
    RelatedComponent,
    GenreFilterComponent,
    RecommendationsComponent,
    RecommendTracksComponent,
    RecommendArtistsComponent,
    RecommendOptionsComponent,
    TracksComponent,
    ConsoleComponent,

    GenreItemComponent,
    ArtistItemComponent,
    TrackItemComponent,
    ListItemComponent,

    SliderComponent,
    ImageComponent,
    Typeahead,
    BtnGroupComponent,
    FocusDirective,
    SwipeablesComponent,
    MinMaxComponent,
    AbcComponent
  ],
  providers: [
    UtilsService,
    AuthConfigService,
    ConsoleService,
    ApiService,
    FilterService,
    ApiStore,
    ApiHttpClient,
    ResizeService,
    GestureService,
    RadialPlacementService,
    RadialNetworkService,
    RecommendOptionsService,
    { provide: 'Window',  useValue: window }  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {  }
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
