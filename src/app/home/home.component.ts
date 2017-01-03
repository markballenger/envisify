import { Component, OnInit } from '@angular/core';
import { ApiService } from './../shared/api.service';
//import { Logger } from 'angular2-logger/core';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(protected api:ApiService/*private logger: Logger*/) {
    // Do stuff
    //logger.level = logger.Level.LOG;
  }

  ngOnInit() {
  }

}
