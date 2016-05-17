var d3 = require('d3');
var CycleRemoval = require('./CycleRemoval.js');
var XCoordinateAssignment = require("./XCoordinateAssignment.js");
var LongestPath = require("./LongestPath.js");
var VertexOrdering = require("./VertexOrdering.js");
var Initialize = require("./Initialize.js");
var Sugiyama = require("./Sugiyama.js");
var ConnectedGraphDetect = require("./ConnectedGraphDetection.js");
var Main = require("./main.js");
var helpFunctions = require("./helpFunctions.js");
var BoxGraphController = require("./BoxgraphDetection.js");
var Graph = require("./Graphs.js");



function adjustEnds(fromPoint, toPoint) {
  var dx = xScale(toPoint.x) - xScale(fromPoint.x),
    dy = yScale(toPoint.rank) - yScale(fromPoint.rank),
    length = Math.sqrt(dx * dx + dy * dy);
  dx = dx / length * r;
  dy = dy / length * r;
  return {from: {x: xScale(fromPoint.x) + dx, rank: yScale(fromPoint.rank) + dy}, to: {x: xScale(toPoint.x) - dx, rank: yScale(toPoint.rank) - dy}};
}

function adjustBoxEnds(fromPoint, fromRadius, toPoint, toRadius) {

  var dx = toPoint.x-fromPoint.x;
  var dy = toPoint.y-fromPoint.y;

  var length = Math.sqrt(dx * dx + dy * dy);
  var fromPointdx = dx / length * fromRadius;
  var fromPointdy = dy / length * fromRadius;
  var toPointdx = dx / length * toRadius;
  var toPointdy = dy / length * toRadius;
  return {from: {x: fromPoint.x + fromPointdx, y: fromPoint.y + fromPointdy}, to: {x: toPoint.x - toPointdx, y: toPoint.y - toPointdy}};
}



function adjustDragEnds(fromPoint, toPoint) {
  var dx = toPoint.x-fromPoint.x;
  var dy = toPoint.y-fromPoint.y;
  var length = Math.sqrt(dx * dx + dy * dy);
  dx = dx / length * r;
  dy = dy / length * r;
  return {from: {x: parseFloat(fromPoint.x) + dx, y: parseFloat(fromPoint.y) + dy}, to: {x: parseFloat(toPoint.x) - dx, y: parseFloat(toPoint.y) - dy}};
}

var r = 20;
var dummyR = 0;

var graph = Graph.getGraph();
var boxGraphs = BoxGraphController.getBoxGraph(graph);
var graphArray = Main.main(graph); // get cleaned sub graphs
var len1 = boxGraphs.length;
console.log(boxGraphs);
var len2;
var id;
for(var i = 0; i < len1; i++)
{
  var subGraph = {"nodes": boxGraphs[i].nodes, "links": boxGraphs[i].links};
  Sugiyama.sugiyama(subGraph);
  boxGraphs[i].nodes = subGraph.nodes;
  boxGraphs[i].links = subGraph.links;
  id = Number.MAX_VALUE;
  len2 = boxGraphs[i].nodes.length;
  for(var j = 0; j < len2; j++)
  {
    if(boxGraphs[i].nodes[j].id < id)
    {
      id = boxGraphs[i].nodes[j].id;
    }
  }
  boxGraphs[i].graph = CycleRemoval.getNodeById(id, graph.nodes).group;
}
len1 = graphArray.length;
var maxX;
var minX;
var maxY;
var minY;
var globalMaxX = Number.MIN_VALUE;
var globalMinX = Number.MAX_VALUE;
var globalMaxY = Number.MIN_VALUE;
var globalMinY = Number.MAX_VALUE;
var currentGraph;
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

width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var yScale = d3.scale.linear()
                      .domain([globalMaxY, globalMinY])
                      .range([r, (globalMaxY-globalMinY)*6*r-r]);
var xScale = d3.scale.linear()
                      .domain([globalMinX, globalMaxX])
                      .range([r, (globalMaxX-globalMinX)*5*r-r]);

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

