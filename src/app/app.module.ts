import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ng2-webstorage';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
//import { Logger } from 'angular2-logger/core';
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

import { routing } from './app.routing'; 

import { ApiService, 
    ApiHttpClient, 
    AuthConfigService, 
    UtilsService, 
    ApiStore,
    ImageComponent } from './shared';

import { RadialPlacementService, RadialNetworkService } from './shared/network';
import { SliderComponent } from './shared/slider/slider.component';
import { Typeahead } from './shared/typeahead/components/typeahead.component';
import { FocusDirective } from './shared/focus/focus';

import { ListItemComponent, GenreItemComponent, ArtistItemComponent } from './shared/lists';

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
    SliderComponent,
    ImageComponent,
    RelatedComponent,
    TestComponent,
    Typeahead,
    ListItemComponent,
    GenreItemComponent,
    ArtistItemComponent,
    FocusDirective
  ],
  providers: [
    ApiService,
    ApiStore,
    //Logger,
    ApiHttpClient,
    AuthConfigService,
    UtilsService,
    RadialPlacementService,
    RadialNetworkService,
    { provide: 'Window',  useValue: window }  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
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
