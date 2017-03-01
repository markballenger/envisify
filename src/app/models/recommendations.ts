import { Observable } from 'rxjs';
import { Track } from './track';
import { Artist } from './artist';
import { Seed } from './seed';

export class Recommendations {  

    public tracks: Track[];
    public seeds: Seed[];
}
