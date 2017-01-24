import { Component, Input } from '@angular/core';
import { Artist } from './../../../models';

declare var _ : any;

@Component({
    selector: 'artist-item',
    template: `
    <div [class.isNew]="artist.isNew" class="artist-item" >
        <span class="badge ">{{artist.name}}</span>
        <div class="thumbnail">
            <div class="loading" *ngIf="loading"></div>
            <img  (load)="onLoad()" data-src="{{getMainImageUrl()}}"  alt="{{ artist.name }}">
        </div>
    </div>
    `,
    styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent {

    @Input()
    public artist: Artist;

    public loading: boolean = true;

    public getMainImageUrl() : string{
        var image = _.find(this.artist.images, i=> i.height > 250);
        return image ? image.url : '';
    }

    public onLoad(){
        this.loading = false;
    }

}
