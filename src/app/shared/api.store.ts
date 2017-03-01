import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, Scheduler } from 'rxjs';
import { Artist, Genre, Track, Recommendations } from './../models';
import { ApiService, UtilsService} from './../shared';
import { FilterService } from './../shared/filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RecommendOptionsService } from './../shared/recommend.options.service';

declare var _ : any;

@Injectable()
export class ApiStore {

    public busy: boolean = false;

    private _allArtists: BehaviorSubject<Artist[]> = new BehaviorSubject([]);
    public allArtists: Observable<Artist[]> = this._allArtists.asObservable();

    private _artistsFiltered:  BehaviorSubject<Artist[]> = new BehaviorSubject([]);
    public artistsFiltered: Observable<Artist[]> = this._artistsFiltered.asObservable();
    
    private _genres: BehaviorSubject<Genre[]> = new BehaviorSubject([]);
    public genres: Observable<Genre[]> = this._genres.asObservable();

    private _genresFiltered: BehaviorSubject<Genre[]> = new BehaviorSubject([]);
    private genresFiltered: Observable<Genre[]> = this._genresFiltered.asObservable();

    private _flattenedGenres: BehaviorSubject<Genre[]> = new BehaviorSubject([]);
    public flattenedGenres: Observable<Genre[]> = this._flattenedGenres.asObservable();

    private _tracks: BehaviorSubject<Track[]> = new BehaviorSubject([]);
    public tracks: Observable<Track[]> = this._tracks.asObservable();

    private _recommendations: BehaviorSubject<Recommendations> = new BehaviorSubject(new Recommendations());
    public recommendations: Observable<Recommendations> = this._recommendations.asObservable();
    public recommendedArtists: Observable<Artist>;

    private _playlistQueue: BehaviorSubject<Track[]> = new BehaviorSubject<Track[]>([]);
    public playlistQueue: Observable<Track[]> = this._playlistQueue.asObservable();

    constructor(
        protected api : ApiService,
        protected utils : UtilsService,
        protected router : Router,
        protected filter: FilterService,
        protected recommendOptions: RecommendOptionsService,
        protected route: ActivatedRoute){
            this.initialize();
    }

    //
    // init the store
    //
    private initialize(){

        this.subscribeAllArtists();
        //this.subscribeTracks();
        //this.subscribeForUnfollowedRelatedArtists();
        this.subscribeRecommendations();
        this.subscribeFilters();
    }

    //
    // subscribeAllArtists:
    //
    private subscribeAllArtists(){
        this.api.getAllArtists()
            .reduce((a,v)=>a.concat(v))
            .subscribe((a: Artist[])=>{
                let artists = this._artistsFiltered.getValue().concat(a);
                this._allArtists.next(artists);
                this._artistsFiltered.next(artists);
                this.broadcastGenres(a);
            });
    }

    //
    // populateGenres:
    //
    private broadcastGenres(artists: Artist[]){

        let genreList = this._genres.getValue();

         _.each(artists, a=>{
            _.each(a.genres, genre=>{
               let item = _.find(genreList, g=>g.name === genre);
               if(!item){
                   item = new Genre(genre, genre);
                    genreList.push(item);
               }
               item.count++;
               if(a.following===true){
                   item.followingCount++;
               }
            });
        });

        // sort by most popular in user's collection
        genreList = _.sortBy(genreList, g=> -1 * g.count);

        // broadcast on our observable
        this._genres.next(genreList);
    }

    //
    // subscribeTracks: 
    //
    private subscribeTracks(){
        this.api.getTracks()
            .reduce((a,v)=>a.concat(v))
            .subscribe((t: Track[])=>{
                this._tracks.next(t);
            })
    }

    // 
    // subscribeRecommendations: 
    //
    private subscribeRecommendations(){
        Observable.combineLatest(
                this.filter.artists, this.filter.genres, this.recommendOptions.change)
            .filter(x=> x[0].length > 0 || x[1].length > 0)
            .flatMap(x=> this.api.getRecommendations(x[0], x[1], x[2]))
            .map(x=> {
                // zip a following web request to determine if all artists
                // of the recommendations are being followed
                let artists = _.flatMap(x.tracks, t=>t.artists);
                let ids = _.uniq(_.map(artists, a=>a.id));
                return Observable.zip(Observable.from([x]), this.api.isFollowingArtists(ids));
            })
            .flatMap(x=> x)
            .map(x=>{
                // now map the follow result to the recommendations
                let recommendations = x[0];
                let following = x[1]
                _.each(recommendations.tracks, t=>{
                    _.each(t.artists, a=>{
                        a.following = _.find(following, f=>f.id === a.id).following;
                    });
                });
                return recommendations;
            })
            .subscribe(x=>{
                this._recommendations.next(x);        
            });
        
        // map to a view of artists
        this.recommendedArtists = this.recommendations
            .map(x=>{
                // todo: map all the artists from the tracks to an artist array
                return _.flatMap(x, c=>c.artists);
            });
    }

    //
    // subscribeFilters: apply filters to our exposed streams
    //
    private subscribeFilters(){
        this.filter.all.debounceTime(500)
            .subscribe(x=>{

            // apply filters to the stream
            let artists = this._allArtists.getValue();
            artists = this.filter.filterByGenres(artists, x);
            artists = this.filter.filterByName(artists, x);
            artists = this.filter.sort(artists, x);

            let genres = this._genres.getValue();
            genres = this.filter.filterByName(genres, x);
            
            let recommendations = this._recommendations.getValue();
            recommendations.tracks = this.filter.filterByName(recommendations.tracks, x);
            //recommendations.tracks = this.filter.filterByGenres(recommendations.tracks, x);
            recommendations.tracks = this.filter.sort(recommendations.tracks, x);

            // and broadcast
            this._artistsFiltered.next(artists);
            this._genresFiltered.next(genres);
            this._recommendations.next(recommendations);
        });
    }

    //
    // addPlaylistQueue
    //
    public addPlaylistQueue(tracks: Track[]){
        let q = this._playlistQueue.getValue();
        this._playlistQueue.next(_.union(tracks, q));
    }

    //
    // removePlaylistQueue
    //
    public removePlaylistQueue(tracks: Track[]){
        let q = this._playlistQueue.getValue();
        q = _.pullAll(q, tracks);
        this._playlistQueue.next(q);
    }

    //
    // subscribeForUnfollowedRelatedArtists:
    //
    private subscribeForUnfollowedRelatedArtists(){

        this.api.getAllArtists()
            .reduce((a,v)=>a.concat(v))
            .take(1)
            .subscribe(x=>{
                let intervalStream = Observable.interval(300)
                    .subscribe(i=>{
                        if(!x[i]){
                            intervalStream.unsubscribe();
                        } else {
                            x[i].relatedArtists.subscribe(r=>{
                                this.broadcastNewRelatedArtists(r);
                            });
                        }
                    })
            });
    }

    //
    // broadcastNewRelatedArtists:
    //
    private broadcastNewRelatedArtists(relatedArtists: Artist[]){
        let artists = this._allArtists.getValue();
        _.remove(relatedArtists, x=> _.some(artists, s=>s.id===x.id || s.name === x.name));
        _.each(relatedArtists, n=>n.following = false);
        if(relatedArtists.length > 0){
            artists = artists.concat(relatedArtists);
            this._allArtists.next(artists);
            //this.filter.text.next('');
        }
    }

}