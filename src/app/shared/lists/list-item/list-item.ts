import { Component, Input, AfterViewInit } from '@angular/core';

export class ListItem {
    name: string;
    count: number;
}

@Component({
    selector: 'list-item',
    template: `
        <div class="avatar" [hidden]="!item.count || item.count ===0">{{item?.count}}</div>
        <div class="item-content" [hidden]="item.genres">
            <div class="name">{{item?.name}}</div>
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
