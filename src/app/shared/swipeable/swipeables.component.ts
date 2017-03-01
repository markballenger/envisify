import { AfterViewInit, OnDestroy, ViewContainerRef, ViewRef, AfterContentInit, ContentChildren, OnInit, Component, ElementRef, Input, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { GestureService } from './../../shared';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

declare var $: any;
declare var _: any;

export class SwipeRoute {
    constructor(public dir: string, public route: string){}
}

@Component({
    selector: 'swipeables',
    template: `
        <router-outlet name='recommendations'></router-outlet>
    `,
    styleUrls: ['./swipeables.component.scss']
})
export class SwipeablesComponent implements OnDestroy, AfterViewInit, AfterContentInit {

    @Input()
    outlet: string = 'aux';

    @Input()
    swipeRoutes: SwipeRoute[]; 

    horizStack: SwipeRoute[] = [];
    vertStack: SwipeRoute[] = [];

    private swipeSub: any;

    constructor(private gesture: GestureService, private router: Router){
        
        this.swipeSub = this.gesture.swipe.subscribe(x=>{
            let to = this.getOppositeDirection(x);

            // traverse horizontal nav and vertical nav as separate stacks
            if(this.isHoriz(x)){
                // do horizontal
                this.doStack(this.horizStack, to);
            }
            else{
                // do vertical
                this.doStack(this.vertStack, to);
            }
        });

    }

    private getOppositeDirection(direction){
        switch(direction){
            case 'left': return 'right';
            case 'right': return 'left';
            case 'up': return 'down';
            case 'down': return 'up';
        }
    }

    isHoriz(x){
        return x==='left' || x==='right';
    }    

    ngAfterViewInit(){

        
    }

    doStack(stack: SwipeRoute[], to: string){
        if(stack.length > 0 && _.last(stack).dir != to){
            // go back
            _.pull(stack, _.last(stack));
            let back = _.last(stack);
            this.navigate(back);
        } else{
            // go forward
            let notswiped = _.difference(this.swipeRoutes, stack);
            let forward = _.find(notswiped, x=>x.dir === to);
            if(forward){
                stack.push(forward);
                this.navigate(forward);
            }
        }
    }

    navigate(swipeRoute: SwipeRoute){
        let outlets = {};
        outlets[this.outlet] = swipeRoute ? swipeRoute.route : null;
        let route = [this.outlet, { outlets: outlets }];
        this.router.navigate(route);
    }

    ngAfterContentInit(){

        
    }

    ngOnDestroy(){
        this.swipeSub.unsubscribe();
    }

}

