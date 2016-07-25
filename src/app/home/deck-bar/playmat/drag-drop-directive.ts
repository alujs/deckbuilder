import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({ selector: '[dragdrop]' })

export class DragDrop {
  offsetX = 0;
  offsetY = 0;
  prevX = 0;
  prevY = 0;

  @HostListener('dragend', ['$event'])
  dragEnd(evt) {

    this.el.nativeElement.style.left = (evt.clientX - this.offsetX + this.prevX) + "px";
    this.el.nativeElement.style.top = (evt.clientY - this.offsetY + this.prevY) + "px";
    this.prevX = (evt.clientX - this.offsetX + this.prevX);
    this.prevY = (evt.clientY - this.offsetY + this.prevY);

  }

  @HostListener('dragstart', ['$event'])
  dragStart(evt) {

    evt.dataTransfer.effectAllowed = 'All';
    var rect = this.el.nativeElement.getBoundingClientRect();
    this.offsetX = evt.clientX;
    this.offsetY = evt.clientY;
  }

 
  constructor(public el: ElementRef) {}


}

