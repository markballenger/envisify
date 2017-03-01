import { Component, OnInit, ElementRef } from '@angular/core';
import { Artist, Genre } from './../models';
import { ApiService, UtilsService, ApiStore, FilterService } from './../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {

    constructor(protected filters: FilterService, protected store: ApiStore){

    }

    ngOnInit(){
        
    }

}