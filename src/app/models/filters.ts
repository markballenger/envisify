import {Genre,Artist} from './';

export class Filters{
    public genres : Genre[] = [];
    public artists: Artist[] = [];
    public text: string = '';
    public excludeMy: boolean = false;
    public sortBy: string = '';
    public sortDir: string = '';
}