import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({ selector: '[opacityToggle]' })

export class OpacityToggle {
  status = false;

  @HostListener('click', ['$event.target'])
  onClick() {
    if(this.status) {
      this.el.nativeElement.style.opacity = .3;
      this.status = false;
    } else {
      this.el.nativeElement.style.opacity = 1;
      this.status = true;
    }
  }

  constructor(public el: ElementRef) {
    this.el.nativeElement.style.opacity = .3;
  }

}