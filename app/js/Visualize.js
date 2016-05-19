var d3 = require('d3');
var Sugiyama = require("./Sugiyama.js");
var ConnectedGraphDetect = require("./ConnectedGraphDetection.js");
var Main = require("./main.js");
var helpFunctions = require("./helpFunctions.js");
var BoxGraphController = require("./BoxgraphDetection.js");
var Graph = require("./Graphs.js");

var width; // SVG width
var height; // SVG height
var xScale; // x-scale of graph
var yScale; // y-scale of graph
var r = 20; // Radius of nodes
var dummyR = 0; // Radius of dummyNodes

var graph = Graph.getGraph(); // Get input graph
var boxGraphs = BoxGraphController.getBoxGraph(graph); // Extract all boxes from graph and replace each box to fake node
var graphArray = Main.main(graph); // Sugiyama method for all graphs
boxGraphs = boxSugiyama(boxGraphs); // Sugiyama method for all boxes
calculateScreenSizeAndScale() // Set screen size and calculate scale based on widest and highest graph
calculateInitialScreenPosition(); // Calculate initial position of each nodes on screen based on scale

// Behavior to help navigate
var drag = d3.behavior.drag()
            .on("drag", dragmove)
            .on("dragstart", dragstart)
            .on("dragend", dragend);
var dragGraph = d3.behavior.drag()
                  .on("drag", graphMove)
                  .on("dragstart", dragstart)
                  .on("dragend", graphMoveEnd);
var zoom = d3.behavior.zoom()
            .on("zoom", zoomed);

// SVG element
var svg = d3.select('#graph').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append("g")
    .call(zoom);
var rect = svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all");
var container = svg
                  .append("g");

// Arrow image
container.append('defs').append('marker')
  .attr("id", 'markerArrowEnd')
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 10)
  .attr("refY", 0)
  .attr("markerWidth", 8)
  .attr("markerHeight", 8)
  .attr("orient", "auto")
  .append("path")
    .attr("d", 'M0,-5 L10,0 L0,5')
    .attr('fill', 'black');

drawGraph(); // Draw all graphs on screen
drawBox(); // Draw all boxes on screen
moveBoxToCorrectPosition(); // Replace now fake node with corresponding box
modifyLinks(); // Update visualization of links
var graphArrayCoordinate = {"graphs": [], "links": []}; // Array of center of each graph
graphAsNode(); // Calculate center and radius of each graph, used in force algorithm

// Setting up force
var force = d3.layout.force()
              .size([width, height])
              .friction(0.5) // Slow down the animation
              .on("tick", tick);

// See every graph as big node and start force to position every graph nicely
force
  .nodes(graphArrayCoordinate.graphs)
  .start();

// Using getBBox() to calculate center and radius of each graph. Also sets up
// movingButton for moving the graph
function graphAsNode()
{
  // Calculate center and radius of each graph
  d3.selectAll(".graph").each(function(d){
    var bbox = this.getBBox();
    var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
    graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                      "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": d.groupnumber});

  // Add moveButton
  container.append("circle")
      .attr("id", "moveButton")
      .attr("cx", bbox.x+r/2)
      .attr("cy", bbox.y+r/2)
      .attr("r", r/2)
      .style("fill", "green")
      .attr("graph", d.groupnumber)
      .call(dragGraph);
  });
}

// Update the visualization of links after replacing fake node with boxes
function modifyLinks()
{
  d3.selectAll(".graph").each(function(d,i){
    d3.select(this).selectAll("line").each(function(){
      if(d3.select(this).attr("box") === null) // Skip all links in boxes
      {
        // Get start- and endpoint of link
        var fromId = d3.select(this).attr("from");
        var toId = d3.select(this).attr("to");
        if(fromId.indexOf("box") > -1) // Check if link starts from some box
        {
          // Modify up fromId
          fromId = fromId.slice(3);
          fromId = d3.select(".boxGraph[box='"+fromId+"']").attr("id");
          fromId = fromId.slice(4);
        }
        if(toId.indexOf("box") > -1) // Check if link points to some box
        {
          // Modify up toId
          toId = toId.slice(3);
          toId = d3.select(".boxGraph[box='"+toId+"']").attr("id");
          toId = toId.slice(4);
        }
        if(d3.select(this.parentNode).selectAll(".boxGraph#node"+fromId).empty()) // If link do not starts from some box
        {
          // Set up x- and y-coordinate
          var fromNode = d3.select(this.parentNode).select("circle[id='name"+fromId+"']");
          var fromPoint = {"x": parseFloat(fromNode.attr("cx")),"y": parseFloat(fromNode.attr("cy"))};
          // Set up radius based on if it is dummy or not
          if(fromNode.attr("isDummy") === "false"){
            var fromRadius = parseFloat(fromNode.attr("r"));
          }else{
            var fromRadius = 0;
          }
        }else{ // Link starts from some box
          // Set up x- and y-coordinate
          var fromNode = d3.select(this.parentNode).selectAll(".boxGraph#node"+fromId).select("circle[id=boxcircle]");
          var fromPoint = {"x": parseFloat(fromNode.attr("cx")),"y": parseFloat(fromNode.attr("cy"))};
          // Set up radius
          var fromRadius = parseFloat(fromNode.attr("r"));
        }
        if(d3.select(this.parentNode).selectAll(".boxGraph#node"+toId).empty()) // If link do not points to some box
        {
          // Set up x- and y-coordinate
          var toNode = d3.select(this.parentNode).select("circle[id='name"+toId+"']");
          var toPoint = {"x": parseFloat(toNode.attr("cx")),"y": parseFloat(toNode.attr("cy"))};
          // Set up radius based on if it is dummy or not
          if(toNode.attr("isDummy") === "false"){
            var toRadius = parseFloat(toNode.attr("r"));
          }else{
            var toRadius = 0;
          }
        }else{ // Link points to some box
          // Set up x- and y-coordinate
          var toNode = d3.select(this.parentNode).selectAll(".boxGraph#node"+toId).select("circle[id=boxcircle]");
          var toPoint = {"x": parseFloat(toNode.attr("cx")),"y": parseFloat(toNode.attr("cy"))};
          // Set up radius
          var toRadius = parseFloat(toNode.attr("r"));
        }
        var adjustedEnds = adjustEnds(fromPoint, fromRadius, toPoint, toRadius); // Adjust ends of link based on position and radius of the two nodes
        // Correct the link
        d3.select(this)
            .attr("x1", adjustedEnds.from.x)
            .attr("y1", adjustedEnds.from.y)
            .attr("x2", adjustedEnds.to.x)
            .attr("y2", adjustedEnds.to.y);
      }
    });
  });
}

