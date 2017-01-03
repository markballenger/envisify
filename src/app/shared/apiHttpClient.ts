import { Injectable} from '@angular/core';
import { Response, Http, Headers} from '@angular/http';
import { AuthConfigService } from './authConfig.service';
//import { Logger } from 'angular2-logger/core';
import { Observable} from 'rxjs';


@Injectable()
export class ApiHttpClient {

  private spotifyUri: string = 'https://api.spotify.com/v1/';

  constructor(
    private http: Http,
    private authConfig: AuthConfigService 
    /*private logger: Logger*/) {

      //logger.level = logger.Level.ERROR;

  }

  createAuthorizationHeader(headers: Headers) {
    console.log(this.authConfig.getAccessToken());
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.authConfig.getAccessToken()}`);
     
  }


  public getAbsolute(absoluteUrl): Observable<Response>{
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(absoluteUrl, {
      headers: headers
    })
    .catch((error: Response | any) =>this.handleError(error, absoluteUrl))
    .map((res: Response) =>{
        
        // log stuff
        //this.logger.info('GET: /' + absoluteUrl);
        //this.logger.info(res); 
        
        return res;
    });  
  }


  private handleError (error: Response | any, absoluteUrl: string) {
    // In a real world app, we might use a remote logging infrastructure
    if(error.status === 401){
      this.authConfig.logout();
      //this.getAbsolute(absoluteUrl);
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
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  public get(relativeUrl): Observable<Response> {
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
