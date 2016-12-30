import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist } from './../models/artist';
import { Genre } from './../models/genre';
import { ApiService } from './../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var Isotope: any;
declare var jQuery: any;
declare var _ : any;
declare var Holder: any;

@Component({
  selector: 'my-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    @HostListener('window:scroll', ['$event'])
    onScroll(){
        //this.artistsVisible.concat(_.take(_.skip(this.artists, this.artistsVisible.length), 10));
    }

    artists : Artist[];
    artistsVisible: Artist[];
    artistsNew: Artist[];
    scrollStream: Observable<any> = Observable.fromEvent(window, "scroll");
    genres : Genre[];
    selectedGenres : Genre[] = new Array<Genre>();
    iso : any;
    currentArtistIndex: number = 0;
    isoVisible: boolean = false;

    constructor(
        protected api:ApiService,
        protected route: ActivatedRoute,
        protected storage: LocalStorageService,
        protected genresDropdown: ElementRef) {
    }

    ngOnInit() {

        this.scrollStream
            //.debounce(()=> Observable.timer(300))
            // filter to only scroll events that reach the near bottom
            .filter(()=> (jQuery(window).scrollTop() + jQuery(window).height()) >= (jQuery(document).height()-50))
            // don't do scroll events if filter is applied
            .filter(()=> this.selectedGenres.length <= 0)
            .subscribe(x=> this.onScrollBottom(x));

        if(!this.artists){

            // start with an empty array
            this.artists = new Array<Artist>();
            this.genres = new Array<Genre>();

            // subscribe and wait for the return
            this.api.getAllArtists()
                .subscribe((artists: Artist[])=>{
                    this.artists = this.artists.concat(artists);
                    this.artistsVisible = _.take(this.artists, 30);
                    this.populateGenres();
                    this.setupIsotope();
            });
        } else{
            this.setupIsotope();
        }

    }

    //
    // scroll stream subscriber for scroll to bottom events
    //
    private onScrollBottom($event: any): void {

        // show the next 20 or so artists
        let newArtists = _.slice(this.artists, this.artistsVisible.length, this.artistsVisible.length + 20);
        
        // mark them as being new for the DOM
        _.each(newArtists, x=> x.isNew = true);
        
        // add them to the component property
        this.artistsVisible = this.artistsVisible.concat(newArtists);

        // timeout seems to be needed here for iso or jquery to be ready
        window.setTimeout(()=>{

            // get the DOM elements for isotope appended
            var elms = jQuery('.grid .isNew');

            // remove the marked class
            elms.removeClass('isNew');

            // call isotope appended to display the new items
            this.iso.appended(elms);
            
        }, 400);
    }

    //
    // populateGenres
    //
    populateGenres(){
        _.each(this.artists, a=>{
            _.each(a.genres, genre=>{
                if(!_.some(this.genres, g=> g.name === genre)){
                    this.genres.push(new Genre(genre, genre));
               }
            });
        });
    }

    //
    // setupIsotope: sets up the isotope layout
    //
    setupIsotope(){
        this.iso = new Isotope( '.grid', {
            itemSelector: '.grid-item',
            layoutMode: 'masonry'
        });
        this.busy(false);
    }

    //
    // filters the isotope layout by the user's genre selection
    //
    public filterByGenres(){
        this.busy(true);
        this.artistsVisible = _.filter(this.artists, a=> 
            this.hasMatchingGenres(a.genres, _.map(this.selectedGenres, 'name')));
        window.setTimeout(()=> this.setupIsotope(), 400);
    }

    //
    // checks two genre lists and specifies if they share a genre
    //
    hasMatchingGenres(genreListA: string[], genreListB: string[]) : boolean{
        let similar = _.intersection(genreListA, genreListB);
        if(similar.length > 0)
        return similar.length > 0;
    }

    //
    anyGenres(genreList, genre){
        _.some(genreList, g=> g.name === genre);
    }
 
    busy(isBusy: boolean){
        this.isoVisible = !isBusy;
    }
}
