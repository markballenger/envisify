import {Image} from './image';

export class Artist {
  constructor(
    public name: string,
    public isNew: boolean,
    public id: string, 
    public href: string, 
    public type: string,
    public images: Image[],  
    public popularity: number, 
    public uri: string){   
    }
}

