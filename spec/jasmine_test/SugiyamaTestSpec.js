/*
Criterias for a good graph layout:
Edge crossings: A drawing with few edge crossings is easier to read and follow than one
with many.

Bounding box of graph: A drawing should be as small as possible while maintaining
readability.

Simple edges: Angles of edge bends should be minimised to improve readability. Angles
of more than 90 degrees should be avoided.

Length of edges: The length of edges should be minimised. A drawing with a lot of long
edges can be hard to follow.

Graph flow:  The flow of the graph should be preserved meaning edges should point in a
uniform direction.

Symmetry A drawing should ideally show the underlying symmetry of the graph. However,
there are no easily deduced automatic measures for symmetry.

*/
var CycleRemoval = require("../../app/js/CycleRemoval.js");
var LongestPath = require("../../app/js/LongestPath.js");
var VertexOrdering = require("../../app/js/VertexOrdering.js");
var XcoordinateAssigment = require("../../app/js/XcoordinateAssignment.js");
var Sugiyama = require("../../app/js/Sugiyama.js");

var Initialize = require("../../app/js/Initialize.js");
describe("Sugiyama integration test", function(){
  it("Test rate of reduced crossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3},
        {"from": 2, "to": 5},
        {"from": 2, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 5},
        {"from": 5, "to": 6},
        {"from": 7, "to": 4}
      ]
    }
    var leastRate = 0.2;
    Initialize.initialize(graph);
    var originalCrossing = VertexOrdering.getTotalCrossing(graph);
    var changedGraph = Sugiyama.sugiyama(graph);
    var reducedCrossing = VertexOrdering.getTotalCrossing(changedGraph);
    var reducingRate = reducedCrossing/originalCrossing;
    expect(reducingRate).not.toBeLessThan(leastRate);
  });

  it("Test bounding box of graph by density", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7}
      ]
    };
    var leastDensity = 0.3;
    var changedGraph = Sugiyama.sugiyama(graph);
    var area = getArea(changedGraph);
    var density = graph.nodes.length / area;
    expect(density).not.toBeLessThan(leastDensity);
  });

  it("minimization of angles of edge bends", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7}
      ]
    };
    var changedGraph = Sugiyama.sugiyama(graph);
    for(var i = 0; i < changedGraph.nodes.legth; i++)
    {
      if(graph.nodes[i].isDummy == true)
      {
        var dummynode = graph.nodes[i];
        var ingoingEdges = CycleRemoval.ingoing(dummynode, graph.links);
        var fatherOfDummy = CycleRemoval.getNodeById(ingoingEdges[0].from, graph.nodes);
        var outgoingEdges = CycleRemoval.outgoing(dummynode, graph.links);
        var childOfDummy = CycleRemoval.getNodeById(outgoingEdges[0].to, graph.nodes);
        var x = Math.sqrt(Math.pow((dummynode.x - fatherOfDummy.x), 2) + Math.pow((dummynode.rank - fatherOfDummy.rank), 2));
        var z = Math.sqrt(Math.pow((dummynode.x - childOfDummy.x), 2) + Math.pow((dummynode.rank - childOfDummy.rank), 2));
        var y = Math.sqrt(Math.pow((fatherOfDummy.x - childOfDummy.x), 2) + Math.pow((fatherOfDummy.rank - childOfDummy.rank), 2));
        var angelOfbend = Math.acos((Math.pow(x, 2) + Math.pow(z, 2) - Math.pow(y, 2))/ (2*x*z));
        expect(angelOfbend).not.toBeLessThan(Math.PI/2);
      }
    }


  });



  function getArea(graph){
    var maxX = Number.MIN_VALUE;
    var minX = Number.MAX_VALUE;
    var maxY= Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;
    len = graph.nodes.length;
    for(var i = 0; i < len; i++)
    {
      if(graph.nodes[i].x > maxX)
      {
        maxX = graph.nodes[i].x;
      }else if(graph.nodes[i].x < minX){
        minX = graph.nodes[i].x;
      }
      if(graph.nodes[i].rank > maxY)
      {
        maxY = graph.nodes[i].rank;
      }else if(graph.nodes[i].rank < minY){
        minY = graph.nodes[i].rank;
      }
    }

    var width = maxX-minX;
    var height = maxY-minY;
    return width*height;
  }











});
