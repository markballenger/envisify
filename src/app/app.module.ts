import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ng2-webstorage';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { BubbleComponent } from './bubble/bubble.component';
import { ApiService } from './shared';
import { routing } from './app.routing';
import { AuthConfigService }  from './shared/authConfig.service';
//import { Logger } from 'angular2-logger/core';
import { ApiHttpClient } from './shared/apiHttpClient';
import { Typeahead } from './shared/typeahead/components/typeahead.component';
import { FocusDirective } from './shared/focus/focus';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { ListItemComponent } from './shared/list-item/list-item';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    Ng2Webstorage,
    VirtualScrollModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    AccountComponent,
    BubbleComponent,
    Typeahead,
    ListItemComponent,
    FocusDirective
  ],
  providers: [
    ApiService,
    //Logger,
    ApiHttpClient,
    AuthConfigService,
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
