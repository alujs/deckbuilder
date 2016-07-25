import { Component, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { CommService } from '../../../comm.service';
import * as _ from 'lodash';

@Component({
  selector: 'mana-curve-chart',
  template: ``
})

export class ManaCurveChart implements AfterViewInit {
  bars: any;
  cardList: any;
  cache: any;

  constructor( public el: ElementRef, public commService: CommService ) {
    this.cardList = {};
    this.bars;

    this.commService.provideChannel('currentDeck')
    .subscribe(deck => {
      this.preprocessUpdate(deck);
    });

    this.commService.provideChannel('cache')
    .subscribe(cache => {
      this.cache = cache;
    });
  }

  ngAfterViewInit() {
    
    var chartContainer = d3.select(this.el.nativeElement)
      .append("svg")
      .attr("class", "bar")
      
    this.bars = chartContainer;
  }

  preprocessUpdate( deck ) {

    if(!this.cache) {
      setTimeout(() => {
        this.preprocessUpdate(deck);
      }, 2000);

      return;
    }

    var manaCurve = {};
    var cards = deck.cards;
    
    for(let card in cards) {
      if(this.cache[card]) {
        manaCurve[this.cache[card].converted] = (
          manaCurve[this.cache[card].converted] ?
          manaCurve[this.cache[card].converted] + cards[card] :
          cards[card]
        );
      }
    }

    delete manaCurve[null];

    if(Object.keys(manaCurve).length > 0 && this.bars) { 
      return this.update(
        _.map(
          manaCurve, 
          (quantity, converted) => {
              return { converted, quantity };
          }
        )
      );
    }

    if(Object.keys(manaCurve).length > 0 && this.bars) {
      setTimeout(() => {
        this.preprocessUpdate(deck)
      }, 1000);
      return;
    }

    return this.update([]);
  }

  update(data) {
    var update = this.bars
      .selectAll("rect")
      .data(data)

    update
      .attr("height", "19px")
      .attr("width", function(d) { return d.quantity * 10 +"px"})
      .attr("transform", function(d, i) { return "translate(15," + i * 20 + ")"; })
      .style("fill", "blue")
      .enter()
      .append("rect")
      .attr("height", "19px")
      .attr("width", function(d) { return d.quantity * 10 +"px"})
      .attr("transform", function(d, i) { return "translate(15," + i * 20 + ")"; })
      .style("fill", "blue");

    d3.select('.bar').selectAll("text").data([]).exit().remove();

    this.bars
      .selectAll(".barText")
      .data(data)
      .enter()
      .append("text")
      .attr("class",".barText")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .attr("x", function(d) { return 4;})
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(function(d) { return d.converted; })
      .style("fill", "black")
      .style("font", "10px sans-serif")
      .style("text-anchor", "middle");


    this.bars
      .selectAll(".barEnds")
      .data(data)
      .enter()
      .append("text")
      .attr("class",".barEnds")
      .attr("transform", function(d, i) { return "translate(" + ( 5 + (d.quantity * 10)) + "," + i * 20 + ")"; })
      .attr("x", function(d) { return 4;})
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(function(d) { return d.quantity; })
      .style("fill", "white")
      .style("font", "10px sans-serif")
      .style("text-anchor", "middle");

    d3.select('.bar').attr("height", (data.length * 22) + "px");

    update.exit().remove(); 
  }
}