import { Observable } from 'rxjs';
import { Artist } from './../models';

export class Track {  
  public id: string = '';
  public name: string ='';
  public artists: Artist[];
  public popularity: number = 0;  
  public toJson(): string {debugger; return JSON.stringify(this);}
}
