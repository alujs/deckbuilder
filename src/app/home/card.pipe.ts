import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'cardFilter'
})

export class CardFilter implements PipeTransform {
  transform( collection = [] , settings: any ) {
    return collection.filter((card) => {
      var status = true;
      var stringAnyMatch = [];

      if(Object.keys(settings).length === 0) {
        return true;
      }

      for(var i in settings) {
        if(typeof settings[i] === 'number') {
          if(card[i] !== settings[i]) {
            status = false;
          }
        }

        if(typeof settings[i] === 'string' && typeof card[i] === 'string') {
          if(!(card[i].indexOf(settings[i]) > -1)) {
            stringAnyMatch.push(false);
          } else {
            stringAnyMatch.push(true);
          }
        }

        if(i === 'colors') {

          settings[i].forEach(color => {
            if(card[color] === undefined) {
              status = false;        
            }
          });
        }
      }

      if(stringAnyMatch.length > 0 && status) {
        status = _.some(stringAnyMatch);
      }
      
      return status;
    });
  }
}

/*


    this.power =  null;
    this.toughness =  null;
    this.converted =  null;
    this.set = null;
    this.rarity =  null;
    this.type =  null;
    this.subtype =  '';
    this.name = '';
    this.mana =  null;
    this.color = [];
*/