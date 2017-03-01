import { Component, OnInit } from '@angular/core';
import { ApiStore, ApiHttpClient } from './../shared';
import { Artist, Track } from './../models'; 
import { Observable, Subject } from 'rxjs';

declare var $: any;
declare var _: any;

@Component({
    selector: 'recommend-tracks',
    templateUrl: './recommend.tracks.component.html',
    styleUrls: ['./recommend.tracks.component.scss']
})
export class RecommendTracksComponent implements OnInit {

    resizeStream: Observable<any> =Observable.fromEvent(window, "resize");
    hasTracks: Observable<boolean>;
    itemWidth: string = '50%';
    
    constructor(private store: ApiStore, private apiHttp: ApiHttpClient){

    }

    ngOnInit(){
        
        this.resizeScroll();
        this.resizeTrackItems();
        this.resizeStream.subscribe(x=>{
            this.resizeScroll();
            this.resizeTrackItems();
        });
        
        this.hasTracks = this.store.recommendations.map(x=> x.tracks && x.tracks.length > 0);
        this.store.recommendations.subscribe();
    }

    // resizes the scroll area to fit the window
    resizeScroll(){
        $('#recommend-scroll').height($(window).height()- 100);
    }

    resizeTrackItems(){
        if($(window).width() >= 900){
            this.itemWidth = '50%';
        }else{
            this.itemWidth = '100%';
        }
    }

    getArtistNames(artists: Artist[]){
        return _.map(artists, 'name').join(', ');
    }

    trackExists(track:Track, tracks: Track[]){
        console.log(tracks);
        _.some(tracks, t=>t.id===track.id);
    }   

    addAll(){
        console.log('addall');
        this.store.recommendations
            .publishReplay(1)
            .refCount()
            .subscribe(x=>{
                console.log(x);
                this.store.addPlaylistQueue(x.tracks);
        });
    }
}