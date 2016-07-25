import { Component, Input } from '@angular/core';
import { CommService } from '../../comm.service';
import { Observable } from 'rxjs';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup } from '@angular/forms';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

class navSearch {
  constructor( public settings: any ) {

  }

  update( state: any ) {
    // console.log(state.filterState);
    state.filterState = Object.assign((state.filterState || {}), this.settings);
    return state;
  }
}



@Component({
  selector: 'nav-bar',
  template: `
    <div class="container">
      <span class="profile">
        <div class="profileName"> {{ getUserName() }} </div>
        <button (click)="logOut()"> Logout </button>
      </span>
      <form class="search" [formGroup]="lookup">
        <img  class="glass" src="../assets/img/search.png" />
          <input #in type="text" (keypress)="runLookUp($event.keyCode, in.value)" formControlName="name"/>
      </form>
    </div>
    
  `,
  styleUrls: ['./nav-bar.component.styles.css']
})

export class NavBar {
  @Input() profile;
  emitEvent: any;
  lookup: any;
  userName: string;

  constructor(private commService: CommService, private router: Router) {

    this.emitEvent = commService.next;
    this.lookup = new FormGroup({
      name: new FormControl(null)
    });

    this.lookup.valueChanges.debounce(function(x) {
      return Observable.timer(900);
    }).subscribe(data => this.runLookUp(13, data.name));
  }

  runLookUp( key, name ) {
    if(key === 13) {
      this.emitEvent(new navSearch({name, wording: name}));
    }
  }

  getUserName() {
    if(this.profile) {
      return this.profile.name;
    } else {
      return '';
    }
    
  }

  logOut() {

    window.localStorage.profile = null;
    delete window.localStorage.profile;
    window.location = '/';

  }
}