// Replace fake node to corresponding box
function moveBoxToCorrectPosition()
{
  d3.selectAll(".boxGraph").each(function(d){
    var bbox = this.getBBox();
    var Radius = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2; // Radius of box

    var cx = bbox.x + bbox.width/2;
    var cy = bbox.y + bbox.height/2;
    d3.select(this).append('circle') // Draw circle around box
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("id","boxcircle")
      .attr("r", Radius)
      .style("fill", "none");

    var graphNumber = d3.select(this).attr("graph");
    var boxNumber = d3.select(this).attr("box");
    var minId = d3.select(this).attr("id");
    var toCx = parseFloat(d3.select("g[graph='" + graphNumber + "']").select("circle#name"+minId.slice(4)).attr("cx")); // x-coordinate of fake node
    var toCy = parseFloat(d3.select("g[graph='" + graphNumber + "']").select("circle#name"+minId.slice(4)).attr("cy")); // y-coordinate of fake node
    d3.select("g[graph='" + graphNumber + "']").select("g#name"+minId.slice(4)).remove(); // Remove fake node from screen
    d3.select(this).select("circle[id=boxcircle]") // Move bounding circle to correct position
      .attr("cx", toCx)
      .attr("cy", toCy);

    var dx = toCx - cx; // Differece in x-coordinate
    var dy = toCy - cy; // Differece in y-coordinate

    // All nodes in box move towards the same direction as bounding circle
    d3.select(this).selectAll(".node").each(function(){
        var oldx = parseFloat(d3.select(this).select("circle").attr("cx"));
        var oldy = parseFloat(d3.select(this).select("circle").attr("cy"));
        d3.select(this).select("circle")
            .attr("cx", oldx + dx)
            .attr("cy", oldy + dy);
        d3.select(this).select("text")
            .attr({x: oldx + dx-r/4, y: oldy + dy+r/4});
    });

    // All lines in box move towards the same direction as bounding circle
    d3.select(this).selectAll("line").each(function(){
      var oldx1 = parseFloat(d3.select(this).attr("x1"));
      var oldy1 = parseFloat(d3.select(this).attr("y1"));
      var oldx2 = parseFloat(d3.select(this).attr("x2"));
      var oldy2 = parseFloat(d3.select(this).attr("y2"));
      d3.select(this)
          .attr("x1", oldx1 + dx)
          .attr("y1", oldy1 + dy)
          .attr("x2", oldx2 + dx)
          .attr("y2", oldy2 + dy);
    });

    // Move all other nodes in the same graph away from box
    d3.select("g[graph= '"+ graphNumber + "']").selectAll(".node").each(function(d){
      if(d3.select(this).select("circle").attr("box") === null) // Skip all node in box
      {
        var oldcx = parseFloat(d3.select(this).select("circle").attr("cx"));
        var oldcy = parseFloat(d3.select(this).select("circle").attr("cy"));
        var dx = oldcx - toCx;
        var dy = oldcy - toCy;
        var length = Math.sqrt(dx * dx + dy * dy);
        var newcx = dx / length * Radius + oldcx;
        var newcy = dy / length * Radius + oldcy;
        d3.select(this).select("circle")
               .attr("cx", newcx)
               .attr("cy", newcy);
           d3.select(this).select("text")
               .attr({x: newcx - r/4, y: newcy + r/4});
      }
    });

    // Move all other boxes in the same away from box
    d3.select("g[graph= '"+ graphNumber + "']").selectAll(".boxGraph").each(function(){
      var oldcx = parseFloat(d3.select(this).select("circle[id=boxcircle]").attr("cx"));
      var oldcy = parseFloat(d3.select(this).select("circle[id=boxcircle]").attr("cy"));
      var dx = oldcx - toCx;
      var dy = oldcy - toCy;
      var length = Math.sqrt(dx * dx + dy * dy);
      dx = dx / length * Radius;
      dy = dy / length * Radius;
      // Move all nodes in same direction
      d3.select(this).selectAll(".node").each(function(d){
        var cx = parseFloat(d3.select(this).select("circle").attr("cx"));
        var cy = parseFloat(d3.select(this).select("circle").attr("cy"));
        d3.select(this).select("circle")
            .attr("cx", cx+dx)
            .attr("cy", cy+dy);
        d3.select(this).select("text")
            .attr({x: cx+dx - r/4, y: cy+dy + r/4})
      });

      // Move all links in same direction
      d3.select(this).selectAll("line").each(function(){
        var x1 = parseFloat(d3.select(this).attr("x1"));
        var y1 = parseFloat(d3.select(this).attr("y1"));
        var x2 = parseFloat(d3.select(this).attr("x2"));
        var y2 = parseFloat(d3.select(this).attr("y2"));
        d3.select(this)
            .attr("x1", x1+dx)
            .attr("y1", y1+dy)
            .attr("x2", x2+dx)
            .attr("y2", y2+dy);

      });

      // Move the bounding circle in same direction
      d3.select(this).select("circle[id=boxcircle]")
          .attr("cx", oldcx+dx)
          .attr("cy", oldcy+dy);
    });

    // Update the link attribute if it starts from or points to the fake node
    d3.select("g[graph='" + graphNumber + "']").selectAll("line").each(function(){
      if(d3.select(this).attr("box") === null)
      {
        if(("node"+d3.select(this).attr("from")) === minId)
        {
          d3.select(this)
              .attr("from", "box"+boxNumber);
        }
        if(("node"+d3.select(this).attr("to")) === minId)
        {
          d3.select(this)
              .attr("to", "box"+boxNumber);
        }
      }
    });


    // Move box DOM element under the corresponding graph
    var box = d3.select(this)
                    .remove();
    box.each(function(){
        d3.select("g[graph='" + graphNumber + "']")
          .node()
          .appendChild(this);
    });
  });
}

// Calculate initial position of each node on screen based on scale
function calculateInitialScreenPosition()
{
  var len1 = graphArray.length;
  var len2;
  // Calculate coordinate for each graph
  for(var i = 0; i < len1; i++)
  {
    len2 = graphArray[i].nodes.length;
    for(var j = 0; j < len2; j++)
    {
      graphArray[i].nodes[j].x = xScale(graphArray[i].nodes[j].x);
      graphArray[i].nodes[j].y = yScale(graphArray[i].nodes[j].rank);
    }
  }

  len1 = boxGraphs.length;
  // Calculate coordinate for each box
  for(i = 0; i < len1; i++)
  {
    len2 = boxGraphs[i].nodes.length;
    for(j = 0; j < len2; j++)
    {
      boxGraphs[i].nodes[j].x = xScale(boxGraphs[i].nodes[j].x);
      boxGraphs[i].nodes[j].y = yScale(boxGraphs[i].nodes[j].rank);
    }
  }
}

// Draw all boxes on screen
function drawBox()
{
  var box = container.selectAll(".box")
    .data(boxGraphs);

  var boxEnter = box.enter().append('g')
                      .attr("class", "boxGraph");

  boxEnter.each(function(d,i){
    var boxNumber = boxGraphs[i].box;
    var graphNumber = boxGraphs[i].graph;
    var minId = boxGraphs[i].minId;
    d3.select(this)
      .attr("box", boxNumber)
      .attr("graph", graphNumber)
      .attr("id", "node"+minId);

    var nodes = d3.select(this).selectAll('circle')
                    .data(boxGraphs[i].nodes);

    var nodesEnter = nodes.enter().append('g')
                        .attr('class', 'node');

    nodesEnter.each(function(d){
      if(!d.isDummy) // If it is dummyNode
      {
          d3.select(this)
            .append('circle')
              .attr("cx", d.x)
              .attr("cy", d.y)
              .attr("r", r)
              .attr("id", "boxname"+d.id)
              .attr("box", boxNumber)
              .attr("isDummy", "false")
              .style("fill", "white");

          d3.select(this)
            .append('text')
              .text(d.label)
              .attr({x: d.x-r/4, y: d.y+r/4});

          d3.select(this)
              .attr("graph",graphNumber)
              .attr("id", "boxname"+d.id)
              .call(drag);
      }else {
          d3.select(this)
            .append('circle')
              .attr("cx", d.x)
              .attr("cy", d.y)
              .attr("r", dummyR)
              .attr("id", "boxname"+d.id)
              .attr("box", boxNumber)
              .attr("isDummy", "true")
              .style("fill", "white");

          d3.select(this)
            .attr("graph", graphNumber)
            .attr("id", "boxname"+d.id);
      }
    });

    nodes.exit().remove();

    var links = d3.select(this).selectAll('line')
                    .data(boxGraphs[i].links);

    var linksEnter = links.enter().append('line')
                            .attr('class', 'link');

    linksEnter.each(function (d){
      var fromNode = helpFunctions.getNodeById(d.from, boxGraphs[i].nodes);
      var toNode = helpFunctions.getNodeById(d.to, boxGraphs[i].nodes);
      var adjustedEnds = adjustEnds(fromNode, r, toNode, r); // Adjust ends of links based on coordinate and radius of the two nodes
      if(!fromNode.isDummy && !toNode.isDummy) // If both are not dummyNode
      {
        d3.select(this)
            .attr("x1", function(d) { return adjustedEnds.from.x; })
            .attr("y1", function(d) { return adjustedEnds.from.y; })
            .attr("x2", function(d) { return adjustedEnds.to.x; })
            .attr("y2", function(d) { return adjustedEnds.to.y; })
            .attr("from", d.from)
            .attr("to", d.to)
            .attr("box", boxNumber)
            .attr("graph", graphNumber)
            .attr("marker-end", "url(#markerArrowEnd)");
      }else if(fromNode.isDummy && !toNode.isDummy){ // If fromNode is dummyNode
        d3.select(this)
            .attr("x1", function(d) { return fromNode.x; })
            .attr("y1", function(d) { return fromNode.y; })
            .attr("x2", function(d) { return adjustedEnds.to.x; })
            .attr("y2", function(d) { return adjustedEnds.to.y; })
            .attr("from", d.from)
            .attr("to", d.to)
            .attr("box", boxNumber)
            .attr("graph", graphNumber)
            .attr("marker-end", "url(#markerArrowEnd)");
      }else if(!fromNode.isDummy && toNode.isDummy){ // If toNode is dummyNode
        d3.select(this)
            .attr("x1", function(d) { return adjustedEnds.from.x; })
            .attr("y1", function(d) { return adjustedEnds.from.y; })
            .attr("x2", function(d) { return toNode.x; })
            .attr("y2", function(d) { return toNode.y; })
            .attr("from", d.from)
            .attr("to", d.to)
            .attr("box", boxNumber)
            .attr("graph", graphNumber);
      }else{ // If both nodes are dummyNode
        d3.select(this)
            .attr("x1", function(d) { return fromNode.x; })
            .attr("y1", function(d) { return fromNode.y; })
            .attr("x2", function(d) { return toNode.x; })
            .attr("y2", function(d) { return toNode.y; })
            .attr("from", d.from)
            .attr("to", d.to)
            .attr("box", boxNumber)
            .attr("graph", graphNumber);
      }
    });
    links.exit().remove();
  });
}

