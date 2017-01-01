import { Component, OnInit} from '@angular/core';
import { ApiService } from './shared';
import '../style/app.scss';


@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  url = 'https://github.com/preboot/angular2-webpack';

  constructor(private api: ApiService) {
    // Do something with api
  }

  ngOnInit(){
    console.log('process.env.ENV: ' + process.env.ENV);
  }

}
