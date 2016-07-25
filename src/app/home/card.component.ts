import { Component, Input } from '@angular/core';
import { CardDetails } from './card-details.component';
import { CommService } from '../comm.service';

class modCard {

  constructor( public card, public cardCounterModifier ) {}

  update( state: any ) {

    state.currentDeck.cards[this.card.id] = (state.currentDeck.cards[this.card.id] + this.cardCounterModifier) || this.cardCounterModifier;
    if(state.currentDeck.cards[this.card.id] <= 0) {        
      delete state.currentDeck.cards[this.card.id];
    }
        
    return state;
  }
}

@Component({
  selector: 'card',
  directives: [CardDetails],
  template: `
    <div class="card-container">
      {{ setCurrentCard(card) }}
      <card-details class="card-details" [card]="card"></card-details>
        <div class="opts">
           {{ quantity || 0 }}
           <button (click)="add()">+</button>
           <button (click)="subtract()">-</button>
        </div>
    </div>
  `,
  styles: [
  `
    .opts {
      display: table-caption;
      text-align: center;
      font-size: 20px;
      font-family: cursive;
      font-weight: bold;
      padding-left: 20%;
    }
    .card-container{
      width: 90%;
      display: -webkit-box;
    }

    button {
      width: 25px;
      height: 20px;
    }
  `
  ]
})

export class Card {
  @Input() card;
  @Input() quantity;

  emitEvent: any;
  deckListener: any;
  present: any;
  currentCard: any;

  constructor(public commService: CommService) {
    this.emitEvent = commService.next;
    this.currentCard;
  }

  add() {
    this.emitEvent(new modCard(this.currentCard, 1));
  }

  subtract() {
    this.emitEvent(new modCard(this.currentCard, -1));
  }

  setCurrentCard(value) {
    this.currentCard = value;
  }
}

