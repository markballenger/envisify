import { Injectable  } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var $: any;

@Injectable()
export class ResizeService {

    resizeStream: Observable<any> =Observable.fromEvent(window, "resize");

    constructor(){

    }

    subscribe(selector: string, offsetHeight: number, offSetWidth: number){
        this.resize(selector, offSetWidth, offSetWidth);
        this.resizeStream.subscribe(x=>{
            this.resize(selector, offsetHeight, offSetWidth);
        });
    }

    resize(selector: string, offsetHeight: number, offSetWidth: number){
        debugger;
        if(offsetHeight)
            $(selector).height($(window).height()- offsetHeight);
        if(offSetWidth)
            $(selector).width($(window).width()- offSetWidth);
    }
}