import { Component, Input, ViewEncapsalation } from '@angular/core';

import { ListItem } from './lists/list-item';

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
    styleUrls: ['./multicol-list.component.scss'],
    encapsalation: ViewEncapsalation.None
})
export class VerticalListComponent {

    @Input()
    items: ListItem[];

    indices: any;
}