// Define marker
container.append('defs').append('marker')
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
    if(!d.isDummy)
    {
      d3.select(this)
        .append('circle')
          .attr("cx", xScale(d.x))
          .attr("cy", yScale(d.rank))
          .attr("r", r)
          .attr("id", "name"+d.id)
          .attr("isDummy", "false")
          .style("fill", "white")

      d3.select(this)
        .append('text')
          .text(d.label)
          .attr({x: xScale(d.x)-r/4, y: yScale(d.rank)+r/4});

      d3.select(this)
          .attr("graph",graphNumber)
          .attr("id", "name"+d.id)
          .call(drag);
    }
    else {
      d3.select(this)
        .append('circle')
          .attr("cx", xScale(d.x))
          .attr("cy", yScale(d.rank))
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
    var fromNode = CycleRemoval.getNodeById(d.from, graphArray[i].nodes);
    var toNode = CycleRemoval.getNodeById(d.to, graphArray[i].nodes);
    var adjustedEnds = adjustEnds(fromNode, toNode);
    if(!fromNode.isDummy && !toNode.isDummy)
    {
      d3.select(this)
        .attr("x1", function(d) { return adjustedEnds.from.x; })
        .attr("y1", function(d) { return adjustedEnds.from.rank; })
        .attr("x2", function(d) { return adjustedEnds.to.x; })
        .attr("y2", function(d) { return adjustedEnds.to.rank; })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber)
        .attr("marker-end", "url(#markerArrowEnd)");
    }else if(fromNode.isDummy && !toNode.isDummy){
      d3.select(this)
        .attr("x1", function(d) { return xScale(fromNode.x); })
        .attr("y1", function(d) { return yScale(fromNode.rank); })
        .attr("x2", function(d) { return adjustedEnds.to.x; })
        .attr("y2", function(d) { return adjustedEnds.to.rank; })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber)
        .attr("marker-end", "url(#markerArrowEnd)");
    }else if(!fromNode.isDummy && toNode.isDummy){
      d3.select(this)
        .attr("x1", function(d) { return adjustedEnds.from.x; })
        .attr("y1", function(d) { return adjustedEnds.from.rank; })
        .attr("x2", function(d) { return xScale(toNode.x); })
        .attr("y2", function(d) { return yScale(toNode.rank); })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber);
    }else{
      d3.select(this)
        .attr("x1", function(d) { return xScale(fromNode.x); })
        .attr("y1", function(d) { return yScale(fromNode.rank); })
        .attr("x2", function(d) { return xScale(toNode.x); })
        .attr("y2", function(d) { return yScale(toNode.rank); })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber);
    }
  });
  links.exit().remove();
});

