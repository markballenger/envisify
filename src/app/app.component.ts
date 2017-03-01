import { Component, OnInit, AfterViewInit, ViewEncapsulation} from '@angular/core';
import { ApiStore, AuthConfigService, FilterService } from './shared';
import { Observable } from 'rxjs';
import '../style/app.scss';

declare var $ : any;

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private store: ApiStore, 
      private authService: AuthConfigService,
      private filters: FilterService) {
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

    // close the filters after no activity 
    this.filters.all
        .debounceTime(6000)
        .subscribe(x=>{
          this.closeSecondNav();
        });
    }
  
    closeSecondNav(){
        $('#navbar-secondary').removeClass('in');
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

        // close filters on mouse out 
        Observable.fromEvent($('#navbar-secondary'), 'mouseleave')  
            .debounceTime(3000)
            .withLatestFrom(Observable.fromEvent($('#navbar-secondary'), 'mouseenter'))
            .subscribe((x: any)=>{
                if(x[0].timeStamp > x[1].timeStamp){
                    this.closeSecondNav();
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
