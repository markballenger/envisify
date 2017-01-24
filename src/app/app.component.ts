import { Component, OnInit, AfterViewInit} from '@angular/core';
import { ApiStore, AuthConfigService } from './shared';
import '../style/app.scss';

declare var $ : any;

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  url = 'https://github.com/preboot/angular2-webpack';

  constructor(private store: ApiStore, private authService: AuthConfigService) {
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

   /**
   * perform stuff needed after the view has initialized
   */
    ngAfterViewInit(){

        // close the small screen navbar flyout on click
        $('#navbar ul li a').on('click', function(){
            // only do this if the flyout is actually open
            if($('header button.navbar-toggle').is(':visible') && $('#navbar').is(':visible')){
                $('header button.navbar-toggle').click(); 
            }   
        });

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
