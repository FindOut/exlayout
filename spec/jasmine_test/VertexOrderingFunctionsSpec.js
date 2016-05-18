var VertexOrdering = require("../../app/js/VertexOrdering.js");
var LongestPath = require("../../app/js/LongestPath.js");
var helpFunctions = require("../../app/js/helpFunctions.js")

describe("Test all functions in VertexOrdering", function(){
  it("Test setInitialOrder function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false}
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
    VertexOrdering.setInitialOrder(graph);
    var len = graph.nodes.length;
    graph.nodes.sort(function(a,b){
      if(a.rank < b.rank){
        return -1;
      }else if(a.rank > b.rank){
        return 1
      }else{
        if(a.order < b.order){
          return -1;
        }else{
          return 1;
        }
      }
    });
    var rank = 1;
    var order = 1;
    for(var i = 0; i < len; i++)
    {
      if(graph.nodes[i].rank == rank){
        expect(graph.nodes[i].order).toBe(order);
        order++;
      }else{
        rank++;
        order = 1;
        expect(graph.nodes[i].order).toBe(order);
        order++;
      }
    }
  });

  it("Test upwardSorting function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "order": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "order": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "order": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "order": 0, "isDummy": false}
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
    VertexOrdering.setInitialOrder(graph);
    var newGraph = VertexOrdering.upwardSorting(graph);
    var before = helpFunctions.getTotalCrossing(graph);
    var after = helpFunctions.getTotalCrossing(newGraph);
    expect(after-before).not.toBeGreaterThan(0);

    var len = graph.nodes.length;
    graph.nodes.sort(function(a,b){
      if(a.rank < b.rank){
        return -1;
      }else if(a.rank > b.rank){
        return 1
      }else{
        if(a.order < b.order){
          return -1;
        }else{
          return 1;
        }
      }
    });
    var rank = 1;
    var order = 1;
    for(var i = 0; i < len; i++)
    {
      if(graph.nodes[i].rank == rank){
        expect(graph.nodes[i].order).toBe(order);
        order++;
      }else{
        rank++;
        order = 1;
        expect(graph.nodes[i].order).toBe(order);
        order++;
      }
    }
  });

  it("Test downwardSorting function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "order": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "order": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "order": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "order": 0, "isDummy": false}
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
    VertexOrdering.setInitialOrder(graph);
    var newGraph = VertexOrdering.downwardSorting(graph);
    var before = helpFunctions.getTotalCrossing(graph);
    var after = helpFunctions.getTotalCrossing(newGraph);
    expect(after-before).not.toBeGreaterThan(0);

    var len = graph.nodes.length;
    graph.nodes.sort(function(a,b){
      if(a.rank < b.rank){
        return -1;
      }else if(a.rank > b.rank){
        return 1
      }else{
        if(a.order < b.order){
          return -1;
        }else{
          return 1;
        }
      }
    });
    var rank = 1;
    var order = 1;
    for(var i = 0; i < len; i++)
    {
      if(graph.nodes[i].rank == rank){
        expect(graph.nodes[i].order).toBe(order);
        order++;
      }else{
        rank++;
        order = 1;
        expect(graph.nodes[i].order).toBe(order);
        order++;
      }
    }
  });

  it("Test transpose function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
        {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
        {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
        {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
        {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
        {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
        {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false},
        {"id": 8, "label": "H", "rank": 0, "order": 0, "isDummy": false},
        {"id": 9, "label": "I", "rank": 0, "order": 0, "isDummy": false},
        {"id": 10, "label": "J", "rank": 0, "order": 0, "isDummy": false},
        {"id": 11, "label": "K", "rank": 0, "order": 0, "isDummy": false}
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
    VertexOrdering.setInitialOrder(graph);
    var before = helpFunctions.getTotalCrossing(graph);
    VertexOrdering.transpose(graph);
    var after = helpFunctions.getTotalCrossing(graph);
    expect(after-before).not.toBeGreaterThan(0);
  });
});