// Draw all graphs on screen
function drawGraph()
{
  var graph = container.selectAll(".graph")
    .data(graphArray);

  var graphEnter = graph.enter().append('g')
    .attr('class', 'graph');

  graphEnter.each(function(d,i){
    var graphNumber = graphArray[i].groupnumber;
    d3.select(this)
      .attr("graph", graphNumber);

    var nodes = d3.select(this).selectAll('circle')
                  .data(graphArray[i].nodes);

    var nodesEnter = nodes.enter().append('g')
                      .attr('class', 'node');

    nodesEnter.each(function(d){
      if(!d.isDummy) // If it is dummyNode
      {
        d3.select(this)
          .append('circle')
            .attr("cx", d.x)
            .attr("cy", d.y)
            .attr("r", r)
            .attr("id", "name"+d.id)
            .attr("isDummy", "false")
            .style("fill", "white")

        d3.select(this)
          .append('text')
            .text(d.label)
            .attr({x: d.x-r/4, y: d.y+r/4});

        d3.select(this)
            .attr("graph",graphNumber)
            .attr("id", "name"+d.id)
            .call(drag);
      }
      else {
        d3.select(this)
          .append('circle')
            .attr("cx", d.x)
            .attr("cy", d.y)
            .attr("r", dummyR)
            .attr("id", "name"+d.id)
            .attr("graph",graphNumber)
            .attr("isDummy", "true")
            .style("fill", "white")

        d3.select(this)
          .attr("graph", graphNumber)
          .attr("id", "name"+d.id);
      }
    });

    nodes.exit().remove();

    var links = d3.select(this).selectAll('line')
      .data(graphArray[i].links);

    var linksEnter = links.enter().append('line')
      .attr('class', 'link');

    linksEnter.each(function (d){
      var fromNode = helpFunctions.getNodeById(d.from, graphArray[i].nodes);
      var toNode = helpFunctions.getNodeById(d.to, graphArray[i].nodes);
      var adjustedEnds = adjustEnds(fromNode, r, toNode, r); // Adjust ends of links based on coordinate and raidus of the two nodes
      if(!fromNode.isDummy && !toNode.isDummy) // If both are not dummyNode
      {
        d3.select(this)
          .attr("x1", function(d) { return adjustedEnds.from.x; })
          .attr("y1", function(d) { return adjustedEnds.from.y; })
          .attr("x2", function(d) { return adjustedEnds.to.x; })
          .attr("y2", function(d) { return adjustedEnds.to.y; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber)
          .attr("marker-end", "url(#markerArrowEnd)");
      }else if(fromNode.isDummy && !toNode.isDummy){ // If fromNode is dummyNode
        d3.select(this)
          .attr("x1", function(d) { return fromNode.x; })
          .attr("y1", function(d) { return fromNode.y; })
          .attr("x2", function(d) { return adjustedEnds.to.x; })
          .attr("y2", function(d) { return adjustedEnds.to.y; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber)
          .attr("marker-end", "url(#markerArrowEnd)");
      }else if(!fromNode.isDummy && toNode.isDummy){ // If toNode is dummyNode
        d3.select(this)
          .attr("x1", function(d) { return adjustedEnds.from.x; })
          .attr("y1", function(d) { return adjustedEnds.from.y; })
          .attr("x2", function(d) { return toNode.x; })
          .attr("y2", function(d) { return toNode.y; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber);
      }else{ // If both are dummyNode
        d3.select(this)
          .attr("x1", function(d) { return fromNode.x; })
          .attr("y1", function(d) { return fromNode.y; })
          .attr("x2", function(d) { return toNode.x; })
          .attr("y2", function(d) { return toNode.y; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber);
      }
    });
    links.exit().remove();
  });
}

// Calculate svg size based on screen size and set up scale for x- and y-coordiante
function calculateScreenSizeAndScale()
{
  var len1 = graphArray.length;
  var len2;
  var maxX;
  var minX;
  var maxY;
  var minY;
  var globalMaxX = Number.MIN_VALUE;
  var globalMinX = Number.MAX_VALUE;
  var globalMaxY = Number.MIN_VALUE;
  var globalMinY = Number.MAX_VALUE;
  var currentGraph;
  // Find rightmost, leftmost, upmost, downmost coordinate
  for(var i = 0; i < len1; i++)
  {
    maxX = Number.MIN_VALUE;
    minX = Number.MAX_VALUE;
    maxY= Number.MIN_VALUE;
    minY = Number.MAX_VALUE;
    currentGraph = graphArray[i];
    len2 = currentGraph.nodes.length;
    for(var j = 0; j < len2; j++)
    {
      if(currentGraph.nodes[j].x > maxX)
      {
        maxX = currentGraph.nodes[j].x;
      }else if(currentGraph.nodes[j].x < minX){
        minX = currentGraph.nodes[j].x;
      }
      if(currentGraph.nodes[j].rank > maxY)
      {
        maxY = currentGraph.nodes[j].rank;
      }else if(currentGraph.nodes[j].rank < minY){
        minY = currentGraph.nodes[j].rank;
      }
    }
    if(maxX > globalMaxX)
    {
      globalMaxX = maxX;
    }
    if(minX < globalMinX)
    {
      globalMinX = minX;
    }
    if(maxY > globalMaxY)
    {
      globalMaxY = maxY;
    }
    if(minY < globalMinY)
    {
      globalMinY = minY;
    }
    currentGraph.maxX = maxX;
    currentGraph.minX = minX;
    currentGraph.maxY = maxY;
    currentGraph.minY = minY;
  }

  // Get screen size
  width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
  height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

  // Set up scale
  yScale = d3.scale.linear()
                      .domain([globalMaxY, globalMinY])
                      .range([r, (globalMaxY-globalMinY)*6*r-r]);
  xScale = d3.scale.linear()
                      .domain([globalMinX, globalMaxX])
                      .range([r, (globalMaxX-globalMinX)*5*r-r]);
}

// Used sugiyama method to position nodes in each box
function boxSugiyama(boxGraphs)
{
  var len1 = boxGraphs.length;
  var len2;
  var id;
  for(var i = 0; i < len1; i++)
  {
    var subGraph = {"nodes": boxGraphs[i].nodes, "links": boxGraphs[i].links}; // Nodes and links of box
    Sugiyama.sugiyama(subGraph); // Sugiyama method
    boxGraphs[i].nodes = subGraph.nodes; // Update box nodes
    boxGraphs[i].links = subGraph.links; // Update box links
    // Find id of box (Id of box is the least node id in that box)
    id = Number.MAX_VALUE;
    len2 = boxGraphs[i].nodes.length;
    for(var j = 0; j < len2; j++)
    {
      if(boxGraphs[i].nodes[j].id < id)
      {
        id = boxGraphs[i].nodes[j].id;
      }
    }
    boxGraphs[i].graph = helpFunctions.getNodeById(id, graph.nodes).group; // Check which graph box belongs to
  }
  return boxGraphs;
}

// Adjust ends on link based on coordinate and raidus of the two nodes
function adjustEnds(fromPoint, fromRadius, toPoint, toRadius)
{
  var dx = toPoint.x-fromPoint.x; // Difference in x-coordinate
  var dy = toPoint.y-fromPoint.y; // Difference in y-coordinate

  var length = Math.sqrt(dx * dx + dy * dy); // Distance between the nodes
  // Adjust ends using equilateral triangle
  var fromPointdx = dx / length * fromRadius;
  var fromPointdy = dy / length * fromRadius;
  var toPointdx = dx / length * toRadius;
  var toPointdy = dy / length * toRadius;
  return {from: {x: fromPoint.x + fromPointdx, y: fromPoint.y + fromPointdy}, to: {x: toPoint.x - toPointdx, y: toPoint.y - toPointdy}};
}

// Update position of each graph
function tick()
{
  // Checks if two graph are colliding with each other
  var q = d3.geom.quadtree(graphArrayCoordinate.graphs);
  var i = 0;
  var n = graphArrayCoordinate.graphs.length;
  while(i < n)
  {
    q.visit(collide(graphArrayCoordinate.graphs[i]));
    i++;
  }

  // Move nodes, links and boxgraph in each graph based on force algorithm on each graph
  d3.selectAll(".graph").each(function(d,i){
    // graphArrayCoordinate.graphs[i].px and graphArrayCoordinate.graphs[i].py do not work!!!
    var dx = graphArrayCoordinate.graphs[i].x - graphArrayCoordinate.graphs[i].old_x; // Movement in x direction
    var dy = graphArrayCoordinate.graphs[i].y - graphArrayCoordinate.graphs[i].old_y; // Movement in y direction
    graphArrayCoordinate.graphs[i].old_x = graphArrayCoordinate.graphs[i].x; // Store current x-coordinate
    graphArrayCoordinate.graphs[i].old_y = graphArrayCoordinate.graphs[i].y; // Store current y-coordinate
    // Move all nodes towards (dx, dy)
    d3.select(this).selectAll(".node").each(function(d){
      if(d3.select(this).select("circle").attr("box") === null) // Skip all nodes in box
      {
        var cx = parseFloat(d3.select(this).select("circle").attr("cx"))+dx;
        var cy = parseFloat(d3.select(this).select("circle").attr("cy"))+dy;
        d3.select(this).select("circle")
          .attr("cx", cx)
          .attr("cy", cy);
        d3.select(this).select("text")
          .attr({x: cx-r/4, y: cy+r/4});
      }
    });

    // Move all links towards (dx, dy)
    d3.select(this).selectAll("line").each(function(d){
      if(d3.select(this).attr("box") === null) // Skip all links in box
      {
        var x1 = parseFloat(d3.select(this).attr("x1")) + dx;
        var y1 = parseFloat(d3.select(this).attr("y1")) + dy;
        var x2 = parseFloat(d3.select(this).attr("x2")) + dx;
        var y2 = parseFloat(d3.select(this).attr("y2")) + dy;
        d3.select(this)
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2);
      }
    });

    // Move the moveBUtton towards (dx, dy)
    d3.select("#moveButton[graph='"+graphArrayCoordinate.graphs[i].graph+"']").each(function(d){
      var cx = parseFloat(d3.select(this).attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).attr("cy"))+dy;
      d3.select(this)
        .attr("cx",cx)
        .attr("cy",cy);
    });

    // Move the boxGraph towards (dx, dy)
    d3.select(this).selectAll(".boxGraph").each(function(){
      // Move all nodes
      d3.select(this).selectAll("g").each(function(){
        var cx = parseFloat(d3.select(this).select("circle").attr("cx"))+dx;
        var cy = parseFloat(d3.select(this).select("circle").attr("cy"))+dy;
        d3.select(this).select("circle")
            .attr("cx", cx)
            .attr("cy", cy);

        d3.select(this).select("text")
            .attr({x: cx-r/4, y: cy+r/4});
      });

      // Move all links
      d3.select(this).selectAll("line").each(function(){
        var x1 = parseFloat(d3.select(this).attr("x1")) + dx;
        var y1 = parseFloat(d3.select(this).attr("y1")) + dy;
        var x2 = parseFloat(d3.select(this).attr("x2")) + dx;
        var y2 = parseFloat(d3.select(this).attr("y2")) + dy;
        d3.select(this)
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2);
      });

      // Move the bounding circle
      d3.select(this).select("#boxcircle").each(function(){
        var cx = parseFloat(d3.select(this).attr("cx"))+dx;
        var cy = parseFloat(d3.select(this).attr("cy"))+dy;
        d3.select(this)
            .attr("cx", cx)
            .attr("cy", cy);
      });
    });
  });
}

// Detect collision between graphs
// Original code from https://bl.ocks.org/mbostock/3231298
function collide(graph)
{
  var r = graph.halfDigonal + 16;
  var nx1 = graph.x - r;
  var nx2 = graph.x + r;
  var ny1 = graph.y - r;
  var ny2 = graph.y + r;
  return function(quad,x1,y1,x2,y2){
    if(quad.point && (quad.point !== graph))
    {
      var x = graph.x - quad.point.x;
      var y = graph.y - quad.point.y;
      var l = Math.sqrt(x*x + y*y);
      var r = graph.halfDigonal + quad.point.halfDigonal;
      if(l<r)
      {
        l = (l-r)/l*0.5;
        graph.x -= x *= l;
        graph.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

// Update node and links when dragging node (Does not support node in box)
function dragmove(d) {
  var x = d3.event.x; // x-coordinate of mouse
  var y = d3.event.y; // y-coordinate of mouse
  // Update node coordinate
  d3.select(this).select("circle")
    .attr("cx", x)
    .attr("cy", y);
  d3.select(this).select("text")
    .attr({x: x-r/4, y: y+r/4});


  var graphNumber = d3.select(this).attr("graph");

  // Update all related links
  d3.selectAll("line[graph='"+graphNumber+"'][to='"+d.id+"']").each(function(d,i)
  {
    var fromId = d3.select(this).attr("from");
    var toId = d3.select(this).attr("to");
    if(fromId.indexOf("box") > -1)
    {
      fromId = fromId.slice(3);
      fromId = d3.select(".boxGraph[box='"+fromId+"']").attr("id");
      fromId = fromId.slice(4);
    }
    if(toId.indexOf("box") > -1)
    {
      toId = toId.slice(3);
      toId = d3.select(".boxGraph[box='"+toId+"']").attr("id");
      toId = toId.slice(4);
    }
    if(d3.select(this.parentNode).selectAll(".boxGraph#node"+fromId).empty())
    {
      var fromNode = d3.select(this.parentNode).select("circle[id='name"+fromId+"']");
      var fromPoint = {"x": parseFloat(fromNode.attr("cx")),"y": parseFloat(fromNode.attr("cy"))};
      if(fromNode.attr("isDummy") === "false"){
        var fromRadius = parseFloat(fromNode.attr("r"));
      }else{
        var fromRadius = 0;
      }
    }else{
      var fromNode = d3.select(this.parentNode).selectAll(".boxGraph#node"+fromId).select("circle[id=boxcircle]");
      var fromPoint = {"x": parseFloat(fromNode.attr("cx")),"y": parseFloat(fromNode.attr("cy"))};
      var fromRadius = parseFloat(fromNode.attr("r"));
    }
    if(d3.select(this.parentNode).selectAll(".boxGraph#node"+toId).empty())
    {
      var toNode = d3.select(this.parentNode).select("circle[id='name"+toId+"']");
      var toPoint = {"x": parseFloat(toNode.attr("cx")),"y": parseFloat(toNode.attr("cy"))};
      if(toNode.attr("isDummy") === "false"){
        var toRadius = parseFloat(toNode.attr("r"));
      }else{
        var toRadius = 0;
      }
    }else{
      var toNode = d3.select(this.parentNode).selectAll(".boxGraph#node"+toId).select("circle[id=boxcircle]");
      var toPoint = {"x": parseFloat(toNode.attr("cx")),"y": parseFloat(toNode.attr("cy"))};
      var toRadius = parseFloat(toNode.attr("r"));
    }
    var adjustedEnds = adjustEnds(fromPoint, fromRadius, toPoint, toRadius);
    d3.select(this)
        .attr("x1", adjustedEnds.from.x)
        .attr("y1", adjustedEnds.from.y)
        .attr("x2", adjustedEnds.to.x)
        .attr("y2", adjustedEnds.to.y);
  });

  // Update all related links
  d3.selectAll("line[graph='"+graphNumber+"'][from='"+d.id+"']").each(function(d,i)
  {
    var fromId = d3.select(this).attr("from");
    var toId = d3.select(this).attr("to");
    if(fromId.indexOf("box") > -1)
    {
      fromId = fromId.slice(3);
      fromId = d3.select(".boxGraph[box='"+fromId+"']").attr("id");
      fromId = fromId.slice(4);
    }
    if(toId.indexOf("box") > -1)
    {
      toId = toId.slice(3);
      toId = d3.select(".boxGraph[box='"+toId+"']").attr("id");
      toId = toId.slice(4);
    }
    if(d3.select(this.parentNode).selectAll(".boxGraph#node"+fromId).empty())
    {
      var fromNode = d3.select(this.parentNode).select("circle[id='name"+fromId+"']");
      var fromPoint = {"x": parseFloat(fromNode.attr("cx")),"y": parseFloat(fromNode.attr("cy"))};
      if(fromNode.attr("isDummy") === "false"){
        var fromRadius = parseFloat(fromNode.attr("r"));
      }else{
        var fromRadius = 0;
      }
    }else{
      var fromNode = d3.select(this.parentNode).selectAll(".boxGraph#node"+fromId).select("circle[id=boxcircle]");
      var fromPoint = {"x": parseFloat(fromNode.attr("cx")),"y": parseFloat(fromNode.attr("cy"))};
      var fromRadius = parseFloat(fromNode.attr("r"));
    }
    if(d3.select(this.parentNode).selectAll(".boxGraph#node"+toId).empty())
    {
      var toNode = d3.select(this.parentNode).select("circle[id='name"+toId+"']");
      var toPoint = {"x": parseFloat(toNode.attr("cx")),"y": parseFloat(toNode.attr("cy"))};
      if(toNode.attr("isDummy") === "false"){
        var toRadius = parseFloat(toNode.attr("r"));
      }else{
        var toRadius = 0;
      }
    }else{
      var toNode = d3.select(this.parentNode).selectAll(".boxGraph#node"+toId).select("circle[id=boxcircle]");
      var toPoint = {"x": parseFloat(toNode.attr("cx")),"y": parseFloat(toNode.attr("cy"))};
      var toRadius = parseFloat(toNode.attr("r"));
    }
    var adjustedEnds = adjustEnds(fromPoint, fromRadius, toPoint, toRadius);
    d3.select(this)
        .attr("x1", adjustedEnds.from.x)
        .attr("y1", adjustedEnds.from.y)
        .attr("x2", adjustedEnds.to.x)
        .attr("y2", adjustedEnds.to.y);
  });
}

// Stop force algorithm when drag starts
function dragstart()
{
  d3.event.sourceEvent.stopPropagation();
  force.stop();
}

// Update radius and center of each graph, also position moveButton to right place
function dragend(d)
{
  d3.selectAll(".graph").each(function(d,i){
    var bbox = this.getBBox();
    var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
    graphArrayCoordinate.graphs[i].x = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].y = bbox.y+bbox.height/2;
    graphArrayCoordinate.graphs[i].old_x = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].old_y = bbox.y+bbox.height/2;
    graphArrayCoordinate.graphs[i].halfDigonal = halfDigonal;
    d3.select("#moveButton[graph='"+graphArrayCoordinate.graphs[i].graph+"']")
      .attr("cx",bbox.x+r/4)
      .attr("cy",bbox.y+r/4);
  });
}

// Update all nodes, links and boxgraph when moving moveButton
function graphMove()
{
  var dx = d3.event.x - parseFloat(d3.select(this).attr("cx")); // Movement in x direction
  var dy = d3.event.y - parseFloat(d3.select(this).attr("cy")); // Movement in y direction
  // Move the moveButton
  d3.select(this)
    .attr("cx", d3.event.x)
    .attr("cy", d3.event.y);

  var graphNumber = parseInt(d3.select(this).attr("graph"));

  // Move all nodes towards (dx,dy)
  d3.select(".graph[graph='"+graphNumber+"']").selectAll("g").each(function(d){
    if(d3.select(this).select("circle").attr("box") === null) // Skip all nodes in box
    {
      var cx = parseFloat(d3.select(this).select("circle").attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).select("circle").attr("cy"))+dy;
      d3.select(this).select("circle")
          .attr("cx", cx)
          .attr("cy", cy);

      d3.select(this).select("text")
          .attr({x: cx-r/4, y: cy+r/4});
    }
  });

  // Move all links towards (dx,dy)
  d3.select(".graph[graph='"+graphNumber+"']").selectAll("line").each(function(d){
    if(d3.select(this).attr("box") === null) // Skip all links in box
    {
      var x1 = parseFloat(d3.select(this).attr("x1")) + dx;
      var y1 = parseFloat(d3.select(this).attr("y1")) + dy;
      var x2 = parseFloat(d3.select(this).attr("x2")) + dx;
      var y2 = parseFloat(d3.select(this).attr("y2")) + dy;
      d3.select(this)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    }
  });

  // Move all boxgraph towards (dx,dy)
  d3.select(".graph[graph='"+graphNumber+"']").selectAll(".boxGraph").each(function(){
    // Move all nodes
    d3.select(this).selectAll("g").each(function(){
      var cx = parseFloat(d3.select(this).select("circle").attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).select("circle").attr("cy"))+dy;
      d3.select(this).select("circle")
          .attr("cx", cx)
          .attr("cy", cy);

      d3.select(this).select("text")
          .attr({x: cx-r/4, y: cy+r/4});
    });

    // Move all links
    d3.select(this).selectAll("line").each(function(){
      var x1 = parseFloat(d3.select(this).attr("x1")) + dx;
      var y1 = parseFloat(d3.select(this).attr("y1")) + dy;
      var x2 = parseFloat(d3.select(this).attr("x2")) + dx;
      var y2 = parseFloat(d3.select(this).attr("y2")) + dy;
      d3.select(this)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    });

    // Move the bounding circle
    d3.select(this).select("#boxcircle").each(function(){
      var cx = parseFloat(d3.select(this).attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).attr("cy"))+dy;
      d3.select(this)
          .attr("cx", cx)
          .attr("cy", cy);
    });
  });
}

