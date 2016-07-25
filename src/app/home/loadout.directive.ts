import { Directive, ElementRef, Input, OnChanges  } from '@angular/core';

@Directive({ selector: '[loadOut]' })

export class LoadOut implements OnChanges {
  @Input('loadOut') percentage;
  
  constructor(public el: ElementRef) {
    this.el.nativeElement.style.opacity = 1;
  }

  ngOnChanges(changes) {
    if(changes.percentage.currentValue === 100) {
      this.el.nativeElement.style['opacity'] = 0;
      setTimeout(() => {
        this.el.nativeElement.style['display'] = 'none';
      }, 4000);
    }
  }
}