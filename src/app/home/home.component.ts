import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService, ApiStore, ListItem, AuthConfigService } from './../shared';
import { Artist, Genre } from './../models';
import { Observable } from 'rxjs';
//import { Logger } from 'angular2-logger/core';

declare var _ : any;
declare var Isotope: any;
declare var $ : any;

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  public busy: boolean = true;
  protected artists : Observable<Artist[]>;
  protected iso : any;

  constructor(protected store: ApiStore, protected auth: AuthConfigService 
  /*private logger: Logger*/) {
    // Do stuff
    //logger.level = logger.Level.LOG;
  }

  ngOnInit() {

        if(this.auth.isAuthenticated()){
            
            this.artists = this.store.artistsFiltered
            .debounce(()=> Observable.timer(2000))
            .map(a=> _.take(_.sortBy(a, x=>x.populatity * -1), 20));
          
            this.artists
              .delay(1000)
              .debounce(()=>Observable.timer(700))
              .subscribe(newArtists=>{
                    this.store.busy = true;
                    this.setupIsotope();
                    $('.grid').fadeTo(2000, 1);
                    this.store.busy = false;
                });
        }

        $('.overlay-inside').fadeIn(3000);
        
    }

  
    //
    // setupIsotope: sets up the isotope layout
    //
    setupIsotope(){

        this.iso = new Isotope( '.grid', {
            itemSelector: '.grid-item',
            layoutMode: 'masonry'
        });

        Observable.interval(5000)
          .subscribe(x=>{
            this.iso.shuffle();
          });
    }


}
