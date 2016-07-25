import { Component, OnInit, ViewContainerRef, DynamicComponentLoader, ElementRef, OnDestroy } from '@angular/core';
import { CommService } from './comm.service';

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

class RegisterProp {
  constructor() {}

  update( state: any ) {
    state.modal = {
      count: 0
    };

    return state; 
  }
}


@Component({
  selector: 'modal',
  template:`
    <div [style.display]="modalStatus() ? 'block'  : 'none'" class="backdrop"></div>
  `, 
   styles: [`
    .backdrop  {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background-color: rgba(0,0,0,0.5); 
    }
    `
  ]

})

export class Modal implements OnInit, OnDestroy {
  listener: any;
  modalCount: any;
  idToModalMap: any;

  constructor(public commService: CommService, public dcl: DynamicComponentLoader, public viewRef: ViewContainerRef) {  
    this.modalCount = 0;
    this.commService.registerStateProperty(new RegisterProp());
    this.listener = commService.provideChannel('modal');
    this.idToModalMap = {}; 
  }


  ngOnInit() {
    this.listener.subscribe((modal) => {
      if (modal.count !== this.modalCount) {
        this[modal.cmd](modal.prop);
      }
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

  activate( modal ) {
    this.dcl.loadNextToLocation( modal, this.viewRef)
    .then((compRef) => {
      var id = '' + getRandom(1, 100);
      compRef.instance.modalId = id;
      this.idToModalMap[id] = compRef;
      this.modalCount++;
    });
  }

  deactivate( modalId ) {  
    this.idToModalMap[modalId].destroy();
    this.modalCount--;
  }

  modalStatus() {
    return this.modalCount > 0;
  }
}