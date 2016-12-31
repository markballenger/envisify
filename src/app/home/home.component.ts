import { Component, OnInit } from '@angular/core';
//import { Logger } from 'angular2-logger/core';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(/*private logger: Logger*/) {
    // Do stuff
    //logger.level = logger.Level.LOG;
  }

  ngOnInit() {
    console.log('Hello Home');
    //this.logger.info('Hello home');
  }

}