//draw boxGraphs and get radius of boxGraphs
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
    if(!d.isDummy)
    {
        d3.select(this)
          .append('circle')
            .attr("cx", xScale(d.x))
            .attr("cy", yScale(d.rank))
            .attr("r", r)
            .attr("id", "boxname"+d.id)
            .attr("box", boxNumber)
            .attr("isDummy", "false")
            .style("fill", "white");

        d3.select(this)
          .append('text')
            .text(d.label)
            .attr({x: xScale(d.x)-r/4, y: yScale(d.rank)+r/4});

        d3.select(this)
            .attr("graph",graphNumber)
            .attr("id", "boxname"+d.id)
            .call(drag);
    }else {
        d3.select(this)
          .append('circle')
            .attr("cx", xScale(d.x))
            .attr("cy", yScale(d.rank))
            .attr("r", dummyR)
            .attr("id", "boxname"+d.id)
            .attr("graph",graphNumber)
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
    var fromNode = CycleRemoval.getNodeById(d.from, boxGraphs[i].nodes);
    var toNode = CycleRemoval.getNodeById(d.to, boxGraphs[i].nodes);
    var adjustedEnds = adjustEnds(fromNode, toNode);
    if(!fromNode.isDummy && !toNode.isDummy)
    {
      d3.select(this)
          .attr("x1", function(d) { return adjustedEnds.from.x; })
          .attr("y1", function(d) { return adjustedEnds.from.rank; })
          .attr("x2", function(d) { return adjustedEnds.to.x; })
          .attr("y2", function(d) { return adjustedEnds.to.rank; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("box", boxNumber)
          .attr("graph", graphNumber)
          .attr("marker-end", "url(#markerArrowEnd)");
    }else if(fromNode.isDummy && !toNode.isDummy){
      d3.select(this)
          .attr("x1", function(d) { return xScale(fromNode.x); })
          .attr("y1", function(d) { return yScale(fromNode.rank); })
          .attr("x2", function(d) { return adjustedEnds.to.x; })
          .attr("y2", function(d) { return adjustedEnds.to.rank; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("box", boxNumber)
          .attr("graph", graphNumber)
          .attr("marker-end", "url(#markerArrowEnd)");
    }else if(!fromNode.isDummy && toNode.isDummy){
      d3.select(this)
          .attr("x1", function(d) { return adjustedEnds.from.x; })
          .attr("y1", function(d) { return adjustedEnds.from.rank; })
          .attr("x2", function(d) { return xScale(toNode.x); })
          .attr("y2", function(d) { return yScale(toNode.rank); })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("box", boxNumber)
          .attr("graph", graphNumber);
    }else{
      d3.select(this)
          .attr("x1", function(d) { return xScale(fromNode.x); })
          .attr("y1", function(d) { return yScale(fromNode.rank); })
          .attr("x2", function(d) { return xScale(toNode.x); })
          .attr("y2", function(d) { return yScale(toNode.rank); })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("box", boxNumber)
          .attr("graph", graphNumber);
    }
  });
  links.exit().remove();
});

boxEnter.each(function(d){
  var bbox = this.getBBox();
  var Radius = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
  var cx = bbox.x + bbox.width/2;
  var cy = bbox.y + bbox.height/2;
  //deal with circle
  d3.select(this).append('circle')
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("id","boxcircle")
    .attr("r", Radius)
    .style("fill", "none");

  var graphNumber = d3.select(this).attr("graph");
  var boxNumber = d3.select(this).attr("box");
  var minId = d3.select(this).attr("id");
  var toCx = parseFloat(d3.select("g[graph='" + graphNumber + "']").select("circle#name"+minId.slice(4,minId.length)).attr("cx"));
  var toCy = parseFloat(d3.select("g[graph='" + graphNumber + "']").select("circle#name"+minId.slice(4,minId.length)).attr("cy"));
  d3.select("g[graph='" + graphNumber + "']").select("g#name"+minId.slice(4,minId.length)).remove();
  d3.select(this).select("circle[id=boxcircle]")
    .attr("cx", toCx)
    .attr("cy", toCy);

  var dx = toCx - cx;
  var dy = toCy - cy;
  //deal with nodes
  d3.select(this).selectAll(".node").each(function(){
      var oldx = parseFloat(d3.select(this).select("circle").attr("cx"));
      var oldy = parseFloat(d3.select(this).select("circle").attr("cy"));
      d3.select(this).select("circle")
          .attr("cx", oldx + dx)
          .attr("cy", oldy + dy);
      d3.select(this).select("text")
          .attr({x: oldx + dx-r/4, y: oldy + dy+r/4});
  });

  //deal with lines
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

  var selectedGraph = d3.select("svg").select("g").select("g").select("g[graph='" + graphNumber + "']");

  //for each nodes upper, lower than falseNode, and the node to the left and right will be moved a radius
  d3.select("g[graph= '"+ graphNumber + "']").selectAll(".node").each(function(d){
    if(d3.select(this).select("circle").attr("box") === null)
    {
      var oldcx = parseFloat(d3.select(this).select("circle").attr("cx")); //cx of each node in graph
      var oldcy = parseFloat(d3.select(this).select("circle").attr("cy")); //cy of each node in graph
      var dx = oldcx - toCx;
      var dy = oldcy - toCy;
      var length = Math.sqrt(dx * dx + dy * dy);
      var newcx = dx / length * Radius + oldcx;
      var newcy = dy / length * Radius + oldcy;
      console.log(dx);
      console.log(dy);
      d3.select(this).select("circle")
             .attr("cx", newcx)
             .attr("cy", newcy);
         d3.select(this).select("text")
             .attr({x: newcx - r/4, y: newcy + r/4});
    }
  });

  d3.select("g[graph= '"+ graphNumber + "']").selectAll(".boxGraph").each(function(){
    var oldcx = parseFloat(d3.select(this).select("circle[id=boxcircle]").attr("cx")); //cx of each node in graph
    var oldcy = parseFloat(d3.select(this).select("circle[id=boxcircle]").attr("cy")); //cy of each node in graph
    var dx = oldcx - toCx;
    var dy = oldcy - toCy;
    var length = Math.sqrt(dx * dx + dy * dy);
    dx = dx / length * Radius;
    dy = dy / length * Radius;
    d3.select(this).selectAll(".node").each(function(d){
      var cx = parseFloat(d3.select(this).select("circle").attr("cx"));
      var cy = parseFloat(d3.select(this).select("circle").attr("cy"));
      d3.select(this).select("circle")
          .attr("cx", cx+dx)
          .attr("cy", cy+dy);
      d3.select(this).select("text")
          .attr({x: cx+dx - r/4, y: cy+dy + r/4})
    });

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

    d3.select(this).select("circle[id=boxcircle]")
        .attr("cx", oldcx+dx)
        .attr("cy", oldcy+dy);
  });

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
  //remove nodes and links in big graph
  var box = d3.select(this)
                  .remove();
  box.each(function(){
      selectedGraph
        .node()
        .appendChild(this);
  });

});

graphEnter.each(function(d,i){
  d3.select(this).selectAll("line").each(function(){
    if(d3.select(this).attr("box") === null)
    {
      var fromId = d3.select(this).attr("from");
      var toId = d3.select(this).attr("to");
      if(fromId.indexOf("box") > -1)
      {
        fromId = fromId.slice(3, fromId.length);
        fromId = d3.select(".boxGraph[box='"+fromId+"']").attr("id");
        fromId = fromId.slice(4, fromId.length);
      }
      if(toId.indexOf("box") > -1)
      {
        toId = toId.slice(3, toId.length);
        toId = d3.select(".boxGraph[box='"+toId+"']").attr("id");
        toId = toId.slice(4, toId.length);
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
      var adjustedEnds = adjustBoxEnds(fromPoint, fromRadius, toPoint, toRadius);
      d3.select(this)
          .attr("x1", adjustedEnds.from.x)
          .attr("y1", adjustedEnds.from.y)
          .attr("x2", adjustedEnds.to.x)
          .attr("y2", adjustedEnds.to.y);
    }
  });
});

var graphArrayCoordinate = {"graphs": [], "links": []};

graphEnter.each(function(d){
  var bbox = this.getBBox();
  var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
  graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                    "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": d.groupnumber});

  container.append("circle")
    .attr("id", "moveButton")
    .attr("cx", bbox.x+r/2)
    .attr("cy", bbox.y+r/2)
    .attr("r", r/2)
    .attr("fill", "black")
    .attr("graph", d.groupnumber)
    .call(dragGraph);
});

