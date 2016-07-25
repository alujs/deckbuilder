import { Component } from '@angular/core';
import { CommService } from '../../comm.service';
import { DeckBarList } from './cards/deck-bar-list.component';
import { ManaCurveChart } from './charts/mana-curve-chart.component';
import { ManaPieChart } from './charts/mana-pie-chart.component';
import { TypeChart } from './charts/card-type-chart.component';
import { Http } from '@angular/http';
import { AddDeck, RemoveDeck, SaveDeckChanges, ChangeDeck } from './deck-events.class';
import { UserService } from '../../user.service';
import { PlayMat } from './playmat/playmat.component';

@Component({
  selector: 'deck-bar',
  directives: [ManaPieChart, ManaCurveChart, DeckBarList, TypeChart, PlayMat],
  template:`
    <playmat [hidden]="playMatStatus" (status)="togglePlayMatOff($event)"></playmat>
    <aside>
      <div class="container">
        <label class="deck-selector">
          Decks Available:
          <select [(ngModel)]="selectedDeck" (ngModelChange)="onChange(selectedDeck)">
            <option *ngFor="let d of decks" [value]="d.id">{{d.deck_name}}</option>
          </select>
        </label>
      </div>

      <div class="container">
        <label class="deck-name">
          <input type="text" [placeholder]="currentDeck.deck_name"  [(ngModel)]="deckName"/>
          <button (click)="saveDeckChanges()">Save</button>
          <button (click)="addDeck()">Create</button>
          <button (click)="removeDeck()">Remove</button>
          <button (click)="exportDeck()">Toggle Text List</button>
          <button (click)="togglePlayMatOn()">Toggle Play Mat</button>
        </label>
      </div>
      <figcaption>{{ total }}</figcaption>
      <div class="container" [hidden]="!exportStatus">
        <p class="card" *ngFor="let card of cardQuantityMap"> {{ card.quantity }}x {{ card.name }} </p>
      </div>

      <div [hidden]="exportStatus" class="container">
        <div class="deck-container">
          <deck-bar-list></deck-bar-list>
        </div>
      </div>

      <div class="container">
        <figcaption>Mana Curve</figcaption>
        <mana-curve-chart></mana-curve-chart>
      </div>

      <div class="container">
        <figcaption>Mana Distribution</figcaption>
        <mana-pie-chart></mana-pie-chart>
      </div>

      <div class="containerLast">
        <figcaption>Type Distribution</figcaption>
        <type-chart></type-chart>
      </div>
    </aside>
  `,
  styleUrls: ['./deck-bar.css']
})


export class DeckBar {
  deckName: string;
  decks: any;
  currentDeck: any;
  decksListener: any;
  currentListener: any;
  cacheListener: any;
  cardCache: any;
  emitEvent: any;
  userId: any;
  selectedDeck: any;
  exportStatus: boolean;
  cardQuantityMap: any;
  playMatStatus = true;

  constructor( public commService: CommService, public http: Http, public userService: UserService ) {
    this.deckName = '';
    this.decks = [];
    this.cardQuantityMap = [];
    this.currentDeck = {
      id: null,
      deck_name: ''
    };

    this.total = 0;
    this.exportStatus = false;
    this.selectedDeck = this.currentDeck.id;

    this.cardCache = {};
    this.emitEvent = commService.next;

    this.cacheListener = commService.provideChannel('cache')
    .subscribe(cache => {
      this.cardCache = cache;
    });


    this.currentListener = commService.provideChannel('currentDeck')
    .subscribe(currentDeck => {
      this.cardQuantityMap = [];
      this.currentDeck = currentDeck;
      this.selectedDeck = currentDeck.id;
      this.total = 0;

      for(let card in currentDeck.cards) {
        this.cardQuantityMap.push({
          name: this.cardCache[card].name,
          quantity: currentDeck.cards[card]
        });
        this.total += currentDeck.cards[card];
      }
    });

    this.decksListener = commService.provideChannel('profile.deckList')
    .subscribe(decklist => { 
        this.decks = decklist;
    });

    this.decksListener = commService.provideChannel('profile.id')
      .subscribe(id => {
        this.userId = id;
      });
  }

  getCardQuantity( cardId ) {
    return this.currentDeck.cards[cardId];
  }

  onChange( deckId ) {
    this.emitEvent(new ChangeDeck(deckId));
  }

  addDeck( deckName ) {
    this.emitEvent(new AddDeck());
  }

  togglePlayMatOff() {
    this.playMatStatus = true;
  }

  togglePlayMatOn() {
    this.playMatStatus = false;
  }

  removeDeck() {
    this.emitEvent(new RemoveDeck(this.userId, this.currentDeck.id, this.commService, this.http));
  }

  saveDeckChanges( currentDeck ) {

    this.emitEvent(new SaveDeckChanges(this.deckName || this.currentDeck.deck_name, this.currentDeck, this.userId, this.commService, this.http));
  }

  exportDeck() {
    this.exportStatus = !this.exportStatus;
  }

}