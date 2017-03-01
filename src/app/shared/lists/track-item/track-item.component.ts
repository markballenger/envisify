import { Component, Input, OnInit } from '@angular/core';
import { Track } from './../../../models';

declare var _ : any;
declare var $ : any;

@Component({
    selector: 'track-item',
    template: `
    <div [style.width]="itemWidth" class="track-item noselect">
        
        <image [images]="track.album.images" [min]="130"></image> 
        <!--<i class="fa fa-check fa-3x" *ngIf="trackExists(track, (store.tracks | async))"></i>-->
        <div class="track-details">
            <h1 class="visible-lg visible-md">{{track.name}}&nbsp;<span class="badge popularity">{{track.popularity}}</span></h1>
            <h3 class="visible-sm visible-xs">{{track.name}}&nbsp;<span class="badge popularity">{{track.popularity}}</span></h3>
            <p><small>{{track.album.name}}</small></p>
            <span *ngFor="let artist of track.artists" class="badge" 
                [style.background]="artist.following ? '#888' : '#333'">
                <small><i class="fa fa-check" *ngIf="artist.following"></i>&nbsp;{{artist.name}}</small>
            </span>
        </div>
    </div>
    `,
    styleUrls: ['./track-item.component.scss']
})
export class TrackItemComponent implements OnInit {

    @Input() track: Track;

    public constructor(){

    }

    ngOnInit(){

    }

}