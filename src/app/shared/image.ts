import { Component, Input } from '@angular/core';
import { Image } from './../models';

declare var _: any;

@Component({
    selector: 'image',
    template: `
        <div class="thumbnail" [style.width]="min + 'px'" [style.height]="min + 'px'">
            <div class="loading"  
                [style.width]="getWidth() + 'px'" 
                [style.height]="getHeight() + 'px'" 
                *ngIf="loading && min > 40">
                <i class="fa fa-circle-o-notch fa-3x fa-spin"></i>
                <i class="fa fa-spotify fa-2x"></i>
            </div>
            <img 
                [style.width]="getWidth() + 'px'" 
                [style.height]="getHeight() + 'px'" 
                [style.left]="getLeft()" 
                [style.top]="getTop()" 
                width="{{getWidth()}}"
                height="{{getHeight()}}" 
                (load)="onLoad()" 
                data-src="{{getImage()?.url}}">
        </div>
    `,
    styleUrls: ['./image.scss']
})
export class ImageComponent {
    
    @Input()
    public images : Image[];
    public loading: boolean = true;

    @Input()
    public min: number = 140;

    public getImage(){
        var images = _.sortBy(this.images, 'height');
        var image = _.find(images, i=> i.height >= this.min && i.width >= this.min);
        return image;
    }

    getWidth(){
        let i = this.getImage();
        let width = 0;
        if( !i) return width;
        if(i.width < i.height)
            width = this.min;
        else 
            width = Math.round((this.min / i.height) * i.width);
        return width;
    }

    getHeight(){
        let i = this.getImage();
        let height = 0;
        if( !i) return height;
        if(i.height < i.width)
            height = this.min;
        else 
            height = Math.round((this.min / i.width) * i.height);
        return height;
    }

    getLeft(){
        let left = Math.round((this.getWidth() - this.min) * -.5);
        return left + 'px';
    }

    getTop(){
        let right = Math.round((this.getHeight() - this.min) * -.5);
        return right + 'px';
    }

    public onLoad(){
        this.loading = false;
    }
}
