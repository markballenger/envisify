import { Component, Input, OnInit } from '@angular/core';
import { Artist } from './../../../models';

declare var _ : any;

@Component({
    selector: 'artist-item',
    template: `
    <div [class.not-following]="!artist.following" [class.following]="artist.following" class="artist-item" >

        <image [images]="artist.images" [min]="130"></image>                

        <div class="artist-details">
            <h1 class="visible-lg visible-md">{{artist.name}}</h1>
            <h3 class="visible-sm visible-xs">{{artist.name}}</h3>
            <span class="badge" >{{artist.followers?.total}} followers</span>
            <span class="badge popularity">{{artist.popularity}} popularity</span>
            <i *ngIf="artist.following" class="fa fa-check-circle fa-2x"></i>
            <i *ngIf="!artist.following" class="fa fa-circle-o"></i>
            
            <p><small><i>{{genres.join(', ')}}</i></small></p>
        </div>

    </div>
    `,
    styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {

    @Input()
    public artist: Artist;
    public loading: boolean = true;
    public mainImage = null;
    public genres = null;

    public constructor(){
        
    }

    ngOnInit(){
        this.mainImage = this.getMainImage();
        this.genres = _.take(this.artist.genres, 5);
    }

    public getMainImage(){
        var images = _.sortBy(this.artist.images, 'height');
        var image = _.find(images, i=> i.height >= 140 && i.width >= 140);
        return image;
    }

    getWidth(i){
        if( !i) return 0;
        if(i.width > i.heigth)
            return 140;
        else 
            return Math.round((140 / i.height) * i.width);
    }

    getLeft(){
        return (this.getMainImageWidth() - 130) * -.5 + 'px';
    }

    getTop(){
        return (this.getMainImageHeight() -130) * -.5 + 'px';
    }

    getMainImageWidth(){
        return this.getWidth(this.mainImage);
    }

    getMainImageHeight(){
        return this.getHeight(this.mainImage);
    }

    getHeight(i: any){
        if( !i) return 0;
        if(i.height > i.width)
            return 140;
        else 
            return Math.round((140 / i.width) * i.height);
    }

    public onLoad(){
        this.loading = false;
    }

}
