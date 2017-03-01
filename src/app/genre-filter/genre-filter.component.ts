import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist, Genre } from './../models';
import { ApiService, UtilsService, ApiStore, FilterService } from './../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

declare var Isotope: any;
declare var $: any;
declare var _: any;

@Component({
    selector: 'genre-filter',
    templateUrl: './genre-filter.component.html',
    styleUrls: ['./genre-filter.component.scss']
})
export class GenreFilterComponent implements OnInit {

    iso: any;
    resizeStream: Observable<any> =Observable.fromEvent(window, "resize");
    nameFilter: FormControl = new FormControl();

    constructor(protected filters: FilterService, protected store: ApiStore){

    }

    ngOnInit(){

        this.resizeScroll();
        this.resizeStream.subscribe(x=>{
            this.resizeScroll();
        });

        // close filters on enter
        Observable.fromEvent($('#navbar-secondary input'), 'keydown')
            .filter((x: any)=>x.key === 'Enter')
            .subscribe(this.closeFilters);
        
        // close filters on delayed mouse out 
        Observable.fromEvent($('#navbar-secondary'), 'mouseleave')
            .timestamp()
            .pluck('timestamp')
            .delay(3000)
            .combineLatest(Observable.fromEvent($('#navbar-secondary'), 'mouseenter').timestamp().pluck('timestamp'))
            .filter((x: any)=> x[0]-x[1] > 0)
            .subscribe(this.closeFilters);       

        // close filters when touching the scroll view
        Observable.fromEvent($('#genre-scroll'), 'mousedown')
            .subscribe(this.closeFilters);    
    }

    private closeFilters(){
        $('#navbar-secondary').removeClass('in');
    }

    getBg(genre){
        let genres =this.filters.genres.getValue();
        genres =this.filters.genres.getValue();
        let selected = _.some(genres, x=>x.name===genre.name);
        let result = selected ? 'limegreen' : this.getColor(genre.count)
        return result;
    }

    selectGenre(genre){
        let genres =this.filters.genres.getValue();
        if(_.indexOf(genres, genre) >= 0){
            genres =_.pull(genres, genre);
        }
        else{
            genres.push(genre);
        }
        this.filters.genres.next(genres);
    }   
    
    getColor(popularity: number){
        popularity = popularity + 50;
        let red = Math.round(popularity * 255/100); 
        return 'rgb(' + red + ',0,0)';
    }

    // getC(popularity: number){
    //     if (popularity < 50){
    //         return 'white';
    //     }
    // }

    resizeScroll(){
        $('#genre-scroll').height($(window).height()- 100);
    }

    setupIso(){
        this.iso = new Isotope( '.genre-grid', {
            itemSelector: '.genre-item',
            layoutMode: 'masonry'
        });   
    }

}