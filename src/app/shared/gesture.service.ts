import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

declare var _ : any;

@Injectable()
export class GestureService {

    public swipeLeft : Observable<number>;
    public swipeRight: Observable<number>;
    public swipeDown : Observable<number>;
    public swipeUp: Observable<number>;
    public swipe: Observable<string>;

    private readonly swipeSampleCount : number = 4;
    private readonly swipeSampleInterval: number = 30;

    constructor(){

        let diffsX = GestureService.move(document).map(x=>x.x).sample(Observable.interval(this.swipeSampleInterval)).pairwise();
        let diffsY = GestureService.move(document).map(x=>x.y).sample(Observable.interval(this.swipeSampleInterval)).pairwise();

        var velocityX = diffsX.map(x=>x[0]-x[1]); 
        var velocityY = diffsY.map(x=>x[0]-x[1]); 

        this.swipeLeft = this.getSwipe(velocityX, x=> x > this.swipeSampleInterval * 1);
        this.swipeRight = this.getSwipe(velocityX, x=> x < this.swipeSampleInterval* -1);
        this.swipeUp = this.getSwipe(velocityY, x=> x > this.swipeSampleInterval);
        this.swipeDown = this.getSwipe(velocityY, x=> x < this.swipeSampleInterval* -1);

        this.swipe = Observable.merge(
            this.swipeLeft.map(x=>'left'), 
            this.swipeRight.map(x=>'right'), 
            this.swipeUp.map(x=>'up'), 
            this.swipeDown.map(x=>'down'));
    }


    getSwipe(velocity: Observable<any>, filter: any){
        return GestureService.down(document).flatMap(x=> velocity
                 .takeUntil(GestureService.up(document))
                 .takeLast(this.swipeSampleCount)
                 .reduce((s, v) => s + v)
                 .map(x => x/this.swipeSampleCount)
                 .filter(x => filter(x)));
    }

 

    public static move(elem){
        return Observable.fromEvent(elem, 'mousemove')
            .merge(Observable.fromEvent(elem, 'touchmove'))
            .map(x=>this.getMapped(x));
    }

    public static up(elem){
        return Observable.fromEvent(elem, 'mouseup')
            .merge(Observable.fromEvent(elem, 'touchend'))
            .map(x=>this.getMapped(x));
    }

    public static down(elem){
        return Observable.fromEvent(elem, 'mousedown')
            .merge(Observable.fromEvent(elem, 'touchstart'))
            .map(x=> this.getMapped(x));
    }

    static getMapped(e){
        if(e.targetTouches && e.targetTouches.length > 0){
            let rect = e.target.getBoundingClientRect();
            e.x = e.targetTouches[0].clientX;
            e.y = e.targetTouches[0].clientY;
            e.offsetX = e.targetTouches[0].pageX - rect.left;
            e.offsetY = e.targetTouches[0].pageY - rect.top;
        }

        return e;
    }


}