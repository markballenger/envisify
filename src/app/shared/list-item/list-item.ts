import { Component, Input } from '@angular/core';

export interface ListItem {
    name: string;
}

@Component({
    selector: 'list-item',
    template: `
        <div class="item-content">
            <div class="name">{{item.name}}</div>
        </div>
    `,
    styleUrls: ['./list-item.scss']
})
export class ListItemComponent {
    @Input()
    public item: ListItem;
}
