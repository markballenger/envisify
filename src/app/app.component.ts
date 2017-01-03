import { Component, OnInit} from '@angular/core';
import { ApiService, AuthConfigService } from './shared';
import '../style/app.scss';


@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  url = 'https://github.com/preboot/angular2-webpack';

  constructor(private api: ApiService, private authService: AuthConfigService) {
    // Do something with api
  }

  public isAuthenticated: boolean;

  ngOnInit(){

    console.log('process.env.ENV: ' + process.env.ENV);
    
    // first subscribe to the auth event
    this.authService.isAuthenticatedUpdated
      //.distinctUntilChanged()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = <boolean>isAuthenticated;
      });
    
    // then try grabbing the tokens in the uri if they are there
    this.authService.tryLoadTokens();
  }

  //
  // 
  //
  public logout(){
    this.authService.logout();
  }
  
  //
  //
  //
  public login(){
    // initialize some api call to login
    this.authService.login();
  }

}
