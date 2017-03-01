import { Inject, Injectable } from '@angular/core';

import { Observable, Scheduler, BehaviorSubject } from 'rxjs';
import { Response } from '@angular/http';
import { Log, Artist, Genre, Track, Recommendations, RecommendOptions } from './../models';
import { LocalStorage, LocalStorageService } from 'ng2-webstorage';
import { AuthConfigService } from './authConfig.service';
import { ApiHttpClient } from './apiHttpClient';
import { ConsoleService } from './../shared/console.service';

interface IMessagesOperation extends Function {
  (artists: Artist[]): Artist[];
}

declare var _ : any;
declare var query: any;

@Injectable()
export class ApiService {
  
  // our http response streams
  private artists: Observable<Artist[]>;
  private relatedArtists: Observable<Artist[]>;
  private tracks: Observable<Track[]>;
  private recommendations: Observable<Recommendations>;

  private _activity: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public activity: Observable<string> = this._activity.asObservable();

  constructor(
    private http:ApiHttpClient, 
    private console: ConsoleService,
    private storage: LocalStorageService, 
    private authConfig: AuthConfigService,
    @Inject('Window') private window: Window){
  } 

  private json(res: Response){
    this.console.info(res.text(), this);
    let json = res.json();
    return json;
  }

  //
  // getArtists: 
  //
  public getArtists(): Observable<Artist[]>{
    if(!this.artists){
      this.artists = this.http.get('me/following?type=artist')
            .map((res: Response)=> this.mapArtists(res)) 
            .publishReplay(1) 
            .refCount();
    }
    return this.artists;
  }


  // 
  // getAllArtists: fetches the complete list of artists being followed 
  //
  public getAllArtists(): Observable<Artist[]>{
    if(!this.artists){
      this.artists = this.http.get('me/following?type=artist')
        .expand((res: Response)=> this.expandArtists(res))
        .map((res: Response)=> this.mapArtists(res))
        .map((artist: Artist[])=> _.each(artist, a=>a.following = true))
        .publishReplay()
        .refCount();
    }
    return this.artists;
  }

  // 
  // expandArtists: continues fetching artists for as long as a next page exists
  //
  private expandArtists(res: Response): Observable<any>{
        let next = this.json(res).artists.next;
        if(!next){
          return Observable.empty();
        }
        //return Observable.timer(2000).flatMap(x=>this.http.getAbsolute(next));
        return this.http.getAbsolute(next);
  }

  //
  // mapArtists: maps the server response containing artists json
  //
  public mapArtists(res: Response): Artist[]{
    let json = this.json(res);
    _.each(json.artists.items, a=>a.relatedArtists = this.getRelatedArtists(a.id));
    return json.artists.items;
  }


  //
  // getRelatedArtists
  //
  public getRelatedArtists(id: string): Observable<Artist[]>{
    
    let storageKey = 'related_' + id;

    // // // if available in cache, use that
    // // let fromCache = this.window.localStorage.getItem(storageKey);
    // // if(fromCache){
    // //   let parsed = <Artist[]>JSON.parse(fromCache);
    // //   if(parsed && parsed.length > 0)
    // //     return Observable.from([parsed])
    // //       .publishReplay(1)
    // //       .refCount();
    // // }

    // otherwise go to spotify
    return this.http.get(`artists/${id}/related-artists`)
      // // .do((res :Response) =>{
      // //   // cache it in local storage to prevent spamming spotify
      // //     this.window.localStorage.setItem(storageKey, res.text());
      // // })
      .map((res: Response)=> this.mapRelatedArtists(res, id))
      .publishReplay(1)
      .refCount();
  }

  //
  // mapRelatedArtists
  //
  mapRelatedArtists(res: Response, id: string) : any[]{
    let json = this.json(res);
    _.each(json.artists, a=>{
        a.relatedTo = id;
        a.relatedArtists=this.getRelatedArtists(a.id);
      });
    return json.artists;
  }

  //
  // getTracks: gets a users followed tracks
  //
  public getTracks(): Observable<Track[]>{
    if(!this.tracks){
      this.tracks = this.http.get('me/tracks')
      .expand((res: Response)=> this.expandTracks(res))
      .map((res:Response)=>this.mapTracks(res))
      .publishReplay()
      .refCount();
    }
    return this.tracks;
  }

  private mapTracks(res: Response){
    let json = this.json(res);
    let tracks = _.map(json.items, x=> {
      x.track.added_at = x.added_at;
      return x.track;
    });
    return tracks;
  }

  //
  // recursively get the next tracks
  //
  private expandTracks(res: Response){
    let next = res.json().next;
    if(!next) return Observable.empty();
    return Observable.from(this.http.getAbsolute(next));   
  }

  public getRecommendations(artists: Artist[], genres: Genre[], options: RecommendOptions) : Observable<Recommendations>{
        
        // limit artists and genres to 5
        artists = _.take(artists, 5);
        genres = _.take(genres, 5);

        let q = {};

        if(artists.length > 0){
          q["seed_artists"] = _.map(artists, 'id').join(',');
        }
        if(genres.length > 0){
          q["seed_genres"] =  _.map(genres, 'name').join(',');
        }
        
        if(options){
          let keys = _.keys(options);
          _.each(keys, k=>{
            if(options[k]){
              q[k] = options[k];
            }
          }); 
        }
        debugger;
        let uri = 'recommendations?' + query.stringify(q);
        console.log(uri);

        return this.http.get(uri).map((res:Response)=> this.mapRecommendations(res));
  }

  private mapRecommendations(res: Response): Recommendations {
    return this.json(res);
  }

  //
  // isFollowingArtists: requests if a user is following supplied artists
  //
  public isFollowingArtists(ids: string[]){
    let joined = ids.join(',');
    return this.http.get(`me/following/contains?type=artist&ids=${joined}`)
      .map((res:Response)=> this.mapFollowingContains(res, ids));
  }

  //
  // isFollowingTracks: requests if a user is following the supplied tracks
  //
  public isFollowingTracks(ids: string[]){
    let joined = ids.join(',');
    return this.http.get(`me/following/contains?type=track&ids=${joined}`)
      .map((res:Response)=> this.mapFollowingContains(res, ids));
  }

  private mapFollowingContains(res: Response, ids){
    let json = res.json();
        let zipped = _.zip(ids, json);
        return _.map(zipped, x=> { 
          return {id: x[0], following: x[1]};
        });
  }


}
