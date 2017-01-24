import { Component, ElementRef, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var $;

@Component({
    selector: 'slider',
    template: `
        
        <div class="row">

            <div class="col-xs-4">
                    <input type="text" [(ngModel)]="value"  class="form-control" placeholder="value" aria-describedby="basic-addon1">
            </div>

            <div class="col-xs-8">
                <div #slider class="slider-container">
                    <div class="slider-ribbon">
                        <div #knob [style.left]="left + '%'" class="slider-knob"></div>
                    </div>
                </div>
            </div>

        </div>
    `,
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit{
    
    // the primary reason of our existence
    @Input() @Output() public value: number = 50;

    // basic properties
    @Input() public min: number = 0;
    @Input() public max: number = 100;
    @Input() public round: boolean = false;

    // expose a subject for other components to subscribe to
    @Input() public valueStream: Subject<number> = new Subject();
    @Output() public valueChange: EventEmitter<any> = new EventEmitter<any>();

    public left: number = 0;

    private mouseup: Observable<any>;
    private mousemove: Observable<any>;
    private mousedown: Observable<any>;

    constructor(public knob : ElementRef, public slider: ElementRef){
        this.mouseup = Observable.fromEvent(slider.nativeElement, 'mouseup');
        this.mousemove = Observable.fromEvent(slider.nativeElement, 'mousemove');
        this.mousedown = Observable.fromEvent(slider.nativeElement, 'mousedown');
    }

    ngAfterViewInit(){
        
    }

    ngOnInit(){

        // init the left position of our slider based on value
        this.left = (this.value - this.min) / (this.max - this.min) * 100;

        // get a drag stream
        let drag = this.mousemove
                    //.throttle(x=>Observable.timer(40))
                    .filter(x=> x.target.className === 'slider-ribbon')
                    .map(pos=> pos.offsetX)
                    .takeUntil(this.mouseup); 

        // when the mouse is down flatten the drag stream and set our value
        this.mousedown
            .flatMap(x=> drag)
            .map(x=> this.getPercentage(x))
            .do(x=> this.setValue(x))
            .subscribe();
    }

    // 
    // called to set the value of the slider component
    // 
    private setValue(percentage: number){
        
        let diff = this.max - this.min;
        
        // update our value
        if(this.round)
            this.value = Math.round(diff * percentage + this.min);
        else 
            this.value = (diff * percentage + this.min);
        
        // update the position of the slider
        if(this.round)
            this.left = Math.round(percentage * 100);
        else 
            this.left = percentage * 100;

        this.valueStream.next(this.value);
        this.valueChange.emit(this.value);
    }   

    //
    // computes a percentage value based on mouse position of a mouse drag
    //
    private getPercentage(leftPos: number){
        let elmWidth = $(this.knob.nativeElement).width();
        if(!elmWidth || elmWidth <= 0)
            return 0;
        return leftPos / elmWidth;
    }

}
