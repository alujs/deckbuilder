import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { CommService } from '../comm.service';
import { Http } from '@angular/http';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup } from '@angular/forms';
import { authPrompt } from './auth-prompt.class.ts';
import { UserService } from '../user.service';
/*
 * App Component
 * Top Level Component
 */
class ActivateModal {
   
  constructor(
    private injectedRouter: Router, 
    private injectedComm: CommService, 
    private http: Http
  ) {}

  update( state: any ) {

    state.modal = {
      count: state.modal.count + 1,
      cmd: 'activate',
      prop: authPrompt(this.injectedRouter, this.injectedComm, this.http)
    }

    return state;
  }
}


@Component({
  selector: 'splash',
  styleUrls: ['./styles.css'],
  template: `
    <header> <a class="start" (click)="auth(); false"> Login or Create an Account </a> </header>
      <img src="https://s3-us-west-1.amazonaws.com/mtgimages1/origins.png" />
    <footer>
      <br><br><br>
      <p> This is a deck builder prototype for the desktop.</p>
      <p> To use this simply click on Login or Create An Account.</p>
      <span>Currently the app all cards available in Standard. <a href="http://whatsinstandard.com/">(!)</a></span>
      <p> Feel free to make comments, pull requests, or feature requests.</p>
      <a href="https://github.com/steinernein/deckbuilder"><img class="linkTo" src="../assets/img/git.png"/></a>
      <a href="mailto:steinernein@gmail.com"><img class="linkTo" src="https://s3-us-west-1.amazonaws.com/mtgimages1/email.png"/></a>
    </footer>
  `
})

export class Splash {
  emitEvent: any;
  profile: any;

  constructor(private router: Router, private commService: CommService, private http: Http, private userService: UserService) {
    this.emitEvent = commService.next;

    try{
      this.profile = JSON.parse(window.localStorage.profile);
    }
  }

  auth() {
    if(this.profile && this.profile.validated) {
      this.router.navigate(['/home']);
    } else {
      this.emitEvent(new ActivateModal(this.router, this.commService, this.http));
    } 
  }

}
