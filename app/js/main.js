var d3 = require('d3');
var _ = require('lodash');

var r = 20,
width = 800,
height = 300;

var svg = d3.select('#graph').append('svg')
    .attr('width', width).attr('height', height);

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height]);

function render() {
  d3.json('model.json', function(error, data) {
    var nodeById = _.keyBy(data.nodes, 'id');
    console.log(nodeById);
    console.log(_.map(data.links, function(link) {
        return {source: nodeById[link.from],
                target: nodeById[link.to]}}));
    force
        .nodes(data.nodes)
        .links(_.map(data.links, function(link) {
            return {source: nodeById[link.from],
                    target: nodeById[link.to]}}))
        .start();

    // render links
    var links = svg.selectAll('.link').data(data.links, function(d) {return String(d.from) + '_' + String(d.to)});
    var linksEnter = links.enter().append('line')
        .attr('class', 'link');
    links.exit().remove();

    // render nodes
    var nodes = svg.selectAll('.node').data(data.nodes, function(d) {return d.id});
    var nodesEnter = nodes.enter().append('g')
        .attr('class', 'node')
        .attr('transform', 'translate(50, 50)');
    nodesEnter.append('circle')
        .attr('r', r);
    nodesEnter.append('text')
      .append('tspan');
    nodes.select('text tspan').text(function(d) {return d.label});
    nodes.select('text').each(function(d) {
      var bbox = this.getBBox();
      d3.select(this).attr({x: -bbox.x - bbox.width / 2, y: -bbox.y - bbox.height / 2});
    });
    nodes.exit().remove();

    force.on("tick", function() {
      links.attr("x1", function(d) { return nodeById[d.from].x; })
          .attr("y1", function(d) { return nodeById[d.from].y; })
          .attr("x2", function(d) { return nodeById[d.to].x; })
          .attr("y2", function(d) { return nodeById[d.to].y; });

      nodes.each(function(d) {
        d3.select(this).attr('transform', 'translate(' + d.x + ', ' + d.y + ')');
      });
    });
  });
}

force.on('tick', function(d) {

});

d3.select('#reload').on('click', function() {
  render();
})

render();
