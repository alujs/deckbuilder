import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { CommService } from '../comm.service';
import { Http } from '@angular/http';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeckList } from '../classes.ts';

class Fail {
  update( state: any ) {
    state.loginFailure = true;
    state.loginFailureCount = parseInt(state.loginFailureCount + 1, 10)|| 0;
    return state;
  }
}

class Proceed {
  modalId: any;

  constructor( modalId ) {
    this.modalId = modalId;
  }

  update( state: any ) {

    state.modal = {
      cmd: 'deactivate',
      count: state.modal.count - 1,
      prop: this.modalId
    };

    return state;
  }

}

class Reply {
  http: Http;
  results: any;

  constructor( results: any ) {
    this.results = results;
  }

  update( state: any ) {
    if(!this.results.err) {
      state.profile.name = this.results.name;
      state.profile.id = this.results.id;
      state.profile.validated = true;
      state.filterState = {};

      if(this.results.decklist && this.results.decklist[0] !== null) {
        state.profile.deckList = (new DeckList(this.results.decklist)).get();
      }
    
      if(state.profile.deckList[0]) {
        state.currentDeck =  state.profile.deckList[0];
      }

      window.localStorage.profile = JSON.stringify(state.profile);
    }
    
    return state;
  }
}


class Attempt {
  emitEvent: any;
  
  constructor(private userName: string, private password: string, public commService: CommService, public http: Http, public type: string) {
    this.emitEvent =  this.commService.next;
  }

  update( state: any) {
    return state;
  }

  run( state: any ) {
    this.http.post(`localhost/${this.type}`, {
      name: this.userName,
      password: this.password
    })
    .subscribe(
      (results) => {
        let body = results.json();
        this.emitEvent(new Reply(body));
      }, 
      (error) => {
        this.emitEvent(new Fail());
      }
    );

    return state;
  }
}


export function authPrompt(router: Router, commService: CommService, http: Http ) {

  @Component({
    selector: 'auth-prompt',
    template: `
      <div class="authContainer">    
        <form [formGroup]="authentication">
          <label><div class="ico"><img class="logIco" src="../assets/img/user.png"/></div><input #userName type="text" formControlName="userName"/></label>
          <label><div class="ico"><img class="logIco" src="../assets/img/lock.png"/></div><input #password type="password" formControlName="password"/></label>
          <div class="warning" [hidden]="authentication.valid"> Fill out User Name and Password, Please.</div>
          <div class="warning" [hidden]="status"> Invalid User Name or Password.</div>
          <div class="buttonContainer">
            <button (click)="login(userName.value, password.value)"> Login </button>
            <button class="signup" (click)="signUp(userName.value, password.value)"> Sign Up </button>
          </div>
        </form>   
      </div>
    `,
    styleUrls: ['./auth-prompt.css']
  })

  class AuthPrompt implements OnDestroy {
    modalId: any = null;
    router: Router = router;
    commService: CommService = commService;
    emitEvent: any;
    listener: any;
    http: Http = http;
    authentication: FormGroup;
    authListener: any;
    status = true;

    constructor() {
      this.emitEvent = commService.next;
      this.listener = commService.provideChannel('profile').subscribe(profile => {
        if(profile.validated) {
          this.closeModal();
        }
      });

      this.authListener = commService.provideChannel('loginFailure').subscribe(failure => {
        this.loginFail();
      });

      this.authentication = new FormGroup({
        userName: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required])
      });

    }
 
    ngOnDestroy() {
      this.listener.unsubscribe();
      this.authListener.unsubscribe();
    }

    loginFail() {
      this.status = false;
      setTimeout(() => {
        this.status = true;
      }, 2000);
    }

    login(userName: string, password: string) {
      if(userName === '' || password === '') {
        this.loginFail();
        return;
      }
      this.emitEvent(new Attempt(userName, password, this.commService, this.http, 'login' ));
    }

    signUp(userName: string, password: string) {
      if(userName === '' || password === '') {
        this.loginFail();
        return;
      }
      this.emitEvent(new Attempt(userName, password, this.commService, this.http, 'signup'));
    }

    closeModal() {
      if(!this.modalId) {
        window.setTimeout(() => {
          this.closeModal();
        }, 100);

        return;
      }

      this.emitEvent(new Proceed(this.modalId));
      router.navigate(['/home']);
    }
  }

  return AuthPrompt;
}