import { Input, Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs'; 
import { GestureService } from './../../shared/gesture.service';

declare var $: any;
declare var _: any;

@Component({
    selector: 'minmax',
    templateUrl: './minmax.component.html',
    styleUrls: ['./minmax.component.scss']
})
export class MinMaxComponent {

    // basic properties
    @Input() public min: number = 0;
    @Input() public max: number = 1;
    @Input() public round: boolean = false;

    // expose a subject for other components to subscribe to
    @Input() public minStream: Subject<number> = new Subject();
    @Input() public maxStream: Subject<number> = new Subject();
    @Input() public label: string ='';

    private up: Observable<any> = GestureService.up(this.slider.nativeElement);
    private move: Observable<any> = GestureService.move(this.slider.nativeElement);
    private down: Observable<any> = GestureService.down(this.slider.nativeElement);

    private leftMin: string = '0%';
    private leftMax: string = '100%';

    constructor(
        private gesture: GestureService,
        private knobMin : ElementRef, 
        private knobMax : ElementRef, 
        private slider: ElementRef){

    }

    ngOnInit(){

        // capture a drag stream
        let drag = this.move
                    .filter(x=> x.target.className === 'slider-ribbon')
                    .map(pos=> pos.offsetX / pos.target.clientWidth) // map to the percentage from left
                    .takeUntil(GestureService.up(window)); 

        // set the min stream
        this.down
            .filter(x=>x.target.className === 'min-knob slider-knob')
            .flatMap(x=> drag)
            .withLatestFrom(this.maxStream)
            .filter(x=> x[0] <= x[1] || x[1] === null) // don't let max<min
            .map(x=> x[0])
            .subscribe(x=> this.setValue(x, this.minStream));

        // set the max stream
        this.down
            .filter(x=>x.target.className === 'max-knob slider-knob')
            .flatMap(x=> drag)
            .withLatestFrom(this.minStream)
            .filter(x=> x[0] >= x[1] || x[1] === null) // don't let max<min
            .map(x=> x[0])
            .subscribe(x=>this.setValue(x, this.maxStream));

        this.minStream
            .subscribe(x=>this.setMinLeft(x));
            
        this.maxStream
            .subscribe(x=>this.setMaxLeft(x));
    }

    ngAfterViewInit(){

    }

    //
    // updates the slider position from the stream's broadcasted value
    //
    setMinLeft(minVal){
        this.leftMin = Math.round((minVal || this.min) / this.max * 100) + '%'
    }

    //
    // updates the slider position from the stream's broadcasted value
    //
    setMaxLeft(maxVal){    
        this.leftMax = Math.round((maxVal || this.max) / this.max * 100) + '%'
    }

    //
    //
    //
    private setValue(percentage: number, stream: Subject<number>){
        let val = this.calculateValue(percentage);        
        stream.next(val);
    } 

    //
    // calculateValue
    //
    private calculateValue(percentage: number): number{
        let diff = this.max - this.min;
        return (this.round) ? Math.round(diff * percentage + this.min) : 
            Number((diff * percentage + this.min).toFixed(2));
    }

    //
    // computes a percentage value based on mouse position of a mouse drag
    //
    private getSliderPercentage(pos: any, elm: ElementRef){
        return ;
    }


}