// Update coordinate of each graph and fix the moved graph
function graphMoveEnd()
{
  var graphNumber = parseInt(d3.select(this).attr("graph"));
  d3.selectAll(".graph").each(function(d,i){
    var bbox = this.getBBox();
    graphArrayCoordinate.graphs[i].x = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].y = bbox.y+bbox.height/2;
    graphArrayCoordinate.graphs[i].px = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].py = bbox.y+bbox.height/2;
    graphArrayCoordinate.graphs[i].old_x = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].old_y = bbox.y+bbox.height/2;
  });
  var len = graphArrayCoordinate.graphs.length;
  for(var i = 0; i < len; i++)
  {
    if(graphArrayCoordinate.graphs[i].graph == graphNumber)
    {
      graphArrayCoordinate.graphs[i].fixed = true;
      d3.select("#moveButton[graph='"+graphNumber+"']")
          .style("fill", "red");
    }
  }
}

// Allow user to zoom and navigate
function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// Called when user pressed delete beside Delete node (Does not work with boxGraph)
function handler1()
{
  force.stop(); // Stop force algorithm
  var label = document.getElementById("deleteNode").value; // Get input
  document.getElementById("deleteNode").value = null; // Clear the input

  var node;
  var nodes;
  var group;
  var graph;
  var outgoingEdges;
  var ingoingEdges;
  var outgoingDummy;
  var ingoingDummy;
  var found = false;
  var len = graphArray.length;
  var len1;
  // Find the node by that label
  for(var i = 0; i < len; i++)
  {
    len1 = graphArray[i].nodes.length;
    for(var j = 0; j < len1; j++)
    {
      if(graphArray[i].nodes[j].label.localeCompare(label) == 0)
      {
        node = graphArray[i].nodes[j];
        nodes = graphArray[i].nodes;
        group = graphArray[i].nodes[j].group;
        graph = graphArray[i];
        found = true;
        break;
      }
    }
    if(found)
    {
      break;
    }
  }

  // If not found or it is dummyNode, alert that node not found
  if(!found || node.isDummy)
  {
    alert("Node not found!");
    return;
  }

  outgoingEdges = helpFunctions.outgoing(node, graph.links); // All outgoing links
  len = outgoingEdges.length;
  var fromId;
  var toId;
  for(i = 0; i < len; i++)
  {
    fromId = outgoingEdges[i].from;
    toId = outgoingEdges[i].to;
    while(helpFunctions.getNodeById(toId, graph.nodes).isDummy) // If it is long edge (more than 1 layer distance), get first not dummyNode in that path
    {
      toId = helpFunctions.outgoing(helpFunctions.getNodeById(toId, graph.nodes), graph.links)[0].to;
    }
    deleteLink(fromId, toId, group, graph); // Delete the link
  }

  ingoingEdges = helpFunctions.ingoing(node, graph.links); // All ingoing links
  len = ingoingEdges.length;
  for(i = 0; i < len; i++)
  {
    fromId = ingoingEdges[i].from;
    toId = ingoingEdges[i].to;
    while(helpFunctions.getNodeById(fromId, graph.nodes).isDummy) // If it is long edge (more than 1 layer distance), get first not dummyNode in that path
    {
      fromId = helpFunctions.ingoing(helpFunctions.getNodeById(fromId, graph.nodes), graph.links)[0].from;
    }
    deleteLink(fromId, toId, group, graph); // Delete the link
  }

  // Delete node from graphArray
  found = false;
  len = graphArray.length;
  for(i = 0; i < len; i++)
  {
    len1 = graphArray[i].nodes.length;
    for(j = 0; j < len1; j++)
    {
      if(graphArray[i].nodes[j].label.localeCompare(label) == 0)
      {
        graphArray[i].nodes.splice(j,1);
        if(graphArray[i].nodes.length < 1)
        {
          graphArray.splice(i,1);
        }
        found = true;
        break;
      }
    }
    if(found)
    {
      break;
    }
  }

  d3.select(".graph[graph='"+node.group+"']").select("g#name"+node.id).remove(); // Delete node from screen
  if(d3.select(".graph[graph='"+node.group+"']").selectAll("g").empty()) // If this node is last node in this graph
  {
    d3.select(".graph[graph='"+node.group+"']").remove(); // Remove the graph
    d3.select("#moveButton[graph='"+node.group+"']").remove(); // Remove the moveButton
  }else{
    d3.select(".graph[graph='"+node.group+"']").selectAll("g") // Update the bounding data
      .data(nodes);
    var newGraph = ConnectedGraphDetect.connectedGraphDetect(graph); // New graph can be formed
    var maxGraphNumber = Number.MIN_VALUE;
    len = graphArray.length;
    // Find maximum graph number
    for(i = 0; i < len; i++)
    {
      if(graphArray[i].groupnumber > maxGraphNumber)
      {
        maxGraphNumber = graphArray[i].groupnumber;
      }
    }
    var a;
    len = newGraph.length;
    // Seperate not connected graph
    for(i = 1; i < len; i++)
    {
      a = {"nodes":[], "links":[], "groupnumber": maxGraphNumber+i}; // New graph
      // Check all nodes
      for(j = 0; j < graph.nodes.length; j++)
      {
        if(graph.nodes[j].group == i+1) // If this node belongs to other graph
        {
          graph.nodes[j].group = maxGraphNumber+i;
          a.nodes.push(graph.nodes[j]);
          d3.select(".graph[graph='"+group+"']").select("g#name"+graph.nodes[j].id)
            .attr("graph", maxGraphNumber+i);
          graph.nodes.splice(j,1);
          j--;
        }
      }
      // Check all links
      for(var k = 0; k < graph.links.length; k++)
      {
        if(graph.links[k].group == i+1) // If this links belongs to other graph
        {
          graph.links[k].group = maxGraphNumber+i;
          a.links.push(graph.links[k]);
          d3.select(".graph[graph='"+group+"']").select("line[from='"+graph.links[k].from+"'][to='"+graph.links[k].to+"']")
            .attr("graph", maxGraphNumber+i);
          graph.links.splice(k,1);
          k--;
        }
      }
      graphArray.push(a); // Add the new graph graphArray
      // Move DOM element to the new graph DOM element
      var newGraphNodes = d3.select(".graph[graph='"+group+"']").selectAll("g[graph='"+(maxGraphNumber+i)+"']")
        .data(a.nodes)
        .remove();
      var newGraphLinks = d3.select(".graph[graph='"+group+"']").selectAll("line[graph='"+(maxGraphNumber+i)+"']")
        .data(a.links)
        .remove();
      var nextGraph = d3.select("svg").select("g").select("g").append("g")
        .attr("class", "graph")
        .attr("graph", (maxGraphNumber+i))
      newGraphNodes.each(function(){
        nextGraph
          .node()
          .appendChild(this);
      });
      newGraphLinks.each(function(){
        nextGraph
          .node()
          .appendChild(this);
      });
    }
    len = graph.nodes.length;
    // Correct graph number of original graph
    for(i = 0; i < len; i++)
    {
      if(graph.nodes[i].group == 1)
      {
        graph.nodes[i].group = group;
      }
    }
    // Bound data to all graphs and calculate center and radius of each new graph, also add moveButton for each new graph
    d3.selectAll(".graph")
      .data(graphArray)
      .each(function(d,i){
        if(graphArrayCoordinate.graphs[i] === undefined) // If it is new graph
        {
          // Calculate center and radius of graph
          var bbox = this.getBBox();
          var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
          graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                            "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": d.groupnumber});

          // Add moveButton
          container.append("circle")
                  .attr("id", "moveButton")
                  .attr("cx", bbox.x+r/2)
                  .attr("cy", bbox.y+r/2)
                  .attr("r", r/2)
                  .style("fill", "green")
                  .attr("graph", d.groupnumber)
                  .call(dragGraph);
        }else{
          // Update center and radius of graph
          var bbox = this.getBBox();
          var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
          graphArrayCoordinate.graphs[i].x = bbox.x+bbox.width/2;
          graphArrayCoordinate.graphs[i].y = bbox.y+bbox.height/2;
          graphArrayCoordinate.graphs[i].old_x = bbox.x+bbox.width/2;
          graphArrayCoordinate.graphs[i].old_y = bbox.y+bbox.height/2;
          graphArrayCoordinate.graphs[i].halfDigonal = halfDigonal;
          graphArrayCoordinate.graphs[i].graph = d.groupnumber;
          // Update moveButton
          d3.select("#moveButton[graph='"+d.groupnumber+"']")
            .attr("cx", bbox.x+r/2)
            .attr("cy", bbox.y+r/2);
        }
      });
  }
}
window.handler1 = handler1;

