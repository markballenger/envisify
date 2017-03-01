import { OnInit, Component, AfterViewInit } from '@angular/core';
import { ApiService, ApiHttpClient, ApiStore, ConsoleService } from './../shared';
import { Observable } from 'rxjs';
import { Log } from './../models';

declare var $: any;

@Component({
    selector: 'console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, AfterViewInit {

    visible: boolean = false;

    constructor(protected console: ConsoleService){

    }

    ngOnInit(){
    
    }

    ngAfterViewInit(){

        let down = Observable.fromEvent(document.body, 'keydown').filter((x:any)=>!x.repeat);
        let up = Observable.fromEvent(document.body, 'keyup').filter((x:any)=>!x.repeat);
        
        down.filter((x: any) => x.key === 'Control')
            .takeUntil(up.filter((x: any)=>x.key === 'Control'))
            .merge(down.filter((x:any)=> x.key === 'q'))
            .filter((x: any) => x.key === 'q')
            .subscribe(x=>{
                this.visible = !this.visible;
            });
    }

}
