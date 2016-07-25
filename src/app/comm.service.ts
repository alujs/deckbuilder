import { Subject, BehaviorSubject, Observable, ReplaySubject, AsyncSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}


@Injectable()
export class CommService {

  input: any;  
  state: any;
  output: any;
  channels: any;

  constructor( public start: any ) {
    this.channels = {
      present: new Subject()
    };
    this.input = new Subject();
    this.state = {
      past: [],
      present: start || {},
      future: []
    };

    this.output = this.input.scan(
      (memo, event) => {
        // console.log('Incoming event: ', event);
        if(!memo.present) {
          memo.present = this.state.present;
        }

        memo.past.push(_.cloneDeep(memo.present));
        memo.present = event.update(memo.present);
        
        if(event.run) {
          event.run(memo.present);
        }

        this.state = memo;
        // console.log('State: ', memo);
        return memo;
      },
      {
        past: [],
        future: []
      }
    );

    this.output.pluck('present').subscribe(data => {
      // filter point can exist here for services to intercept?
      // this...
      for (var channel in this.channels) {
        this.channels[channel].next(data);
      }
    });

    this.next = this.next(null);
    this.registerStateProperty = this.next;
  }

  next( message: any ) {

    var self = this;

    return (event)=> {
      return self.input.next(event);
    };
  }

  registerStateProperty( caller: any ) {
    return null;
  }

  provideChannel( channelName: string, filter = null ) {

    var channelSeparators = channelName.split('.');
    var self = this;
    var lastProperty = channelSeparators[channelSeparators.length - 1];
    var initialSeed = true;

    filter = filter || ((data) => {
      return data;
    });

    return (() => {
      return self.channels.present
        .pluck(...channelSeparators)
        .filter(filter)
        .filter(present => {
          /* This filter does not activate change detection
             the first time around.
          */
          if(initialSeed) {
            initialSeed = false;
            return true;
          }

          let past = self.state.past[self.state.past.length -1];
          channelSeparators.forEach(channel => {
            past = past[channel];
          });

          return !_.isEqual(past,present);
        });
    })();
  }
}