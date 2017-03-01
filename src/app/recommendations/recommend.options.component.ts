import { Component, OnInit } from '@angular/core';
import { Recommendations } from './../models';
import { ApiStore, RecommendOptionsService } from './../shared';

@Component({
    selector: 'recommend-options',
    templateUrl: './recommend.options.component.html',
    styleUrls: ['./recommend.options.component.scss']
})
export class RecommendOptionsComponent {

    public constructor(private store: ApiStore, private options: RecommendOptionsService ){
        
    } 
}