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
    
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.authConfig.getAccessToken()}`);
     
  }


  public getAbsolute(absoluteUrl): Observable<Response>{
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(absoluteUrl, {
      headers: headers
    }).map((res: Response) =>{
        
        // log stuff
        //this.logger.info('GET: /' + absoluteUrl);
        //this.logger.info(res); 
        
        return res;
    });  
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
