import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist, Genre } from './../models';
import { ApiService, UtilsService, ApiStore, ApiHttpClient, FilterService, GestureService } from './../shared';
import { SwipeRoute } from './../shared/swipeable';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

declare var Isotope: any;
declare var $: any;
declare var _: any;

@Component({
    selector: 'recommendations',
    templateUrl: './recommendations.component.html',
    styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {

    swipeRoutes: SwipeRoute[] = [
        new SwipeRoute('left', 'artists'),
        new SwipeRoute('right', 'genres'),
        new SwipeRoute('down', 'artist-view')
    ];

    constructor(protected filters: FilterService, 
        protected store: ApiStore,
        protected apiHttp: ApiHttpClient){

    }

    ngOnInit(){
    }

}