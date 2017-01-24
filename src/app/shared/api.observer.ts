import { Inject, Injectable } from '@angular/core';
import { Observer } from 'rxjs'; 
import { Artist } from './../models';
import { ApiService } from './../shared';

declare var _: any;

@Injectable()
export class ApiObserver implements Observer<Artist[]> { 

    constructor(api : ApiService){
        
    }

    public next(value: Artist[]){
        _.each(value, a=>{
        });
    }

    public error(err){

    }

    public complete(){

    }

}