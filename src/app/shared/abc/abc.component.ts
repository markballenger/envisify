import { Component, OnInit } from '@angular/core';
import { FilterService, GestureService } from './../../shared';

declare var _ : any;

@Component({
    selector: 'abc',
    templateUrl: './abc.component.html',
    styleUrls: ['./abc.component.scss']
})
export class AbcComponent implements OnInit {

    private abc: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //resizeStream: Observable<any> = Observable.fromEvent(document, 'resize');
    height: string = '100%';
    liHeight: string = (1/26).toFixed() + '%';

    constructor(filter: FilterService, private gesture: GestureService){
        
    }

    ngOnInit(){
        this.gesture
    }

}