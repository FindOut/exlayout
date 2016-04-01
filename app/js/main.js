var d3 = require('d3'); // Include d3 package (Visualization)
var _ = require('lodash'); // Inlcude lodash package (Utility library)

var r = 20,
width = 800,
height = 300;

// Select graph element and append SVG to it
var svg = d3.select('#graph').append('svg')
    .attr('width', width).attr('height', height);

// Define marker
svg.append('defs').append('marker')
  .attr("id", 'markerArrowEnd') // ID of marker
  .attr("viewBox", "0 -5 10 10") // minX, minY, width and height of viewBox
  .attr("refX", 10) // Position where marker connect to the vertex
  .attr("refY", 0) // Position where marker connect to the vertex
  .attr("markerWidth", 8) // The width of marker
  .attr("markerHeight", 8) // The height of marker
  .attr("orient", "auto") // Rotation of marker
  .append("path") // Used to draw line
    .attr("d", 'M0,-5 L10,0 L0,5') // Draw triangle
    .attr('fill', 'black'); // Fill the triangle

// Set force attribut
var force = d3.layout.force()
    .charge(-125) // Replusion between nodes
    .linkDistance(70) // Distance between linked nodes
    .size([width, height]); // Layout size


function render() {
  d3.json('model.json', function(error, data) { // Apply function to json object
    var nodeById = _.keyBy(data.nodes, 'id'); // Create {key:value} pair
    force
        .nodes(data.nodes) // Set layout's associated nodes to specified array
        .links(_.map(data.links, function(link) { // Apply function to every links
            return {source: nodeById[link.from],
                    target: nodeById[link.to]}}))
        .start(); // Start the simulation

    // render nodes
    var nodes = svg.selectAll('.node').data(data.nodes, function(d) {return d.id}); // Joins the nodes
    var nodesEnter = nodes.enter().append('g') // Apeend g element
        .attr('class', 'node') // Assign class name
        .attr('transform', 'translate(50, 50)'); // Translate nodes
    nodesEnter.append('circle') // Apeend circle
        .attr('r', r); // Set circle radius
    nodesEnter.append('text'); // Apnned text
    nodes.select('text').text(function(d) {return d.label}); // Set text to its label
    nodes.select('text').each(function(d) {
      var bbox = this.getBBox(); // Get bounding box of text
      d3.select(this).attr({x: -bbox.x - bbox.width / 2, y: -bbox.y - bbox.height / 2}); // Calculate its position
    });
    nodes.exit().remove(); // Exit

    // render links
    var links = svg.selectAll('.link').data(data.links, function(d) {return String(d.from) + '_' + String(d.to)}); // Joins the links
    var linksEnter = links.enter().append('line') // Append line element
    .attr('class', 'link') // Assign class name
    .attr('marker-end', 'url(#markerArrowEnd)'); // Arrowhead that will be drawn at the final vertex
    links.exit().remove(); // Exit

    function adjustEnds(fromPoint, toPoint) {
      var dx = toPoint.x - fromPoint.x,
        dy = toPoint.y - fromPoint.y,
        length = Math.sqrt(dx * dx + dy * dy);
      dx = dx / length * r;
      dy = dy / length * r;
      return {from: {x: fromPoint.x + dx, y: fromPoint.y + dy}, to: {x: toPoint.x - dx, y: toPoint.y - dy}};
    }

    force.on("tick", function() {
      nodes.each(function(d) {
        d3.select(this).attr('transform', 'translate(' + d.x + ', ' + d.y + ')');
      });
      links.each(function(d) {
        var adjustedEnds = adjustEnds(nodeById[d.from], nodeById[d.to]);
        d3.select(this)
        .attr("x1", function(d) { return adjustedEnds.from.x; })
        .attr("y1", function(d) { return adjustedEnds.from.y; })
        .attr("x2", function(d) { return adjustedEnds.to.x; })
        .attr("y2", function(d) { return adjustedEnds.to.y; });
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
