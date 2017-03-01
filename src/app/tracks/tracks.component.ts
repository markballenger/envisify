import { Component, OnInit } from '@angular/core';
import { ApiStore, ApiHttpClient } from './../shared';
import { Track } from './../models';
import { Observable } from 'rxjs';

declare var _: any;
declare var $: any;

@Component({
    selector: 'tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {

    resizeStream: Observable<any> = Observable.fromEvent(window, 'resize');
    itemWidth: string = '50%';

    constructor(private store: ApiStore, private apiHttp: ApiHttpClient){
        
        this.resizeScroll();
        this.resizeStream.subscribe(x=>{
            this.resizeScroll();
            this.resizeTrackItem();
        });

        this.store.tracks.subscribe(x=>{
            
        });
    }

    ngOnInit(){

    }

        // resizes the scroll area to fit the window
    resizeScroll(){
        $('#artists-scroll').height($(window).height()- 100);
    }

    resizeTrackItem(){
        if($(window).width() > 800){
            this.itemWidth = '50%';
        }else{
            this.itemWidth = '100%';
        }
    }

}