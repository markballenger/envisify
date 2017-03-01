import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'btn-group',
    template: `
        <div class="btn-group">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{selectedText}}<span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li *ngFor="let option of options"><a (click)="onSelected(option)">{{option}}</a></li>
            </ul>
        </div>
    `
})
export class BtnGroupComponent implements OnInit {

    @Input()
    public btnClass: String = "btn-default";

    @Input()
    public options: Array<any>;

    @Output()
    public selected: EventEmitter<any> = new EventEmitter<any>();

    public selectedText: String = "";

    public constructor(){

    }

    ngOnInit(){
        if(this.options && this.options.length){
            this.selectedText = this.options[0];
        }
    }

    onSelected(option){
        this.selectedText = option;
        this.selected.emit(option);
    }
}