// Called when user pressed delete beside Delete link (Does not work with boxGraph)
function handler2()
{
  force.stop(); // Stop force algorithm
  var fromLabel = document.getElementById("deleteFrom").value;
  var toLabel = document.getElementById("deleteTo").value;
  document.getElementById("deleteFrom").value = null;
  document.getElementById("deleteTo").value = null;

  var fromId;
  var toId;
  var group;
  var graph;
  var len = graphArray.length;
  var len1;
  // Find node id of starting and ending point link
  for(var i = 0; i < len; i++)
  {
    len1 = graphArray[i].nodes.length;
    for(var j = 0; j < len1; j++)
    {
      if(graphArray[i].nodes[j].label.localeCompare(fromLabel) == 0)
      {
        fromId = graphArray[i].nodes[j].id;
        group = graphArray[i].nodes[j].group;
      }else if(graphArray[i].nodes[j].label.localeCompare(toLabel) == 0)
      {
        toId = graphArray[i].nodes[j].id;
      }
    }
  }

  // If one of them does not exist
  if(fromId === undefined || toId === undefined)
  {
    alert("Edge does not exist!");
    return;
  }

  // Get the graph data
  len = graphArray.length;
  for(i = 0; i < len; i++)
  {
    if(graphArray[i].groupnumber == group)
    {
      graph = graphArray[i];
      break;
    }
  }

  // If one of them is dummy
  if(helpFunctions.getNodeById(fromId, graph.nodes).isDummy || helpFunctions.getNodeById(toId, graph.nodes).isDummy)
  {
    alert("Edge does not exist!");
    return;
  }

  // Find that link and delete it from data
  len = graph.links.length;
  var edge;
  for(i = 0; i < len; i++)
  {
    if(graph.links[i].from == fromId && graph.links[i].to == toId)
    {
      edge = graph.links.splice(i,1);
      break;
    }
  }

  if(edge === undefined) // If link does not exist
  {
    var path = helpFunctions.modifiedDFS(helpFunctions.getNodeById(fromId, graph.nodes), helpFunctions.getNodeById(toId, graph.nodes), graph, undefined); // Check for dummyNode path
    len = path.length;
    if(len > 0) // If we have dummyNode path
    {
      // Delete every dummyNode in that path
      for(i = 0; i < len; i++)
      {
        deleteNode(path[i], group, graph);
      }
    }else{ // Link does not exist
      alert("Edge does not exist!");
      return;
    }
  }else{ // It was link between two node
    var newGraph = ConnectedGraphDetect.connectedGraphDetect(graph); // Controlling if graph is stil connected

    var maxGraphNumber = Number.MIN_VALUE;
    if(newGraph.length == 1) // Graph is stil in one piece
    {
      // Just delete the link and update bounding data
      d3.selectAll(".graph[graph='"+group+"']").select("line[from='"+fromId+"'][to='"+toId+"']").remove();
      d3.selectAll(".graph[graph='"+group+"']").selectAll("line")
        .data(graph.links);
    }else{ // New graph was formed, graph is not connected anymore
      // Delete the link and update bounding data
      d3.selectAll(".graph[graph='"+group+"']").select("line[from='"+fromId+"'][to='"+toId+"']").remove();
      d3.selectAll(".graph[graph='"+group+"']").selectAll("line")
        .data(graph.links);
      len = graphArray.length;
      // Find next graph number
      for(i = 0; i < len; i++)
      {
        if(graphArray[i].groupnumber > maxGraphNumber)
        {
          maxGraphNumber = graphArray[i].groupnumber;
        }
      }
      maxGraphNumber++;
      var a = {"nodes":[], "links": [], "groupnumber": maxGraphNumber};
      // Find every nodes in the new graph
      for(i = 0; i < graph.nodes.length; i++)
      {
        if(graph.nodes[i].group == 1)
        {
          graph.nodes[i].group = group;
        }else{
          graph.nodes[i].group = maxGraphNumber;
          a.nodes.push(graph.nodes[i]);
          d3.select(".graph[graph='"+group+"']").select("g#name"+graph.nodes[i].id)
            .attr("graph", maxGraphNumber);
          graph.nodes.splice(i,1);
          i--;
        }
      }

      // Find every links in the new graph
      for(i = 0; i < graph.links.length; i++)
      {
        if(graph.links[i].group == 1)
        {
          graph.links[i].group = group;
        }else{
          graph.links[i].group = maxGraphNumber;
          a.links.push(graph.links[i]);
          d3.select(".graph[graph='"+group+"']").select("line[from='"+graph.links[i].from+"'][to='"+graph.links[i].to+"']")
            .attr("graph", maxGraphNumber);
          graph.links.splice(i,1);
          i--;
        }
      }
      graphArray.push(a); // Update graphArray
      // Move new graph to new graoh DOM element
      var newGraphNodes = d3.select(".graph[graph='"+group+"']").selectAll("g[graph='"+maxGraphNumber+"'], line[graph='"+maxGraphNumber+"']")
        .data(a.nodes)
        .remove();
      var newGraphLinks = d3.select(".graph[graph='"+group+"']").selectAll("line[graph='"+maxGraphNumber+"']")
        .data(a.links)
        .remove();
      var nextGraph = d3.select("svg").select("g").select("g").append("g")
        .attr("class", "graph")
        .attr("graph", maxGraphNumber)
      newGraphNodes.each(function(){
        nextGraph
          .node()
          .appendChild(this);
      });
      newGraphLinks.each(function(){
        nextGraph
          .node()
          .appendChild(this);
      });
      // Bound data to all graphs and calculate center and radius of each new graph, also add moveButton for each new graph
      d3.selectAll(".graph")
        .data(graphArray)
        .each(function(d,i){
          if(graphArrayCoordinate.graphs[i] === undefined) // If it is new graph
          {
            // Calculate radius and center for the new graph
            var bbox = this.getBBox();
            var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
            graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                              "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": maxGraphNumber});

            // Add moveButton
            container.append("circle")
                      .attr("id", "moveButton")
                      .attr("cx", bbox.x+r/2)
                      .attr("cy", bbox.y+r/2)
                      .attr("r", r/2)
                      .style("fill", "green")
                      .attr("graph", d.groupnumber)
                      .call(dragGraph);
          }else{
            // Update radius and center for the new graph
            var bbox = this.getBBox();
            var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
            graphArrayCoordinate.graphs[i].x = bbox.x+bbox.width/2;
            graphArrayCoordinate.graphs[i].y = bbox.y+bbox.height/2;
            graphArrayCoordinate.graphs[i].old_x = bbox.x+bbox.width/2;
            graphArrayCoordinate.graphs[i].old_y = bbox.y+bbox.height/2;
            graphArrayCoordinate.graphs[i].halfDigonal = halfDigonal;
            graphArrayCoordinate.graphs[i].graph = d.groupnumber;
            d3.select("#moveButton[graph='"+d.groupnumber+"']")
              .attr("cx", bbox.x+r/2)
              .attr("cy", bbox.y+r/2);
          }
        });
    }
  }
}
window.handler2 = handler2;

