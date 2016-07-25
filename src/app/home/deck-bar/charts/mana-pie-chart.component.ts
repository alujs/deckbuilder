import { Component, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { CommService } from '../../../comm.service';
import * as _ from 'lodash';

@Component({
  selector: 'mana-pie-chart',
  template: `
    <svg class="pie"></svg>
  `
})

export class ManaPieChart implements AfterViewInit {
  listener: any;
  cache: any;
  width: number;
  height: number;
  radius: any;
  colorMap: any;
  svg: any;
  pie: any;

  constructor(public commService: CommService) {
    this.listener;
    this.cache;
    this.pie;
    this.width = 200;
    this.height = 240;
    this.radius = Math.min(this.width, this.height)/2;

    this.listener = this.commService.provideChannel('currentDeck')
      .subscribe(deck => {
        this.preprocessUpdate(deck);
      });

    this.commService.provideChannel('cache')
      .subscribe(cache => {
        this.cache = cache;
      });
  }

  ngAfterViewInit() {

    var arc = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0);

    var labelArc = d3.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

    this.pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });


    this.svg = d3.select(".pie")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

  }
 
  preprocessUpdate( deck ) {

    if(!this.cache) {
      setTimeout(() => {
        this.preprocessUpdate(deck);
      }, 2000);

      return;
    }
    
    var total = 0;
    var data = [];

    var symbolMap = {
      G: 'green',
      R: 'red',
      B: 'black',
      U: 'blue',
      C: 'colorless',
      W: 'white'
    };

    var colorDistribution = {
      green: 0,
      red: 0,
      blue: 0,
      white: 0,
      black: 0,
      colorless: 0
    };

    for(var card in deck.cards) {
      if(this.cache[card].manaCost === null || this.cache[card].manaCost === undefined) {
        this.cache[card].manaCost = '';
      }
      let cost = this.cache[card].manaCost.replace(/[{}0-9]/g, '').split('');

      cost.forEach(sym => {
        colorDistribution[symbolMap[sym]] = (1 * deck.cards[card]) + colorDistribution[symbolMap[sym]];
        total = total + (1 * deck.cards[card]);
      });
    }

    for(var color in colorDistribution) {
      if(colorDistribution[color] > 0) {
        data.push({color: color, count: colorDistribution[color]});
      }
    }
    
    this.update(data, total);
  }

  update( data, total ) {
    
    var arc = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0);

    var labelArc = d3.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

    var colorMap = {
      red: "red",
      green: "forestgreen",
      blue: "blue",
      black: "black",
      colorless: "slategrey",
      white: "tan",
    };


    var update = this.svg.datum(data)
      .selectAll("path")
      .data(this.pie);

    update
      .attr("class","piechart")
      .attr("fill", function(d,i){ return colorMap[d.data.color]; })
      .attr("d", arc)
      .enter()
      .append("path")
      .attr("class","piechart")
      .attr("fill", function(d,i){ return colorMap[d.data.color]; })
      .attr("d", arc)

    update
        .enter()
        .append("text")
        .attr("class", "pieText")
        .style("fill", "white")
        .style("font-size", "10px")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) {
          return ((d.data.count/total).toFixed(3) * 100).toFixed(2) + '%'; 
        });

    this.svg.datum(data).selectAll(".pieText")
        .data(this.pie)
        .attr("class", "pieText")
        .style("fill", "white")
        .style("font-size", "10px")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) {
          return ((d.data.count/total).toFixed(3) * 100).toFixed(2) + '%';
        });


    this.svg.datum(data).selectAll("path")
      .data(this.pie)
      .exit()
      .remove();

    this.svg.datum(data).selectAll(".pieText")
      .data(this.pie)
      .exit()
      .remove();
  }
}