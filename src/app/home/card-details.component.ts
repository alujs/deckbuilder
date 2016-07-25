import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommService } from '../comm.service';
import { Card } from '../classes';
import { DomSanitizationService, SafeResourceUrl } from '@angular/platform-browser';

class deactivateCardModal {
  

  constructor( public modalId ) {
    
  }

  update( state ) {
    state.modal = {
      count: state.modal.count - 1,
      cmd: 'deactivate',
      prop: this.modalId
    }

    return state;
  } 
}


function exportCard( target, commService ) {
  
  @Component({
    selector: 'child',
    template: `
      <div class="container">
        <img class="card" src=${'"' + target.url + '"'} />
      </div>
    <div class="shadow" (click)="closeModal()">
    </div>
    `,
    styles: [`
     .container {
        width: 400px;
        height: 400px;
        line-height: 200px;
        position: fixed;
        top: 30%; 
        left: 45%;
        margin-top: -100px;
        margin-left: -150px;
        background-color: #f1c40f;
        border-radius: 5px;
        text-align: center;
        z-index: 11;
      }
    `,
    `
    .card {
      width: 100%;
    }
    `,
    `
    .shadow {
      width: 100%;
      position: fixed;
      height: 100%;
      z-index: 10;
    }
    `
    ]
  })

  class CardDetailsChild {
    modalId: any;
    commService: any;

    constructor() {
      this.modalId = null;
      this.commService = commService;
    }

    closeModal() {
      this.commService.next(new deactivateCardModal(this.modalId));     
    }

  }

  return CardDetailsChild;
}

class ActivateModal {
  
  constructor(public card: any, public commService: CommService) {}

  update( state ) {
    
    state.modal = {
      count: state.modal.count + 1,
      cmd: 'activate',
      prop: exportCard(this.card, this.commService)
    }

    return state;
  }
}

@Component({
  selector: 'card-details',
  template: `
    <div class="card">
      {{ card.name }}
      <object class="pic" (click)="activateModal()" [data]="sanitationService.bypassSecurityTrustResourceUrl(card.url)"  type="image/jpeg">
      </object>
    </div>
 
  `,
  styles: [  
  `
    .card {
      flex: auto;
      width: 100%;
      display: -webkit-box;
      font-size: 10px;
      text-align: end;
    }

    .pic {
      width: 100%;
      height: auto;
      box-shadow: 2px 4px 2px #888888;
      transition: .8s opacity;
      opacity: 0.8;
    }

    .pic:hover {
      opacity: 1;
    }
  `
  ]
})

export class CardDetails {
  @Input() card;
  emitEvent: any;
  edit: boolean;
  inputTag: string;
  
  constructor(
    public commService: CommService, 
    public sanitationService: DomSanitizationService
  ) 
  {
    this.inputTag = '';
    this.edit = false;
    this.emitEvent = commService.next;
  }

  activateModal() {
    this.emitEvent(new ActivateModal(this.card, this.commService));
  }
}