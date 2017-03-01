import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist, Genre } from './../models';
import { ApiService, ApiHttpClient, UtilsService, ApiStore, FilterService } from './../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

declare var Isotope: any;
declare var jQuery: any;
declare var _ : any;
declare var $: any;

@Component({
  selector: 'artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

    resizeStream: Observable<any> =Observable.fromEvent(window, "resize");
    nameFilter : FormControl = new FormControl();
    itemWidth: string = '50%';
    artistsWidth: string = '100%';
    artistsLeft: string = '0';

    constructor(
        protected api:ApiService,
        protected store: ApiStore,
        protected apiHttp: ApiHttpClient,
        protected route: ActivatedRoute,
        protected router: Router,
        protected filters: FilterService,
        protected utils: UtilsService) {
    }


    ngOnInit() {

        // reinit the filter
        this.filters.text.next('');

        this.resizeScroll();
        this.resizeArtistItem();
        this.resizeStream.subscribe(x=>{
            this.resizeScroll();
            this.resizeArtistItem();
        });

        // close filters on enter
        Observable.fromEvent($('#navbar-secondary input'), 'keydown')
            .filter((x: any)=>x.key === 'Enter')
            .subscribe(x=> $('#navbar-secondary').removeClass('in'));           
    }

    // resizes the scroll area to fit the window
    resizeScroll(){
        $('#artists-scroll').height($(window).height()- 100);
    }

    resizeArtistItem(){
        if($(window).width() > 800){
            this.itemWidth = '50%';
        }else{
            this.itemWidth = '100%';
        }
        this.itemWidth = '100%';
        this.artistsWidth = '50%';
        this.artistsLeft = '50%';
    }

    // updates the filter streams
    private selectArtist(artist){
        let artists =this.filters.artists.getValue();
        if(_.indexOf(artists, artist) >= 0){
            artists =_.pull(artists, artist);
        }
        else{
            artists.push(artist);
        }
        this.filters.artists.next(artists);
    }

    // gets the background of an artist-item
    getBg(artist){
        let artists =this.filters.artists.getValue();
        artists =this.filters.artists.getValue();
        let selected = _.some(artists, x=>x.id===artist.id);
        let result = selected ? '#eee' : 'white'
        return result;

    }

}
