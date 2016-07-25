import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { CommService } from '../../../comm.service';
import { DomSanitizationService, SafeResourceUrl } from '@angular/platform-browser';
import { DragDrop } from './drag-drop-directive';

@Component({
  selector: 'playmat',
  directives: [DragDrop],
  template: `
    <div class="mat">
      <button (click)=exit()>Exit</button>
      <button (click)=reset()>Reset</button>
        <div dragdrop class="frame" *ngFor="let card of cards">
          <object class="pic" [data]="sanitationService.bypassSecurityTrustResourceUrl(card.url)"  type="image/jpeg">
          </object>
        </div>
    </div>
  `,
  styleUrls: ['./playmat.styles.css']
})

export class PlayMat {
  @Output() status = new EventEmitter();
  deck: any;
  cache: any;
  cards = [];

  constructor( private commService: CommService, private sanitationService: DomSanitizationService ) {
    this.commService.provideChannel('currentDeck')
      .subscribe(deck => {
        this.cards = [];
        this.deck = deck;
        this.pushToCards();
      });

    this.commService.provideChannel('cache')
      .subscribe(cache => this.cache = cache);
  }

  pushToCards() {
    if(!this.cache) {
      setTimeout(() => {
        this.pushToCards();
      },1000);

      return;
    }

    _.each(this.deck.cards, (quantity, card) => {
      for(var i = 0; i < quantity; i++) {
        this.cards.push(this.cache[card]);
      }
    });
  }

  reset() {
    this.cards = [];

    setTimeout(() => {
      this.pushToCards();
    }, 500);
  }

  exit() {
    this.status.emit(true);
  }
}