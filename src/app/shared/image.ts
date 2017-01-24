import { Component, Input } from '@angular/core';

@Component({
    selector: 'image',
    template: `
        <div [src]="defaultImage" [lazyLoad]="image" [offset]="offset"></div>
    `
})
export class ImageComponent {
    defaultImage = 'https://www.placecage.com/1000/1000';
    
    @Input()
    public image = 'https://www.placecage.com/1000/1000';
    offset = 100;
}
