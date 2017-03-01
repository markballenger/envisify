import { Directive, ElementRef, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({ 
    selector: '[ngModel][rx-subject]',
    providers: [NgModel],
    host: {
        '(ngModelChange)' : 'onChange($event)'
    }
})
export class RxSubjectDirective {
    constructor(private model:NgModel) {
        
    }

    onChange(event){
        debugger;
        this.model.value.next(event);
    }
}