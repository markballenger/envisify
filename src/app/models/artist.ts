import {Image} from './image';
import {IGenres} from './../models/interfaces';
import { Observable } from 'rxjs';

export class Artist implements IGenres {
  constructor(
      public name: string,
      public isNew: boolean,
      public id: string, 
      public href: string, 
      public type: string,
      public images: Image[],
      public genres: string[],  
      public popularity: number, 
      public uri: string,
      public relatedArtists: Observable<Artist[]>,
      public following: boolean,
      public relatedTo: string){   
    
    }

    
}

