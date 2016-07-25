import { Component, AfterViewChecked, AfterContentChecked, AfterViewInit } from '@angular/core';
import { CommService } from '../../../comm.service';
import { DeckBarCards } from './deck-bar-cards.component';

class DeckListIncrement {

  constructor( public cardId ) {}

  update( state ) {
    state.currentDeck.cards[this.cardId] = state.currentDeck.cards[this.cardId] + 1;

    return state;
  }
}

class DeckListDecrement {

  constructor( public cardId ) {}

  update( state ) {
    state.currentDeck.cards[this.cardId] = state.currentDeck.cards[this.cardId] - 1;
    
    if(state.currentDeck.cards[this.cardId] <= 0) {
      delete state.currentDeck.cards[this.cardId];
    }

    return state;
  }
}


@Component({
  selector: 'deck-bar-list',
  directives: [DeckBarCards],
  template: `
    <div class="cardHolder" *ngFor="let card of cards; trackBy: trackById"> 
      <deck-bar-card [card]="card"></deck-bar-card>
      <div class="cardEdge" *ngFor="let copies of card.total"></div>
      <div class="buttonContainer">
        <button (click)="add(card.id)">+</button> 
        <button (click)="remove(card.id);$event.stopPropagation();$event.preventDefault()">-</button>
      </div>
    </div>
  `,
  styles: [
    `
      .buttonContainer {
        position: absolute;
        right: 0%;
        display: flex;
        height: 25px;
        margin-right: 5px;
      }

      .cardHolder {
        height: 25px;
        display: flex;
        flex-direction: row;
      }

      .cardRow {

      }

      .cardEdge {
        width: 8px;
        height: 25px;
        background-color: black;
        margin-left: 1px;
        border-top-right-radius: 14px;
      }
    `
  ]
})

export class DeckBarList implements AfterViewChecked {
  listener: any;
  cache: any;
  deck: any;
  cards: any;
  posY: any;
  scrollBar: any;

  constructor(public commService: CommService) {
    this.scrollBar = true; // Work around to prevent scrollbar from jumping.
    this.deck = {
      id: null,
      cards: {}
    };

    this.posY = 0;

    this.cards = [];

    this.cache = this.commService.provideChannel('cache')
      .subscribe(cache => {
        this.cache = cache;
      });

    this.listener = this.commService.provideChannel('currentDeck')
      .subscribe(deck => {
        this.cards = [];
        Object.keys(deck.cards).forEach(cardId => {
          this.asyncCardFill(cardId, deck.cards[cardId]);
        });
      });
  }

  trackById( index, card ) {
    return card.id;
  }

  asyncCardFill( cardId: string, quantity: number ) {
    if(this.cache[cardId]) {
      let totalCards = [];

      for(let i = 0; i < quantity; i++) {
        totalCards.push(this.cache[cardId]);
      }

      this.cache[cardId].total = totalCards;
      this.cards.push(this.cache[cardId]);
    } else {

      setTimeout(() => {
        this.asyncCardFill(cardId, quantity);
      }, 500);
    }
  }

  add( cardId: string ) {
    this.commService.next(new DeckListIncrement(cardId));
  }

  remove( cardId: string ) {
    this.posY = document.querySelector("aside").scrollTop;
    this.scrollBar = false;
    this.commService.next(new DeckListDecrement(cardId));
  }

  ngAfterViewChecked() {
    if(!this.scrollBar) {
      document.querySelector("aside").scrollTop = this.posY;
      this.scrollBar = true;
    } 
  }
 
}