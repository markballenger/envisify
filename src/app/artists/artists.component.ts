import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist, Genre } from './../models';
import { ApiService, UtilsService, ApiStore } from './../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
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
    iso : any;

    nameFilter : FormControl = new FormControl();

    constructor(
        protected api:ApiService,
        protected store: ApiStore,
        protected route: ActivatedRoute,
        protected router: Router,
        protected storage: LocalStorageService,
        protected utils: UtilsService) {
    }

    ngOnInit() {

        this.store.filterArtistsByName('');

        // setup isotope
        this.store.artistsFiltered.subscribe();

        this.resizeStream.subscribe(x=>{
            $('vertical-scroll').height($(window).height()- 100);
        });

        this.nameFilter.valueChanges
            .debounceTime(500)
            .subscribe(x=>{
                this.store.filterArtistsByName(x);
            });
    }

    private artistSelected(e){
        this.store.filterArtistsByName(e.name);
        this.router.navigate(['network']);
    }

}
