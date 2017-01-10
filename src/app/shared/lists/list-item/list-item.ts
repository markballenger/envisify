import { Component, Input, AfterViewInit } from '@angular/core';

export class ListItem {
    name: string;
    count: number;
}

@Component({
    selector: 'list-item',
    template: `
        <div class="avatar">{{item?.count}}</div>
        <div class="item-content">
            <div class="name">{{item?.name}}</div>
            <div>
                <span class="badge">{{item?.name}}/{{item?.name}}</span>
                <span>{{item?.name}} | {{item?.name}}</span>
            </div>
            <div>{{item?.name}}</div>
        </div>
    `,
    styleUrls: ['./list-item.scss']
})
export class ListItemComponent implements AfterViewInit {
    @Input()
    public item: ListItem;

    ngAfterViewInit(){
    }

}
