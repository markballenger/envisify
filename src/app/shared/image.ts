import { Component, Input } from '@angular/core';

@Component({
    selector: 'image',
    template: `
        <img [src]="defaultImage" [lazyLoad]="image" [offset]="offset">
    `
})
export class ImageComponent {
    defaultImage = 'https://www.placecage.com/1000/1000';
    
    @Input()
    public image = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';
    offset = 100;
}
