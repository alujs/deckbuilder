import { Injectable, OnInit } from '@angular/core';
import { CommService } from './comm.service';
import { Http } from '@angular/http';

class SeedUser {

  update( state: any ) {

    try {
      var profile = JSON.parse(window.localStorage.profile);
      state.profile = profile;
      state.profile.validated = profile.validated || false;
      state.filterState = {};

      if(state.profile.deckList && state.profile.deckList[0]) {
        state.currentDeck = state.profile.deckList[0];
      }

      return state;
    } catch(e) {
      return state;
    }
  }
}

@Injectable()
export class UserService {
  emitEvent: any;
  listener: any;

  constructor( private commService: CommService, private http: Http ) {
    this.commService.next(new SeedUser());
    this.commService.provideChannel('profile')
    .subscribe(profile => {
      window.localStorage.profile = JSON.stringify(profile);
    });
  }
}