// Delete node from screen and from data
function deleteNode(node, group, graph)
{
  var outgoingEdges = helpFunctions.outgoing(node, graph.links); // All outgoing links from this node
  var len = outgoingEdges.length;
  for(var i = 0; i < len; i++)
  {
    deleteLink(outgoingEdges[i].from, outgoingEdges[i].to, group, graph); // Delete this link
  }
  var ingoingEdges = helpFunctions.ingoing(node, graph.links); // All ingoing links to this node
  len = ingoingEdges.length;
  for(i = 0; i < len; i++)
  {
    deleteLink(ingoingEdges[i].from, ingoingEdges[i].to, group, graph); // Delete this link
  }

  // Find this node and delete it from data
  var found = false;
  len = graphArray.length;
  for(i = 0; i < len; i++)
  {
    len1 = graphArray[i].nodes.length;
    for(var j = 0; j < len1; j++)
    {
      if(graphArray[i].nodes[j].id == node.id)
      {
        graphArray[i].nodes.splice(j,1);
        if(graphArray[i].nodes.length < 1)
        {
          graphArray.splice(i,1);
        }
        found = true;
        break;
      }
    }
    if(found)
    {
      break;
    }
  }
  // Delete it from screen and check if the graph is now empty or not
  d3.select(".graph[graph='"+node.group+"']").select("g#name"+node.id).remove();
  if(d3.select(".graph[graph='"+node.group+"']").selectAll("g").empty())
  {
    d3.select(".graph[graph='"+node.group+"']").remove();
  }else{
    d3.select(".graph[graph='"+node.group+"']").selectAll("g")
      .data(graph.nodes);
  }
}

