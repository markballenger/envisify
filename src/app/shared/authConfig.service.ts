import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorage, SessionStorage, LocalStorageService } from 'ng2-webstorage';
//import { Logger } from 'angular2-logger/core';

@Injectable()
export class AuthConfigService {
  
  private baseUri: string = process.env.NODE_ENV === 'dev' ? 'http://localhost:8080/' : 'https://envisify.heroku.com';

  // the spotify access token fetched from the route params handed from the server's redirect
  @LocalStorage() 
  public access_token: string;

  constructor(public http:Http, 
    protected storage: LocalStorageService, 
    @Inject('Window') protected window: Window 
    /*private logger: Logger*/){
      //logger.level = logger.Level.LOG;
  } 


  public getAccessToken(){
      // if not yet initialized
      if(!this.access_token){
          debugger;
          // fetch from storage
          this.access_token = this.storage.retrieve('access_token');
          if(!this.access_token){
            // and if not in storage, try checking the uri fragment
            this.access_token = this.extractTokenFromUri();
            if(!this.access_token){
                // and if still not found, send em' to the server for auth
                window.location.href = `${this.baseUri}login`;
            }
          } 
      }
      return this.access_token;
  }

  private extractTokenFromUri(): string{
      
      let regex =/access_token=([^&]+)/i;
      let match = regex.exec(window.location.href); 
      let token = match ? match[1] : null; 
      
      // if we found a token, we have it now so strip it out of the fragment 
      if(token){
          window.location.href = window.location.href.replace(`access_token=${token}`, '');
      }

      this.storage.store('access_token', token);
      return token;
  }
}
