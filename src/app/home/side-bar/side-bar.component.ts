import { Component } from '@angular/core';
import { CommService } from '../../comm.service';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HandSimulator } from './hand-simulator.component';
import { OpacityToggle } from './opacity-directive';
// Normally, to preserve the architecture, you would by pass pipes like this but
// this is for learnin'

class currentSettings {
  
  constructor( public settings: any ) {
    
  }

  update( state: any ) {
    state.filterState = Object.assign((state.filterState || {}), this.settings);
    return state;
  }
}

@Component({ 
  selector: 'side-bar',
  directives: [HandSimulator, OpacityToggle],
  template: `
    <div  class="side-bar">
    <form [formGroup]="search">

      <div class="container">
        <label class="forms"> Power <input type="number" formControlName="power"/>
          
          Toughness <input type="number" formControlName="toughness"/>
          
          Converted <input type="number" formControlName="converted"/>
        </label>
      </div>

      <div class="container">
        <label class="forms">
        Sets
          <select formControlName="set">
            <option *ngFor="let s of sets" [value]="s">{{s}}</option>
          </select>
        </label>
      </div>

      <div class="container">
        <label class="forms">
        Rarity
          <select formControlName="rarity">
            <option *ngFor="let r of rarity" [value]="r">{{r}}</option>
          </select>
        </label>
      </div>

      <div class="container">
        <label class="forms">
          Type
          <select formControlName="primaryTypes">
             <option *ngFor="let t of type" [value]="t">{{t}}</option>
          </select>
        </label>
      </div>

      <div class="container">
        <label class="forms">
          Subtype <input type="text" formControlName="subTypes" />
        </label>
      </div>

      <div class="container">
          <label *ngFor="let m of mana; let i = index">
            <img opacityToggle class="manaIco" (click)="checkStatus(manaTypes[i])" [src]="m" />
          </label>
      
      </div>
    </form>

      <div class="container">
        <hand-simulator></hand-simulator>
      </div>

    </div>
  `,
  styles: [
  `
  .side-bar {
    position: fixed;
    overflow-y: scroll;
    width: 15%;
    top: 10%;
    color: #805507;
    height: 100%;
    z-index: 5;
    background: #edece8;
    border-top: 4px groove rgba(255, 255, 255, 0.51);
    border-right: 4px groove rgba(255, 255, 255, 0.56);
  }
  
  .forms {
    display: flex;
    flex-wrap: wrap;
    width: 20%;
  }

  .container{
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 5px;
    margin-right: 12px;
  }
  .manaIco {
    width: 28px;
    height: 28px;
  }
  `
  ]
})

export class SideBar {
  emitEvent: any;
  sets: any;
  rarity: any;
  type: any;
  mana: any;
  manaTypes: any;
  checklist: any;
  search: any;
  state: any;


  constructor( commService: CommService ) {
    this.state = {};
    this.emitEvent = commService.next;
    this.sets = [
      null,
      'bfz',
      'origins',
      'dtk',
      'ogw',
      'soi',
      'emn'
    ];
    
    this.rarity = [null, 'Mythic Rare', 'Rare', 'Uncommon', 'Common'];
    this.type = [null, 'Land', 'Creature', 'Artifact', 'Enchantment', 'Instant', 'Sorcery', 'Planeswalker'];
    this.mana = [
      '../assets/img/Black_Mana.png', 
      '../assets/img/Blue_Mana.png',
      '../assets/img/Green_Mana.png',
      '../assets/img/Red_Mana.png',
      '../assets/img/White_Mana.png',
      '../assets/img/colorless.png' // colorless?
    ];

    this.manaTypes = [
      'Black',
      'Blue',
      'Green',
      'Red',
      'White',
      null
    ];

    this.checklist = {
      black: false,
      blue: false,
      green: false,
      red: false,
      white: false,
      colorless: false
    };

    this.search = new FormGroup({
      power: new FormControl(null),
      toughness: new FormControl(null),
      converted: new FormControl(null),
      rarity: new FormControl(null),
      set: new FormControl(null),
      primaryTypes: new FormControl(null),
      subTypes: new FormControl(null)
    });

    this.search.valueChanges
      .debounceTime(700)
      .subscribe(data => this.filterModel(data));
  }

  filterModel( data: any) {

    this.state = Object.assign(this.state, data);
    this.emitEvent(new currentSettings(this.state));
  }

  checkStatus( type ) {
    let colors = [];
    
    if(this.checklist[type]) {
      this.checklist[type] = false;
    } else {
      this.checklist[type] = true;
    }


    for(var i in this.checklist) {
      if(this.checklist[i]) {
        if(i === 'null') {
          colors.push(null);
        } else {
          colors.push(i);
        }
      }
    }

    this.search.valueChanges.next({ colors });
  }

}

/*
    <form [formGroup]="search">
      <div class="powerToughnessConvertedCost">
        <label> Power / Toughness , Converted
          <input type="text" class="form-control" required  [ngFormControl]="power"/>
          /
          <input type="text" class="form-control" required  [ngFormControl]="toughness"/>
          ,
          <input type="text" class="form-control" required [ngFormControl]="converted"/>
        </label>
      </div>


      <div class="manaTypes">
      </div>

      <div class="type">
      </div>

      <div class="rarity">
      </div>
    </form>
power
toughness
set
language
converted mana cost
mana types
traits
type
rarity
*/