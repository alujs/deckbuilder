import { Injectable } from '@angular/core';
import { CommService } from '../comm.service';
import { Card } from '../classes';
import { Headers, Http } from '@angular/http';

class DataSeed {

  constructor(public data: any ){

  }

  update( state: any ) {
    state.model = this.data;
    state.cache = this.data.reduce((acc, card) => {
      acc[card.id] = card;
      return acc;
    }, {});
    return state;
  }
}



@Injectable()
export class CardApi {
  emitEvent: any;
  
  constructor(private commService: CommService, private http: Http ) {
    
    this.emitEvent = commService.next;
    this.getCards();
  }

  getCards() {
    this.http.get('localhost/cards')
    .map(res => res.json())
    .subscribe((results) => {
      
      this.emitEvent(new DataSeed(results));
    });
  }
}