import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Modal } from './modal.component';
import { UserService } from './user.service';
import { CommService } from './comm.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, Modal],
  styleUrls: ['./app.style.css'],
  template: `
    <modal></modal>
    <router-outlet></router-outlet>
  `
})

export class App {
  constructor( private commService: CommService, private UserService: UserService ) {}
}
