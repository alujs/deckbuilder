import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommService } from './comm.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  profile: any;
  listener: any;
  constructor( private commService: CommService, private router: Router ) {
    try {
      this.profile = JSON.parse(window.localStorage.profile);
    } catch (e) {
      this.profile = null;
    }
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if(this.profile &&  this.profile.validated) {
      return true
    }

    console.log('This is false: ' + JSON.stringify(this.profile));
    
    this.router.navigate(['']);
    return false;
  }
}