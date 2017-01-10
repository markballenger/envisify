import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Artist, Genre } from './../models';
import { ApiService, UtilsService } from './../shared';

import { Router, ActivatedRoute } from '@angular/router';

declare var _ : any;

@Injectable() 
export class ApiStore {

    private _allArtists: BehaviorSubject<Artist[]> = new BehaviorSubject([]);
    public allArtists: Observable<Artist[]> = this._allArtists.asObservable();

    private _artistsFiltered:  BehaviorSubject<Artist[]> = new BehaviorSubject([]);
    public artistsFiltered: Observable<Artist[]> = this._artistsFiltered.asObservable();

    private _genres: BehaviorSubject<Genre[]> = new BehaviorSubject([]);
    public genres: Observable<Genre[]> = this._genres.asObservable();

    private _genreFilter: BehaviorSubject<string> = new BehaviorSubject('');
    public genreFilter: Observable<string> = this._genreFilter.asObservable();

    private genreFilterCache : Array<string> = new Array<string>();
    private artistNameFilterCache : string = '';


    constructor(
        protected api : ApiService,  
        protected utils : UtilsService, 
        protected router : Router,
        protected route: ActivatedRoute){
            this.initialize();  
    }

    //
    // init the store
    //
    private initialize(){

        // track our initial empty value
        let artistsInit = this._artistsFiltered.getValue();
    
        // subscribe and wait for the api return
        this.api.getAllArtists()
            .finally(()=> {
                // after all api subscribes are done, pump our observables
                this._allArtists.next(artistsInit);
                this._artistsFiltered.next(artistsInit);
            })
            .subscribe((a: Artist[])=>{
                this.populateRelatedArtists(a);
                artistsInit = artistsInit.concat(a);
                this.populateGenres(a);
            });

        // // this.router.events
        // //     .subscribe(d=>{
        // //         let genreFilter = this.utils.getQueryFromUrl('genre', d.url);
        // //         let foundGenre = _.find(this._genres.getValue(), {name: genreFilter});
        // //         this.filterArtistsByGenre();
        // //     });

        // figure out how to subscribe to router observable of route
        
        
        // var routeValueGenre = this.utils.extractFromRoute('genre');

        // if(routeValueGenre != null && routeValueGenre.length > 0){
        //         let foundGenre = _.find(this.genres, g=>g.name === routeValueGenre);
        //     if(foundGenre != null){
        //         this.selectedGenres.push(foundGenre);
        //         this.filterByGenres();
        //     }
        // }

    }

    //
    // populateRelatedArtists
    //
    private populateRelatedArtists(allArtists: Artist[]){
        _.each(allArtists, a=>{

            // specify that the artists exists in the user's library
            a.existsInLibrary = true;
            this.relatedRecursion(a, 1);            
        });
    }

    private relatedRecursion(artist: any, depth: number){
        this.api.getRelatedArtists(artist.id)
            .subscribe((related: any[])=>{
                artist.relatedArtists = related;
                
                // max depth of recursion (currently none)
                if(depth < 1){
                    _.each(artist.relatedArtists, x=>{
                        this.relatedRecursion(x, depth++);
                    });
                }
            });
    }
    
    //
    // populateGenres
    //
    private populateGenres(artists: Artist[]){
        
        let genreList = this._genres.getValue();

         _.each(artists, a=>{
            _.each(a.genres, genre=>{
               let item = _.find(genreList, g=>g.name === genre);
               if(!item){
                   item = new Genre(genre, genre);
                    genreList.push(item);
               }
               item.count++;
            });
        });

        // sort by most popular in user's collection
        genreList = _.sortBy(genreList, g=> -1 * g.count);

        // broadcast on our observable
        this._genres.next(genreList);
    }

    //
    // filterArtists: applies filter to exposed observable
    //
    public filterArtistsByGenre(genresFilter: Array<Genre>){
        // set the cached value
        let genreStrings = _.map(genresFilter, 'name'); 
        this.genreFilterCache = genreStrings;
        
        // apply all filters
        let artists = this._allArtists.getValue();
        artists = this.getFilteredArtistsByGenre(artists, genreStrings);
        artists = this.getFilteredAritstsByName(artists, this.artistNameFilterCache);
        
        // broadcast
        this._artistsFiltered.next(artists);
        this._genreFilter.next(genreStrings.join(', '));    
    }

    // 
    // getFilteredArtistsByGenre: returns a filtered list of artists
    //
    private getFilteredArtistsByGenre(artists : Artist[], genreStrings: Array<string>){
        return _.filter(artists, a=> 
            genreStrings.length === 0 || this.hasMatchingGenres(a.genres, genreStrings));
    }
    
    //
    // checks two genre lists and specifies if they share a genre
    //
    private hasMatchingGenres(genreListA: string[], genreListB: string[]) : boolean{
        let similar = _.intersection(genreListA, genreListB);
        if(similar.length > 0)
        return similar.length > 0;
    }

    //
    // filterArtistsbyName
    //
    public filterArtistsByName(artistName: string){
        // set the cached value
        this.artistNameFilterCache = artistName;
        
        // apply the filters
        let artists = this._allArtists.getValue();
        artists = this.getFilteredAritstsByName(artists, artistName)
        artists = this.getFilteredArtistsByGenre(artists, this.genreFilterCache);

        // broadcast
        this._artistsFiltered.next(artists);
    }

    // 
    //  getFilteredAritstsByName: returns a filtered array of artists
    //
    private getFilteredAritstsByName(artists: Artist[], artistName: string){
        artistName = artistName || '';
        this.artistNameFilterCache = artistName;
        var re = new RegExp(artistName, 'gi');
        return _.filter(artists, a=> 
            artistName.length === 0 || re.test(a.name));
        
    }



}   