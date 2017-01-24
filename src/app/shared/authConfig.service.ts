import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorage, SessionStorage, LocalStorageService } from 'ng2-webstorage';
import { UtilsService } from './utils.service';
//import { Logger } from 'angular2-logger/core';

@Injectable()
export class AuthConfigService {
  
  // for dev, we have to determine the baseUri because the webpack browser sync proxy
  // uses a different port than the api web server 
  private baseUri: string = (process.env.ENV === 'dev') ? 'http://localhost:8080/' : 'https://envisify.herokuapp.com/';

  // the spotify access token fetched from the route params handed from the server's redirect
  public access_token: string = null;
  public refresh_token: string = null;

  public isAuthenticatedUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  private refreshStream : Observable<any> = Observable.interval(1000 * 60).timeInterval();

  // helper func to set tokens and emit event
  private setTokens(access_tok: string, refresh_tok: string){
    if(access_tok === 'null'){
      access_tok = null;
    }

    this.access_token = access_tok;
    this.refresh_token = refresh_tok;
    this.isAuthenticatedUpdated.emit(this.isAuthenticated());
  }

  // private helper method to determine if the user is authenticated
  public isAuthenticated(): boolean{
    return (this.access_token != null && this.access_token.length > 0);
  }

  constructor(public http:Http, 
    protected storage: LocalStorageService,
    protected utils: UtilsService, 
    @Inject('Window') protected window: Window 
    /*private logger: Logger*/){
      //logger.level = logger.Level.LOG;
      
      this.refreshStream
        .filter(()=> this.isAuthenticated())
        .subscribe(()=> this.requestRefreshToken());

  } 

  //
  // the server call to request a new access token
  //
  private requestRefreshToken(){
    this.http.get(`${this.baseUri}refresh_token?refresh_token=${this.refresh_token}`)
      .map((res: Response)=> res.json().access_token)
      //.publishReplay()
      //.refCount()
      .subscribe(token=>{
        this.setTokens(token, this.refresh_token);
        this.window.localStorage.setItem('access_token', this.access_token);
      });
  }


  // 
  // sends the user to our server for authentication redirect to spotify
  //
  public login(){
    this.window.location.href = `${this.baseUri}login`;
  }

  //
  // invalidates local cached tokens and sends to the server for logout
  //
  public logout(){
    this.setTokens(null, null);
    this.window.localStorage.removeItem('access_token');
    this.window.localStorage.removeItem('refresh_token');
    this.window.location.href = `${this.baseUri}logout`;
  }

  //
  // retrieves the access token out of cache or storage, 
  //    sends to login if it can't get it
  //
  public getAccessToken(){

    // first, just return what's in cache if it's there
    if(this.access_token !=null)
      return this.access_token;

    // next try to grab from the uri fragment
    this.tryLoadTokens();

    if(!this.isAuthenticated())
    {
      // then send em' to the server for auth
      this.login();
    }
    
    // return the token we found
    return this.access_token;
  }

  // helper to set local storage values
  private setLocalStorage(){
      this.window.localStorage.setItem('access_token', this.access_token);
      this.window.localStorage.setItem('refresh_token', this.refresh_token);
  }

  //
  // tries to extract the tokens from the fragment
  //
  public tryLoadTokens() : void {

    // set the local cache vars
    this.setTokens(
      this.utils.extractFromRoute('access_token'), 
      this.utils.extractFromRoute('refresh_token'));
      
      // only overwrite local storage if we're authenticated
      if(this.isAuthenticated()){
        this.setLocalStorage();  
      }

      if(!this.isAuthenticated()){
          // try to fetch from storage
          this.setTokens(
            this.window.localStorage.getItem('access_token'), 
            this.window.localStorage.getItem('refresh_token'));
      }

      // only overwrite local storage if we're authenticated
      if(this.isAuthenticated()){
        this.setLocalStorage();
      }
  }
}
