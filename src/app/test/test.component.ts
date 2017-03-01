import { Component, OnInit } from '@angular/core';
import { ApiStore, FilterService } from './../shared';
import { Observable } from 'rxjs';
import { Artist } from './../models';

declare var _ : any;

@Component({
    selector: 'test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit{

    artists : Artist[];
    
    constructor(protected store: ApiStore, protected filter: FilterService){

    }

    ngOnInit(){

        //this.testRelatedStream();
        this.testFilter();
    }

    testFilter(){
        this.filter.text.subscribe(x=>console.log(x));
    }

    testRelatedStream(){
        let relatedStream = this.store.artistsFiltered
            .flatMap(x=>x)
            .flatMap(x=>x.relatedArtists.take(3))
            .flatMap(x=> x)
            .take(2)    
            .subscribe(x=>{
                console.log(x);
            });
    }

    related(artist : Artist){
        artist.relatedArtists
            .subscribe(r=>{
                
            });
    }

}
