import { Injectable } from '@angular/core';
import { Genre, Artist, Filters, Track } from './../models';
import { IGenres, IName } from './../models/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

declare var _: any;

@Injectable()
export class FilterService { 

    // expose public subjects for user input bindings 
    public genres: BehaviorSubject<Genre[]> = new BehaviorSubject<Genre[]>([]);
    public artists: BehaviorSubject<Artist[]> = new BehaviorSubject<Artist[]>([]);
    public text: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public includeFollowed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public sortBy: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public sortDir: BehaviorSubject<string> = new BehaviorSubject<string>('desc');

    // encapsulate what we can
    private _genreDisplay: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public genreDisplay: Observable<string> = this._genreDisplay.asObservable();

    private _all: BehaviorSubject<Filters> = new BehaviorSubject<Filters>(new Filters());
    public all: Observable<Filters> = this._all.asObservable();

    constructor(){
    
        // update display values when the selected genre filters change
        this.genres.subscribe(x=>{
            this._genreDisplay.next(_.map(x, 'name').join(', '));
        });

        // combine all the streams and broadcast one filter 
        this.text.combineLatest(
                this.artists,
                this.genres, 
                this.sortBy,
                this.sortDir,
                this.includeFollowed)
            .subscribe(x=>{
                
                let filter = this._all.getValue();
                
                filter.text = x[0];
                filter.artists = x[1];
                filter.genres = x[2];
                filter.sortBy = x[3];
                filter.sortDir = x[4];
                filter.excludeMy = x[5];
                
                // now broadcast
                this._all.next(filter);
            });

    }


    public sort<T>(list: T[], filters: Filters){

        // apply sorting        
        list = _.sortBy(list, this.getSort(filters));
        if(filters.sortDir==='desc')
            list = list.reverse();  

        return list;
    }    

    // helper method
    private getSort(filters: Filters){
        switch((filters.sortBy || '').toLowerCase()){
            case 'popularity' : return ['popularity'];
            case 'name': return ['name'];
            case 'followers' : return ['followers.total'];
            default: return ['popularity'];
        }
    }

    //
    // checks two genre lists and specifies if they share a genre
    //
    private hasMatchingGenres(genreListA: string[], genreListB: string[]) : boolean{
        let similar = _.intersection(genreListA, genreListB);
        if(similar.length > 0)
        return similar.length > 0;
    }


    public filterByGenres<T extends IGenres>(list: T[], filters: Filters){
        let genreStrings = _.map(filters.genres, 'name');
        return _.filter(list, a=> 
            genreStrings.length === 0 || this.hasMatchingGenres(a.genres, genreStrings));
    }

    //
    // filterByName
    //
    public filterByName<T extends IName>(objs: T[], filters: Filters) {
        let text = filters.text || '';
        var re =  new RegExp(text, 'gi');
        return _.filter(objs, a=> 
            text.length === 0 || re.test(a.name));
    }

}