var force = d3.layout.force()
              .size([width, height])
              .friction(0.7)
              .on("tick", tick);

force
  .nodes(graphArrayCoordinate.graphs)
  //.start();

function tick()
{
  var q = d3.geom.quadtree(graphArrayCoordinate.graphs);
  var i = 0;
  var n = graphArrayCoordinate.graphs.length;

  while(i < n)
  {
    q.visit(collide(graphArrayCoordinate.graphs[i]));
    i++;
  }

  d3.selectAll(".graph").each(function(d,i){
    var dx = graphArrayCoordinate.graphs[i].x - graphArrayCoordinate.graphs[i].old_x;
    var dy = graphArrayCoordinate.graphs[i].y - graphArrayCoordinate.graphs[i].old_y;
    graphArrayCoordinate.graphs[i].old_x = graphArrayCoordinate.graphs[i].x;
    graphArrayCoordinate.graphs[i].old_y = graphArrayCoordinate.graphs[i].y;
    d3.select(this).selectAll(".node").each(function(d){
      if(d3.select(this).select("circle").attr("box") === null)
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

    d3.select(this).selectAll("line").each(function(d){
      if(d3.select(this).attr("box") === null)
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

    d3.select("#moveButton[graph='"+graphArrayCoordinate.graphs[i].graph+"']").each(function(d){
      var cx = parseFloat(d3.select(this).attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).attr("cy"))+dy;
      d3.select(this)
        .attr("cx",cx)
        .attr("cy",cy);
    });

    d3.select(this).selectAll(".boxGraph").each(function(){
      d3.select(this).selectAll("g").each(function(){
        var cx = parseFloat(d3.select(this).select("circle").attr("cx"))+dx;
        var cy = parseFloat(d3.select(this).select("circle").attr("cy"))+dy;
        d3.select(this).select("circle")
            .attr("cx", cx)
            .attr("cy", cy);

        d3.select(this).select("text")
            .attr({x: cx-r/4, y: cy+r/4});
      });

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

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this).select("circle")
    .attr("cx", x)
    .attr("cy", y);
  d3.select(this).select("text")
    .attr({x: d3.event.x-r/4, y: d3.event.y+r/4});


  var graphNumber = d3.select(this).attr("graph");

  d3.selectAll("line[graph='"+graphNumber+"'][to='"+d.id+"']").each(function(d,i)
  {
    var fromId = d3.select(this).attr("from");
    var toId = d3.select(this).attr("to");
    if(fromId.indexOf("box") > -1)
    {
      fromId = fromId.slice(3, fromId.length);
      fromId = d3.select(".boxGraph[box='"+fromId+"']").attr("id");
      fromId = fromId.slice(4, fromId.length);
    }
    if(toId.indexOf("box") > -1)
    {
      toId = toId.slice(3, toId.length);
      toId = d3.select(".boxGraph[box='"+toId+"']").attr("id");
      toId = toId.slice(4, toId.length);
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
    var adjustedEnds = adjustBoxEnds(fromPoint, fromRadius, toPoint, toRadius);
    d3.select(this)
        .attr("x1", adjustedEnds.from.x)
        .attr("y1", adjustedEnds.from.y)
        .attr("x2", adjustedEnds.to.x)
        .attr("y2", adjustedEnds.to.y);
  });


  d3.selectAll("line[graph='"+graphNumber+"'][from='"+d.id+"']").each(function(d,i)
  {
    var fromId = d3.select(this).attr("from");
    var toId = d3.select(this).attr("to");
    if(fromId.indexOf("box") > -1)
    {
      fromId = fromId.slice(3, fromId.length);
      fromId = d3.select(".boxGraph[box='"+fromId+"']").attr("id");
      fromId = fromId.slice(4, fromId.length);
    }
    if(toId.indexOf("box") > -1)
    {
      toId = toId.slice(3, toId.length);
      toId = d3.select(".boxGraph[box='"+toId+"']").attr("id");
      toId = toId.slice(4, toId.length);
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
    var adjustedEnds = adjustBoxEnds(fromPoint, fromRadius, toPoint, toRadius);
    d3.select(this)
        .attr("x1", adjustedEnds.from.x)
        .attr("y1", adjustedEnds.from.y)
        .attr("x2", adjustedEnds.to.x)
        .attr("y2", adjustedEnds.to.y);
  });
}

function dragstart()
{
  d3.event.sourceEvent.stopPropagation();
  force.stop();
}

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

function graphMove()
{
  var dx = d3.event.x - parseFloat(d3.select(this).attr("cx"));
  var dy = d3.event.y - parseFloat(d3.select(this).attr("cy"));
  d3.select(this)
    .attr("cx", d3.event.x)
    .attr("cy", d3.event.y);

  var graphNumber = parseInt(d3.select(this).attr("graph"));

  d3.select(".graph[graph='"+graphNumber+"']").selectAll("g").each(function(d){
    if(d3.select(this).select("circle").attr("box") === null)
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

  d3.select(".graph[graph='"+graphNumber+"']").selectAll("line").each(function(d){
    if(d3.select(this).attr("box") === null)
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

  d3.select(".graph[graph='"+graphNumber+"']").selectAll(".boxGraph").each(function(){
    d3.select(this).selectAll("g").each(function(){
      var cx = parseFloat(d3.select(this).select("circle").attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).select("circle").attr("cy"))+dy;
      d3.select(this).select("circle")
          .attr("cx", cx)
          .attr("cy", cy);

      d3.select(this).select("text")
          .attr({x: cx-r/4, y: cy+r/4});
    });

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

    d3.select(this).select("#boxcircle").each(function(){
      var cx = parseFloat(d3.select(this).attr("cx"))+dx;
      var cy = parseFloat(d3.select(this).attr("cy"))+dy;
      d3.select(this)
          .attr("cx", cx)
          .attr("cy", cy);
    });
  });
}

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
    //console.log(bbox.x + " " + bbox.y);
  });
  var len = graphArrayCoordinate.graphs.length;
  for(var i = 0; i < len; i++)
  {
    if(graphArrayCoordinate.graphs[i].graph == graphNumber)
    {
      graphArrayCoordinate.graphs[i].fixed = true;
    }
  }
}
function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function handler1()
{
  force.stop();
  var label = document.getElementById("deleteNode").value;
  document.getElementById("deleteNode").value = null;

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

  outgoingEdges = CycleRemoval.outgoing(node, graph.links);
  len = outgoingEdges.length;
  var fromId;
  var toId;
  for(i = 0; i < len; i++)
  {
    fromId = outgoingEdges[i].from;
    toId = outgoingEdges[i].to;
    while(CycleRemoval.getNodeById(toId, graph.nodes).isDummy)
    {
      toId = CycleRemoval.outgoing(CycleRemoval.getNodeById(toId, graph.nodes), graph.links)[0].to;
    }
    deleteLink(fromId, toId, group, graph);
  }
  ingoingEdges = CycleRemoval.ingoing(node, graph.links);
  len = ingoingEdges.length;
  for(i = 0; i < len; i++)
  {
    fromId = ingoingEdges[i].from;
    toId = ingoingEdges[i].to;
    while(CycleRemoval.getNodeById(fromId, graph.nodes).isDummy)
    {
      fromId = CycleRemoval.ingoing(CycleRemoval.getNodeById(fromId, graph.nodes), graph.links)[0].from;
    }
    deleteLink(fromId, toId, group, graph);
  }

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
  d3.select(".graph[graph='"+node.group+"']").select("g#name"+node.id).remove();
  if(d3.select(".graph[graph='"+node.group+"']").selectAll("g").empty())
  {
    d3.select(".graph[graph='"+node.group+"']").remove();
    d3.select("#moveButton[graph='"+node.group+"']").remove();
  }else{
    d3.select(".graph[graph='"+node.group+"']").selectAll("g")
      .data(nodes);
    var newGraph = ConnectedGraphDetect.connectedGraphDetect(graph);
    var maxGraphNumber = Number.MIN_VALUE;
    len = graphArray.length;
    for(i = 0; i < len; i++)
    {
      if(graphArray[i].groupnumber > maxGraphNumber)
      {
        maxGraphNumber = graphArray[i].groupnumber;
      }
    }
    var a;
    len = newGraph.length;
    for(i = 1; i < len; i++)
    {
      a = {"nodes":[], "links":[], "groupnumber": maxGraphNumber+i};
      for(j = 0; j < graph.nodes.length; j++)
      {
        if(graph.nodes[j].group == i+1){
          graph.nodes[j].group = maxGraphNumber+i;
          a.nodes.push(graph.nodes[j]);
          d3.select(".graph[graph='"+group+"']").select("g#name"+graph.nodes[j].id)
            .attr("graph", maxGraphNumber+i);
          graph.nodes.splice(j,1);
          j--;
        }
      }
      for(var k = 0; k < graph.links.length; k++)
      {
        if(graph.links[k].group == i+1){
          graph.links[k].group = maxGraphNumber+i;
          a.links.push(graph.links[k]);
          d3.select(".graph[graph='"+group+"']").select("line[from='"+graph.links[k].from+"'][to='"+graph.links[k].to+"']")
            .attr("graph", maxGraphNumber+i);
          graph.links.splice(k,1);
          k--;
        }
      }
      graphArray.push(a);
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
    for(i = 0; i < len; i++)
    {
      if(graph.nodes[i].group == 1)
      {
        graph.nodes[i].group == group;
      }
    }
    d3.selectAll(".graph")
      .data(graphArray)
      .each(function(d,i){
        if(graphArrayCoordinate.graphs[i] === undefined)
        {
          var bbox = this.getBBox();
          var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
          graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                            "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": d.groupnumber});
          container.append("circle")
                  .attr("id", "moveButton")
                  .attr("cx", bbox.x+r/2)
                  .attr("cy", bbox.y+r/2)
                  .attr("r", r/2)
                  .attr("fill", "black")
                  .attr("graph", d.groupnumber)
                  .call(dragGraph);
        }else{
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
window.handler1 = handler1;

function handler2()
{
  force.stop();
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

  len = graphArray.length;
  for(i = 0; i < len; i++)
  {
    if(graphArray[i].groupnumber == group)
    {
      graph = graphArray[i];
      break;
    }
  }
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
  if(edge === undefined)
  {
    var path = helpFunctions.modifiedDFS(CycleRemoval.getNodeById(fromId, graph.nodes), CycleRemoval.getNodeById(toId, graph.nodes), graph, undefined);
    len = path.length;
    if(len > 0)
    {
      for(i = 0; i < len; i++)
      {
        deleteNode(path[i], group, graph);
      }
    }else{
      alert("Edge does not exist!");
    }
  }else{

    var newGraph = ConnectedGraphDetect.connectedGraphDetect(graph);

    var maxGraphNumber = Number.MIN_VALUE;
    if(newGraph.length == 1)
    {
      d3.selectAll(".graph[graph='"+group+"']").select("line[from='"+fromId+"'][to='"+toId+"']").remove();
      d3.selectAll(".graph[graph='"+group+"']").selectAll("line")
        .data(graph.links);
    }else{
      d3.selectAll(".graph[graph='"+group+"']").select("line[from='"+fromId+"'][to='"+toId+"']").remove();
      d3.selectAll(".graph[graph='"+group+"']").selectAll("line")
        .data(graph.links);
      len = graphArray.length;
      for(i = 0; i < len; i++)
      {
        if(graphArray[i].groupnumber > maxGraphNumber)
        {
          maxGraphNumber = graphArray[i].groupnumber;
        }
      }
      maxGraphNumber++;
      var a = {"nodes":[], "links": [], "groupnumber": maxGraphNumber};
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
      graphArray.push(a);
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
      d3.selectAll(".graph")
        .data(graphArray)
        .each(function(d,i){
          if(graphArrayCoordinate.graphs[i] === undefined)
          {
            var bbox = this.getBBox();
            var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
            graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                              "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": maxGraphNumber});
            container.append("circle")
                      .attr("id", "moveButton")
                      .attr("cx", bbox.x+r/2)
                      .attr("cy", bbox.y+r/2)
                      .attr("r", r/2)
                      .attr("fill", "black")
                      .attr("graph", d.groupnumber)
                      .call(dragGraph);
          }else{
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

function deleteNode(node, group, graph)
{
  var outgoingEdges = CycleRemoval.outgoing(node, graph.links);
  var len = outgoingEdges.length;
  for(var i = 0; i < len; i++)
  {
    deleteLink(outgoingEdges[i].from, outgoingEdges[i].to, group, graph);
  }
  var ingoingEdges = CycleRemoval.ingoing(node, graph.links);
  len = ingoingEdges.length;
  for(i = 0; i < len; i++)
  {
    deleteLink(ingoingEdges[i].from, ingoingEdges[i].to, group, graph);
  }

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
  d3.select(".graph[graph='"+node.group+"']").select("g#name"+node.id).remove();
  if(d3.select(".graph[graph='"+node.group+"']").selectAll("g").empty())
  {
    d3.select(".graph[graph='"+node.group+"']").remove();
  }else{
    d3.select(".graph[graph='"+node.group+"']").selectAll("g")
      .data(graph.nodes);
  }
}

function deleteLink(fromId, toId, group, graph)
{
  var len = graph.links.length;
  var edge;
  for(var i = 0; i < len; i++)
  {
    if(graph.links[i].from == fromId && graph.links[i].to == toId)
    {
      edge = graph.links.splice(i,1);
      break;
    }
  }
  if(edge === undefined)
  {
    var path = helpFunctions.modifiedDFS(CycleRemoval.getNodeById(fromId, graph.nodes), CycleRemoval.getNodeById(toId, graph.nodes), graph, undefined);
    len = path.length;
    if(len > 0)
    {
      for(i = 0; i < len; i++)
      {
        deleteNode(path[i], group, graph);
      }
    }else{
      alert("Edge does not exist!");
    }
  }else{

    d3.selectAll(".graph[graph='"+group+"']").select("line[from='"+fromId+"'][to='"+toId+"']").remove();
    d3.selectAll(".graph[graph='"+group+"']").selectAll("line")
      .data(graph.links);
  }
}

function resume()
{
  force
    .nodes(graphArrayCoordinate.graphs)
    .start();
}
window.resume = resume;

function stop()
{
  force.stop();
}
window.stop = stop;

function redraw()
{
  force.stop();
  var Graph = {"nodes": [], "links": []};
  var subGraph = {"nodes": [], "links": []};
  d3.selectAll(".graph").each(function(){
    d3.select(this).selectAll("g").each(function(d){
      if(!d.isDummy)
      {
        subGraph.nodes.push({"id": d.id, "label": d.label});
        Graph.nodes.push({"id": d.id, "label": d.label});
      }
    });
    d3.select(this).selectAll("line").each(function(d){
      subGraph.links.push({"from": d.from, "to": d.to});
    });
    var len = subGraph.nodes.length;
    var len1;
    var len2 = subGraph.links.length;;
    var edges;
    var fromId;
    var toId;
    for(var i = 0; i < len; i++)
    {
      edges = CycleRemoval.outgoing(subGraph.nodes[i], subGraph.links);
      len1 = edges.length;
      for(var j = 0; j < len1; j++)
      {
        fromId = edges[j].from;
        toId = edges[j].to;
        while(CycleRemoval.getNodeById(toId, subGraph.nodes) === null)
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
        Graph.links.push({"from": fromId, "to": toId});
      }
    }
    subGraph = {"nodes": [], "links": []};
  });
  d3.select("#graph").selectAll("*").remove();
  graphArray = Main.main(Graph);
  len1 = graphArray.length;
  globalMaxX = Number.MIN_VALUE;
  globalMinX = Number.MAX_VALUE;
  globalMaxY = Number.MIN_VALUE;
  globalMinY = Number.MAX_VALUE;
  currentGraph;
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

  width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
  height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

  yScale = d3.scale.linear()
                        .domain([globalMaxY, globalMinY])
                        .range([r, (globalMaxY-globalMinY)*6*r-r]);
  xScale = d3.scale.linear()
                        .domain([globalMinX, globalMaxX])
                        .range([r, (globalMaxX-globalMinX)*5*r-r]);

  drag = d3.behavior.drag()
              .on("drag", dragmove)
              .on("dragstart", dragstart)
              .on("dragend", dragend);

  zoom = d3.behavior.zoom()
              .on("zoom", zoomed);

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

  // Define marker
  container.append('defs').append('marker')
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

  graph = container.selectAll(".graph")
    .data(graphArray);

  graphEnter = graph.enter().append('g')
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
      if(!d.isDummy)
      {
        d3.select(this)
          .append('circle')
            .attr("cx", xScale(d.x))
            .attr("cy", yScale(d.rank))
            .attr("r", r)
            .attr("id", "name"+d.id)
            .attr("isDummy", "false")
            .style("fill", "white")

        d3.select(this)
          .append('text')
            .text(d.label)
            .attr({x: xScale(d.x)-r/4, y: yScale(d.rank)+r/4});

        d3.select(this)
          .attr("graph",graphNumber)
          .attr("id", "name"+d.id)
          .call(drag);
      }
      else {
        d3.select(this)
          .append('circle')
            .attr("cx", xScale(d.x))
            .attr("cy", yScale(d.rank))
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
      var fromNode = CycleRemoval.getNodeById(d.from, graphArray[i].nodes);
      var toNode = CycleRemoval.getNodeById(d.to, graphArray[i].nodes);
      var adjustedEnds = adjustEnds(fromNode, toNode);
      if(!fromNode.isDummy && !toNode.isDummy)
      {
        d3.select(this)
          .attr("x1", function(d) { return adjustedEnds.from.x; })
          .attr("y1", function(d) { return adjustedEnds.from.rank; })
          .attr("x2", function(d) { return adjustedEnds.to.x; })
          .attr("y2", function(d) { return adjustedEnds.to.rank; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber)
          .attr("marker-end", "url(#markerArrowEnd)");
      }else if(fromNode.isDummy && !toNode.isDummy){
        d3.select(this)
          .attr("x1", function(d) { return xScale(fromNode.x); })
          .attr("y1", function(d) { return yScale(fromNode.rank); })
          .attr("x2", function(d) { return adjustedEnds.to.x; })
          .attr("y2", function(d) { return adjustedEnds.to.rank; })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber)
          .attr("marker-end", "url(#markerArrowEnd)");
      }else if(!fromNode.isDummy && toNode.isDummy){
        d3.select(this)
          .attr("x1", function(d) { return adjustedEnds.from.x; })
          .attr("y1", function(d) { return adjustedEnds.from.rank; })
          .attr("x2", function(d) { return xScale(toNode.x); })
          .attr("y2", function(d) { return yScale(toNode.rank); })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber);
      }else{
        d3.select(this)
          .attr("x1", function(d) { return xScale(fromNode.x); })
          .attr("y1", function(d) { return yScale(fromNode.rank); })
          .attr("x2", function(d) { return xScale(toNode.x); })
          .attr("y2", function(d) { return yScale(toNode.rank); })
          .attr("from", d.from)
          .attr("to", d.to)
          .attr("graph", graphNumber);
      }
    });
    links.exit().remove();
  });

  graphArrayCoordinate = {"graphs": [], "links": []};

  graphEnter.each(function(d){
    var bbox = this.getBBox();
    var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
    graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                      "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal, "graph": d.groupnumber});
    container.append("circle")
                .attr("id", "moveButton")
                .attr("cx", bbox.x+r/2)
                .attr("cy", bbox.y+r/2)
                .attr("r", r/2)
                .attr("fill", "black")
                .attr("graph", d.groupnumber)
                .call(dragGraph);
  });

  force = d3.layout.force()
                .size([width, height])
                .friction(0.7)
                .on("tick", tick);

  force
    .nodes(graphArrayCoordinate.graphs)
    .start();
}
window.redraw = redraw;

function release()
{
  var len = graphArrayCoordinate.graphs.length;
  for(var i = 0; i < len; i++)
  {
    graphArrayCoordinate.graphs[i].fixed = false;
  }
  force.resume();
}
window.release = release;
