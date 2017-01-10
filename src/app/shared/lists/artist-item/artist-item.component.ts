import { Component, Input } from '@angular/core';
import { Artist } from './../../../models';

declare var _ : any;

@Component({
    selector: 'artist-item',
    template: `
    <div [class.isNew]="artist.isNew" >
        <div class="thumbnail placeholder">
            <!--<image [image]={{getMainImageUrl()}}></image>-->
            <img data-src="{{getMainImageUrl()}}"  alt="{{ artist.name }}">
        </div>
    </div>
    `,
    styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent {

    @Input()
    public artist: Artist;

    public getMainImageUrl() : string{
        var image = _.find(this.artist.images, i=> i.height > 250);
        return image ? image.url : '';
    }

}
