var VertexOrdering = require("../../app/js/VertexOrdering.js");
var LongestPath = require("../../app/js/LongestPath.js");

describe("White box test for VertexOrdering", function(){
  it("Test setInitialOrder", function(){
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

  it("Test upwardSorting", function(){
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
    var before = VertexOrdering.getTotalCrossing(graph);
    var after = VertexOrdering.getTotalCrossing(newGraph);
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

  it("Test downwardSorting", function(){
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
    var before = VertexOrdering.getTotalCrossing(graph);
    var after = VertexOrdering.getTotalCrossing(newGraph);
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

  it("Test transpose", function(){
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
    var before = VertexOrdering.getTotalCrossing(graph);
    VertexOrdering.transpose(graph);
    var after = VertexOrdering.getTotalCrossing(graph);
    expect(after-before).not.toBeGreaterThan(0);
  });

  it("Test getNodeCrossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 2, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 2, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 1, "order": 1, "isDummy": false},
        {"id": 4, "label": "D", "rank": 1, "order": 2, "isDummy": false},
        {"id": 5, "label": "E", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 3},
        {"from": 1, "to": 4},
        {"from": 1, "to": 5},
        {"from": 2, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5}
      ]
    };
    expect(VertexOrdering.getNodeCrossing(graph.nodes[0], graph.nodes[1], graph))
      .toBe(3);
  });

  it("Test getLayerCrossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 2, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 2, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 2, "order": 3, "isDummy": false},
        {"id": 4, "label": "D", "rank": 1, "order": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 1, "order": 2, "isDummy": false},
        {"id": 6, "label": "F", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 4},
        {"from": 1, "to": 6},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 3, "to": 4}
      ]
    };
    expect(VertexOrdering.getLayerCrossing(VertexOrdering.getLayer(graph,2), graph))
      .toBe(4);
  });

  it("Test getTotalCrossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 3, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 3, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 3, "order": 3, "isDummy": false},
        {"id": 4, "label": "D", "rank": 2, "order": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 2, "order": 2, "isDummy": false},
        {"id": 6, "label": "F", "rank": 2, "order": 3, "isDummy": false},
        {"id": 7, "label": "G", "rank": 1, "order": 1, "isDummy": false},
        {"id": 8, "label": "H", "rank": 1, "order": 2, "isDummy": false},
        {"id": 9, "label": "I", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 4},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 3, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 9},
        {"from": 5, "to": 7},
        {"from": 5, "to": 8},
        {"from": 6, "to": 7},
        {"from": 6, "to": 8}
      ]
    };
    expect(VertexOrdering.getTotalCrossing(graph)).toBe(8);
  });

  it("Test getLayer", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 3, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 3, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 3, "order": 3, "isDummy": false},
        {"id": 4, "label": "D", "rank": 2, "order": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 2, "order": 2, "isDummy": false},
        {"id": 6, "label": "F", "rank": 2, "order": 3, "isDummy": false},
        {"id": 7, "label": "G", "rank": 1, "order": 1, "isDummy": false},
        {"id": 8, "label": "H", "rank": 1, "order": 2, "isDummy": false},
        {"id": 9, "label": "I", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 4},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 3, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 9},
        {"from": 5, "to": 7},
        {"from": 5, "to": 8},
        {"from": 6, "to": 7},
        {"from": 6, "to": 8}
      ]
    };
    var layer = VertexOrdering.getLayer(graph,1);
    expect(layer).toContain(graph.nodes[6]);
    expect(layer).toContain(graph.nodes[8]);
    layer = VertexOrdering.getLayer(graph,3);
    expect(layer).toContain(graph.nodes[0]);
    expect(layer).toContain(graph.nodes[1]);
  })
});
