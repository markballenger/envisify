import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Artist, Genre } from './../models';
import { LocalStorage, LocalStorageService } from 'ng2-webstorage';
import { ApiService } from './api.service';

interface IMessagesOperation extends Function {
  (artists: Artist[]): Artist[];
}

@Injectable()
export class SpotifyService {
  
  busy: boolean;

  constructor(api: ApiService){

  }
}