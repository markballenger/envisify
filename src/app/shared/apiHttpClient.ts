import { Inject, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Response, Http, Headers} from '@angular/http';
import { AuthConfigService } from './../shared/authConfig.service';
import { ConsoleService } from './../shared/console.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Log } from './../models';

@Injectable()
export class ApiHttpClient {

  private spotifyUri: string = 'https://api.spotify.com/v1/';

  private _activity: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public activity: Observable<string> = this._activity.asObservable();

  constructor(
    private http: Http,
    private authConfig: AuthConfigService, 
    private console: ConsoleService,
    private router: Router,
    @Inject('Window') protected window: Window) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.authConfig.getAccessToken()}`);
  }


  public getAbsolute(absoluteUrl): Observable<Response>{
    
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    
    return this.http.get(absoluteUrl, { headers: headers })
    .catch((error: Response | any) =>this.handleError(error, absoluteUrl));  
  }


  private handleError (error: Response | any, absoluteUrl: string) {

    // In a real world app, we might use a remote logging infrastructure
    if(error.status === 401){
      // send them to the server for login to acquire a proper access token
      this.authConfig.login();
      return;
    }
    
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this._activity.next(errMsg);
    this.console.error(errMsg, this);
    return Observable.throw(errMsg);
  }

  public get(relativeUrl): Observable<Response> {
    this._activity.next(relativeUrl);
    return this.getAbsolute(this.spotifyUri + relativeUrl);
  }

  //   post(url, data) {
  //     let headers = new Headers();
  //     this.createAuthorizationHeader(headers);
  //     return this.http.post(url, data, {
  //       headers: headers
  //     });
  //   }

}
