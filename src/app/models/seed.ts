import {Observable} from 'rxjs';

export class Seed {
    public afterFilteringSize: number;
    public afterRelinkingSize: number;
    public href: string;
    public id: string;
    public initialPoolSize: number;
    public type: string;
    public toJson(): string {return JSON.stringify(this);}
}