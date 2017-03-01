import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiStore, ApiHttpClient } from './../shared';

@Component({
    selector: 'recommend-artists',
    templateUrl: 'recommend.artists.component.html',
    styleUrls: ['recommend.artists.component.scss']
})
export class RecommendArtistsComponent implements OnInit{
    
    public constructor(private store: ApiStore, private apiHttp: ApiHttpClient){

    }

    ngOnInit(){
        this.store.recommendedArtists.subscribe();
    }

}