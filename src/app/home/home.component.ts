import { Component, OnInit, ViewContainerRef, DynamicComponentLoader, ElementRef } from '@angular/core';
import { CommService } from '../comm.service';
import { CardApi } from './card-api.service';
import { NavBar } from './nav-bar/nav-bar.component';
import { Card } from './card.component';
import { SideBar } from './side-bar/side-bar.component';
import { CardFilter } from './card.pipe';
import { BehaviorSubject, Observable, ReplaySubject, AsyncSubject, Subject } from 'rxjs';
import { DeckBar } from './deck-bar/deck-bar.component';
import { LoadOut } from './loadout.directive';
import { filters } from './filters';
import * as _ from 'lodash';

@Component({
  selector: 'home',
  pipes: [CardFilter],
  directives: [NavBar, Card, SideBar, DeckBar, LoadOut],
  template: `
    <div class="main">
      <nav-bar [profile]="getProfile()"></nav-bar>
      <side-bar></side-bar>
      <deck-bar></deck-bar>
      <div class="topPagination">
        <button (click)="renderNextPage(-1)"> Prev </button>
        {{ page +  1 }} of {{ maxPages + 1 || 1 }}
        <button (click)="renderNextPage(1)"> Next </button>
      </div>
      <div class="container">
        <div class="area-container" *ngFor="let card of render(); trackBy: trackById">
            <div *ngIf="card">
              {{ card.name }}
              <card class="card" [quantity]="deck.cards[card.id]" [card]="card"></card>
            </div>
        </div>
      </div>
      <div class="botPagination">
        <button (click)="renderNextPage(-1)"> Prev </button>
          {{ page +  1 }} of {{ maxPages + 1 || 1 }}
        <button (click)="renderNextPage(1)"> Next </button>
      </div>     
    </div>
  `,
  styles: [
    `
      .container {
        width: 69%;
        position: absolute;
        left: 15%;
        top: 10%;
        font-size: 0;
        display: flex;
        flex-flow: row wrap;
        padding: .5vw;
        -webkit-align-items: center;
         align-items: center;
        -webkit-justify-content: center;
         justify-content: center;
         margin-bottom: 50px;
         margin-top: 50px;     
      }

      .area-container {
        width: 230px;
        margin: 10px 10px;
      }

      .loading {
        z-index: 500;
        height: 100%;
        width: 100%;
        position: fixed;
        background-color: black;
        color: white;
        text-align: center;
        vertical-align: middle;
        font-size: 30px;
        line-height: 30;
        -webkit-transition: opacity 3s ease-in-out;
        -moz-transition: opacity 3s ease-in-out;
        -ms-transition: opacity 3s ease-in-out;
        -o-transition: opacity 3s ease-in-out;
      }

      .topPagination{
        left: 45%;
        top: 9%;
        z-index: 222;
        position: fixed;
        color: slateblue;
      }

      .botPagination{
        left: 45%;
        bottom: 0%;
        z-index: 222;
        position: fixed;
        color: slateblue;
      }

      button {
        width: 50px;
        height: 30px;
      }
    `
  ]
})


export class Home {
  cards = [];
  profile: any;
  cache: any;
  page = 0;
  maxResults = 100;
  viewList = [];
  filterState = {};

  constructor(public commService: CommService, public cardApi: CardApi) {

   commService.provideChannel('profile')
      .subscribe(profile => {
        this.profile = profile;
      });
  
   commService.provideChannel('cache')
      .subscribe(cache => {
        this.cache = cache;
      });

    commService.provideChannel('model')
      .subscribe(cardList => {
        this.cards = _.sortBy([...cardList], card => card.name);
        this.setMinMaxPages();
      });

    commService.provideChannel('filterState')
      .subscribe(filterState => {
 
        this.filterState = _.reduce(filterState, (activeFilters, filterValue, filter) => {
          if(Array.isArray(filterValue) && filterValue.length === 0) {
            return activeFilters;
          }

          if(filterValue === null || filterValue === 'null' || filterValue === '') {
            return activeFilters;
          }
            
          activeFilters[filter] = filterValue;

          return activeFilters;
        }, {});



        this.viewList = this.filterCards();

        this.setMinMaxPages();
        this.render();
      });

    commService.provideChannel('currentDeck')
      .subscribe(deck => {
        this.deck = deck;
      });
  }

  trackById( index, card ) {
    return card.id;
  }

  getProfile() {  
    return this.profile;
  }

  render() {
    return this.viewList.slice((this.page * this.maxResults), (this.maxResults + (this.page * this.maxResults)));
  }


  setMinMaxPages() {
    this.page = 0;
    this.maxPages = parseInt((this.viewList.length/this.maxResults), 10) || 0;
  }

  renderNextPage( page ) {
    this.page += page;

    if(this.page < 0) {
      this.page = 0;
      return;
    }

    if(this.page > this.maxPages) {
      this.page = this.maxPages;
      return;
    }

    this.render();
  }

  filterCards() {
    
    return this.cards.filter((card) => {

      return _.every(this.filterState, function( value, element ) {

        if(element === 'wording' || element === 'name') {
          if(filters[element](card['wording'], value) || filters[element](card['name'], value)) {
            return true;
          } else {
            return false;
          }
        }

        return filters[element](card[element], value);
      });
      
   });
 }

}