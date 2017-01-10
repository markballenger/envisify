import { Component, Input } from '@angular/core';
import { Genre } from './../../../models';

@Component({
    selector: 'genre-item',
    template: `
        <div class="avatar">{{genre?.count}}</div>
        <div class="item-content">
            <div class="name">{{genre?.name}}</div>
            <div>
                <span class="badge">{{genre?.name}}/{{genre?.name}}</span>
                <span>{{genre?.name}} | {{genre?.name}}</span>
            </div>
            <div>{{genre?.name}}</div>
        </div>
    `,
    styleUrls: ['./genre-item.component.scss']
})
export class GenreItemComponent {
    @Input()
    public genre: Genre;
}