// Delete link from screen and from data
function deleteLink(fromId, toId, group, graph)
{
  var len = graph.links.length;
  var edge;
  // Find this link from data
  for(var i = 0; i < len; i++)
  {
    if(graph.links[i].from == fromId && graph.links[i].to == toId)
    {
      edge = graph.links.splice(i,1);
      break;
    }
  }
  if(edge === undefined) // If we do not find this link
  {
    var path = helpFunctions.modifiedDFS(helpFunctions.getNodeById(fromId, graph.nodes), helpFunctions.getNodeById(toId, graph.nodes), graph, undefined); // Check for dummyNode path
    len = path.length;
    if(len > 0) // If we have dummyNode path
    {
      // Delete every dummyNode in this path
      for(i = 0; i < len; i++)
      {
        deleteNode(path[i], group, graph);
      }
    }else{ // Otherwise this link does not exist
      alert("Edge does not exist!");
    }
  }else{
    // Just delete link from screen and update bounding data
    d3.selectAll(".graph[graph='"+group+"']").select("line[from='"+fromId+"'][to='"+toId+"']").remove();
    d3.selectAll(".graph[graph='"+group+"']").selectAll("line")
      .data(graph.links);
  }
}

// Resume force algorithm when "Start animation" is pressed
function resume()
{
  force
    .nodes(graphArrayCoordinate.graphs)
    .start();
}
window.resume = resume;

