import {Image} from './image';
import { Observable } from 'rxjs';

export class Artist {
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
      public existsInLibrary: boolean,
      public relatedTo: string){   
    
    }

    
}

