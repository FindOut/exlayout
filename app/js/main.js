var d3 = require('d3');
var graphs = require('./Graphs');
var sugiyama = require('./Sugiyama');
// var exlayout = require('exlayout');
var width = 1000, height = 500, scale = 100;
var graph = graphs.getGraph();

var svg = d3.select('#graph').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append("g");

// var layout = exlayout()
//   .nodes(graph.nodes)
//   .links(graph.links);

sugiyama.sugiyama(graph);

console.log(graph);

var nodeEnter = svg.selectAll('g')
  .data(graph.nodes).enter()
  .append('g').attr('id', function(d) {return 'id' + d.id});
  nodeEnter.append('circle')
    .attr('r', function(d) {return d.isDummy ? '0' : '20'})
    .attr('cx', function(d) {return d.x * scale;})
    .attr('cy', function(d) {return height - d.rank * scale;});
  nodeEnter.append('text')
    .text(function(d) {return d.isDummy ? '' : d.label;})
    .attr('x', function(d) {return d.x * scale;})
    .attr('y', function(d) {return height - d.rank * scale;})
var lineEnter = svg.selectAll('line')
    .data(graph.links).enter()
    .append('line')
      .attr('x1', function(d) {return +d3.select('#id' + d.from).select('circle').attr('cx')})
      .attr('y1', function(d) {return +d3.select('#id' + d.from).select('circle').attr('cy')})
      .attr('x2', function(d) {return +d3.select('#id' + d.to).select('circle').attr('cx')})
      .attr('y2', function(d) {return +d3.select('#id' + d.to).select('circle').attr('cy')});


// layout.on('tick', function() {
//
// });

// layout.start();