// Stop force algorithm when "Stop animation" is pressed
function stop()
{
  force.stop();
}
window.stop = stop;

// Read graph data from DOM element (Does not work with box)
function getGraphFromScreen()
{
  var graph = {"nodes": [], "links": []}; // All nodes and links
  var subGraph = {"nodes": [], "links": []}; // Nodes and links in one graph
  d3.selectAll(".graph").each(function(){
    d3.select(this).selectAll("g").each(function(d){
      if(!d.isDummy) // Store all none dummyNode
      {
        subGraph.nodes.push({"id": d.id, "label": d.label});
        graph.nodes.push({"id": d.id, "label": d.label});
      }
    });
    d3.select(this).selectAll("line").each(function(d){
      subGraph.links.push({"from": d.from, "to": d.to}); // Store all links
    });
    var len = subGraph.nodes.length;
    var len1;
    var len2 = subGraph.links.length;;
    var edges;
    var fromId;
    var toId;
    // Links can be part of dummyNode path, needs to find final endpoint
    for(var i = 0; i < len; i++)
    {
      edges = helpFunctions.outgoing(subGraph.nodes[i], subGraph.links); // Outgoing links of each none dummyNode
      len1 = edges.length;
      for(var j = 0; j < len1; j++)
      {
        fromId = edges[j].from;
        toId = edges[j].to;
        while(helpFunctions.getNodeById(toId, subGraph.nodes) === null) // If we do not find toId node, means toId node is dummy, continue in this path
        {
          for(var k = 0; k < len2; k++)
          {
            if(subGraph.links[k].from == toId)
            {
              toId = subGraph.links[k].to;
              break;
            }
          }
        }
        graph.links.push({"from": fromId, "to": toId}); // Add correct link to graph
      }
    }
    subGraph = {"nodes": [], "links": []}; // Reset subGraph
  });
  return graph; // Return the graph readed from graph DOM element
}

// Redraws all graphs when "Redraw graphs" is pressed
function redraw()
{
  force.stop(); // Stop force algorithm
  var graph = getGraphFromScreen(); // Get all graphs from screen
  d3.select("#graph").selectAll("*").remove(); // Remove all graphs from screen
  boxGraphs = BoxGraphController.getBoxGraph(graph); // Extract all boxes from graph and replace each box to fake node
  graphArray = Main.main(graph); // Sugiyama method for all graphs
  boxGraphs = boxSugiyama(boxGraphs); // Sugiyama method for all boxes
  calculateScreenSizeAndScale() // Set screen size and calculate scale based on widest and highest graph
  calculateInitialScreenPosition(); // Calculate initial position of each nodes on screen based on scale

  // SVG element
  svg = d3.select('#graph').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append("g")
      .call(zoom);
  rect = svg.append("rect")
                  .attr("width", width)
                  .attr("height", height)
                  .style("fill", "none")
                  .style("pointer-events", "all");
  container = svg
                    .append("g");

  // Arrow image
  container.append('defs').append('marker')
    .attr("id", 'markerArrowEnd')
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
      .attr("d", 'M0,-5 L10,0 L0,5')
      .attr('fill', 'black');

  drawGraph(); // Draw all graphs on screen
  drawBox(); // Draw all boxes on screen
  moveBoxToCorrectPosition(); // Replace now fake node with corresponding box
  modifyLinks(); // Update visualization of links
  graphArrayCoordinate = {"graphs": [], "links": []}; // Array of center of each graph
  graphAsNode(); // Calculate center and radius of each graph, used in force algorithm

  // Setting up force
  force = d3.layout.force()
                .size([width, height])
                .friction(0.5) // Slow down the animation
                .on("tick", tick);

  // See every graph as big node and start force to position every graph nicely
  force
    .nodes(graphArrayCoordinate.graphs)
    .start();
}
window.redraw = redraw;

// Release all graphs when "Release all graphs" is pressed
function release()
{
  var len = graphArrayCoordinate.graphs.length;
  // Set fixed to false for every graph
  for(var i = 0; i < len; i++)
  {
    graphArrayCoordinate.graphs[i].fixed = false;
  }
  d3.selectAll("#moveButton")
      .style("fill", "green");
  // Start the force algorithm again
  force
    .nodes(graphArrayCoordinate.graphs)
    .start();
}
window.release = release;
