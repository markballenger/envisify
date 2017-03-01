import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist, Genre } from './../models';
import { ApiService, UtilsService, ApiStore, FilterService } from './../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

    nameFilter : FormControl = new FormControl();

    constructor(protected filters: FilterService, protected store: ApiStore){

    }

    ngOnInit(){
        
    }

}