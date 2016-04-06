var CycleRemoval = require("../../app/js/CycleRemoval.js");
var LongestPath = require("../../app/js/LongestPath.js");

describe("Testing layering", function(){
  it("Test uniform direction in layer", function(){
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
    };
    LongestPath.layering(graph);
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect
      (CycleRemoval.getNodeById(graph.links[i].from, graph.nodes).rank -
        CycleRemoval.getNodeById(graph.links[i].to, graph.nodes).rank)
        .not.toBeLessThan(1);
    }
  });

  it("Test uniform direction in another graph", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 3},
        {"from": 1, "to": 4},
        {"from": 1, "to": 5},
        {"from": 2, "to": 4},
        {"from": 2, "to": 6},
        {"from": 3, "to": 7},
        {"from": 3, "to": 8},
        {"from": 3, "to": 9},
        {"from": 4, "to": 8},
        {"from": 5, "to": 9},
        {"from": 6, "to": 11},
        {"from": 8, "to": 10},
        {"from": 8, "to": 11}
      ]
    };
    LongestPath.layering(graph);
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect
      (CycleRemoval.getNodeById(graph.links[i].from, graph.nodes).rank -
        CycleRemoval.getNodeById(graph.links[i].to, graph.nodes).rank)
        .not.toBeLessThan(1);
    }
  });

  it("Test uniform direction in bigger graph", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "isDummy": false},
        {"id": 12, "label": "L", "rank": 0, "isDummy": false},
        {"id": 13, "label": "M", "rank": 0, "isDummy": false},
        {"id": 14, "label": "N", "rank": 0, "isDummy": false},
        {"id": 15, "label": "O", "rank": 0, "isDummy": false},
        {"id": 16, "label": "P", "rank": 0, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 14},
        {"from": 1, "to": 9},
        {"from": 1, "to": 15},
        {"from": 1, "to": 8},
        {"from": 2, "to": 3},
        {"from": 2, "to": 14},
        {"from": 2, "to": 10},
        {"from": 3, "to": 13},
        {"from": 3, "to": 14},
        {"from": 3, "to": 11},
        {"from": 3, "to": 15},
        {"from": 4, "to": 10},
        {"from": 4, "to": 7},
        {"from": 4, "to": 12},
        {"from": 4, "to": 9},
        {"from": 5, "to": 8},
        {"from": 6, "to": 11},
        {"from": 6, "to": 8},
        {"from": 6, "to": 10},
        {"from": 6, "to": 7},
        {"from": 7, "to": 16},
        {"from": 8, "to": 15},
        {"from": 9, "to": 16},
        {"from": 10, "to": 12},
        {"from": 10, "to": 15},
        {"from": 11, "to": 15}
      ]
    };
    LongestPath.layering(graph);
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect
      (CycleRemoval.getNodeById(graph.links[i].from, graph.nodes).rank -
        CycleRemoval.getNodeById(graph.links[i].to, graph.nodes).rank)
        .not.toBeLessThan(1);
    }
  });

  it("Test proper layering", function(){
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
    };
    LongestPath.layering(graph);
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect
      (CycleRemoval.getNodeById(graph.links[i].from, graph.nodes).rank -
        CycleRemoval.getNodeById(graph.links[i].to, graph.nodes).rank)
        .toBe(1);
    }
  });

  it("Test proper layering in another graph", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 3},
        {"from": 1, "to": 4},
        {"from": 1, "to": 5},
        {"from": 2, "to": 4},
        {"from": 2, "to": 6},
        {"from": 3, "to": 7},
        {"from": 3, "to": 8},
        {"from": 3, "to": 9},
        {"from": 4, "to": 8},
        {"from": 5, "to": 9},
        {"from": 6, "to": 11},
        {"from": 8, "to": 10},
        {"from": 8, "to": 11}
      ]
    };
    LongestPath.layering(graph);
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect
      (CycleRemoval.getNodeById(graph.links[i].from, graph.nodes).rank -
        CycleRemoval.getNodeById(graph.links[i].to, graph.nodes).rank)
        .toBe(1);
    }
  });

  it("Test proper layering in bigger graph", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "isDummy": false},
        {"id": 12, "label": "L", "rank": 0, "isDummy": false},
        {"id": 13, "label": "M", "rank": 0, "isDummy": false},
        {"id": 14, "label": "N", "rank": 0, "isDummy": false},
        {"id": 15, "label": "O", "rank": 0, "isDummy": false},
        {"id": 16, "label": "P", "rank": 0, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 14},
        {"from": 1, "to": 9},
        {"from": 1, "to": 15},
        {"from": 1, "to": 8},
        {"from": 2, "to": 3},
        {"from": 2, "to": 14},
        {"from": 2, "to": 10},
        {"from": 3, "to": 13},
        {"from": 3, "to": 14},
        {"from": 3, "to": 11},
        {"from": 3, "to": 15},
        {"from": 4, "to": 10},
        {"from": 4, "to": 7},
        {"from": 4, "to": 12},
        {"from": 4, "to": 9},
        {"from": 5, "to": 8},
        {"from": 6, "to": 11},
        {"from": 6, "to": 8},
        {"from": 6, "to": 10},
        {"from": 6, "to": 7},
        {"from": 7, "to": 16},
        {"from": 8, "to": 15},
        {"from": 9, "to": 16},
        {"from": 10, "to": 12},
        {"from": 10, "to": 15},
        {"from": 11, "to": 15}
      ]
    };
    LongestPath.layering(graph);
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect
      (CycleRemoval.getNodeById(graph.links[i].from, graph.nodes).rank -
        CycleRemoval.getNodeById(graph.links[i].to, graph.nodes).rank)
        .toBe(1);
    }
  });
});
