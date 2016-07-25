import { Component } from '@angular/core';
import { CommService } from '../../comm.service';
import * as d3 from 'd3';
import * as _ from 'lodash';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Component({
  selector: 'hand-simulator',
  template: `
    <div class="resultBox">
      <button class="button" (click)="constructDeck()"> Refresh Hand and Card Draw</button>
      <div class="results" *ngFor="let hand of currentResults">
        <p class="begend"> {{ hand.round }} </p>

          <div class="card" *ngFor="let card of hand.cards; let i = index" > 
            {{ card.name }} {{ card.converted }} 
            <div *ngIf="i === 6" class="draw"> ** Draw ** </div>
          </div>

      </div>
    </div>
  `,
  styles: [
    `
      .draw {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .button {
        position: relative;
        left: 8%
      }

      .resultBox {
        margin-bottom: 100px;
      }

      .results {
        color: blueviolet
      }

      .begend {
        text-align: center;
        text-decoration: underline overline;
      }

      .card {
        margin-bottom: 5px;
        font-size: 12px;
        margin-top: 5px;
      }
    `
  ]

})

export class HandSimulator {
  listener: any;
  cache: any;
  currentResults: any;
  deck: any;

  constructor( public commService: CommService ) {
    this.currentResults = [{
      round: null, results: []
    }];

    this.listener = this.commService.provideChannel('cache')
      .subscribe(cache => {
        this.cache = cache;
      });

    this.listener = this.commService.provideChannel('currentDeck')
      .subscribe(deck => {
        if(this.cache) {
          this.deck = deck.cards;
          this.constructDeck(deck.cards);
        } else {
          setTimeout(() => {
            this.constructDeck(deck.cards);
          }, 1000);
        }
      });
  }

  constructDeck( deck = this.deck ) {
    return this.simulateHands(_.reduce(deck, (acc, quantity, cardId) => {
      for(let i = 0; i < quantity; i++ ) {
        acc.push(this.cache[cardId]);
      }

      return acc;
    }, []));
  }

  simulateHands( deck, iter = 5 ) {
    var results = [];
    
    for(let i = 1; i <= iter; i++) {
      let round = [...deck];
      let roundResults = [];

        for(let x =  0; x < 12; x++) {
          let pickValue = getRandom(0, round.length - 1);
          let cardPicked = round[pickValue];

          if(cardPicked === undefined) {
            break;
          }


          roundResults.push(cardPicked);
          delete round[pickValue];
          round = round.filter(card => card);
        }

      results.push({round: i, cards: roundResults});
    }

    this.currentResults = results;
    return results;
  }

  // renderResults( results ) {

  // }
}