import { Component, Input } from '@angular/core';

import { ListItem } from './../list-item/list-item';

@Component({
    selector: 'multicol-list',
    template: `
        <div class="status">
             Showing <span class="badge">{{indices?.start + 1}}</span> 
             - <span class="badge">{{indices?.end}}</span>
             of <span class="badge">{{items?.length}}</span>
            <span>({{scrollItems?.length}} nodes)</span>
        </div>

        <virtual-scroll
            [items]="items"
            (update)="scrollItems = $event"
            (change)="indices = $event">

            <list-item *ngFor="let item of scrollItems" [item]="item"> </list-item>

        </virtual-scroll>
    `,
    styleUrls: ['./multicol-list.component.scss']
})
export class VerticalListComponent {

    @Input()
    items: ListItem[];

    indices: any;
}