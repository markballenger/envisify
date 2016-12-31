import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { Artist } from './../models/artist';
import { LocalStorage, LocalStorageService } from 'ng2-webstorage';
import { AuthConfigService } from './authConfig.service';
import { ApiHttpClient } from './apiHttpClient';
//import { Logger } from 'angular2-logger/core';

interface IMessagesOperation extends Function {
  (artists: Artist[]): Artist[];
}

@Injectable()
export class ApiService {
  
  // a list of artists
  private artists: Observable<Artist[]>;

  // the spotify access token fetched from the route params handed from the server's redirect
  @LocalStorage() protected access_token: string = '';


  constructor(
    private http:ApiHttpClient, 
    private storage: LocalStorageService, 
    private authConfig: AuthConfigService,
    //private logger: Logger,
    @Inject('Window') window: Window){
      
      //this.logger.level = logger.Level.ERROR;
      
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
        .publishReplay()
        .refCount();
    }
    console.log(this.artists);
    return this.artists;
  }

  // 
  // expandArtists: continues fetching artists for as long as a next page exists
  //
  public expandArtists(res: Response): Observable<any>{
        let next = res.json().artists.next;
        if(!next){
          return Observable.empty();
        }
        return Observable.from(this.http.getAbsolute(next));
  }

  //
  // mapArtists: maps the server response containing artists json
  //
  public mapArtists(res: Response): Artist[]{
    let json = res.json();
    //this.logger.info(json);
    return json.artists.items;
  }

}
