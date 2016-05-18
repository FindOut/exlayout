var LongestPath = require("../../app/js/LongestPath.js");

describe("Test all functions in LongestPath", function(){
  it("Test addDummy function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 4, "isDummy": false},
        {"id": 2, "label": "B", "rank": 1, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 2}
      ]
    };
    LongestPath.addDummy(graph);
    graph.nodes.sort(function(a,b){
      return a.id - b.id;
    });
    var len = graph.links.length;
    var from = 1;
    for(var i = 0; i < len; i++)
    {
      if(graph.links[i].from == from)
      {
        if(graph.nodes[graph.links[i].to-1].isDummy)
        {
          expect(graph.nodes[from-1].rank-graph.nodes[graph.links[i].to-1].rank)
            .toBe(1);
          from = graph.links[i].to;
        }else{
          expect(graph.nodes[from-1].rank-graph.nodes[graph.links[i].to-1].rank)
            .toBe(1);
          expect(graph.links[i].to).toBe(2);
        }
      }
    }
  });

  it("Test promoteVertex function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 4, "isDummy": false},
        {"id": 2, "label": "B", "rank": 3, "isDummy": false},
        {"id": 3, "label": "C", "rank": 2, "isDummy": false},
        {"id": 4, "label": "D", "rank": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 1, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 4},
        {"from": 1, "to": 4},
        {"from": 1, "to": 3},
        {"from": 3, "to": 4},
        {"from": 3, "to": 5}
      ]
    };
    var diff = LongestPath.promoteVertex(graph.nodes[3], graph);
    expect
      (diff).toBeLessThan(0);
    graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 4, "isDummy": false},
        {"id": 2, "label": "B", "rank": 1, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 2}
      ]
    };
    diff = LongestPath.promoteVertex(graph.nodes[1], graph);
    expect
      (diff).toBeLessThan(0);
  });

  it("Test vertexPromotion function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 4, "isDummy": false},
        {"id": 2, "label": "B", "rank": 3, "isDummy": false},
        {"id": 3, "label": "C", "rank": 2, "isDummy": false},
        {"id": 4, "label": "D", "rank": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 1, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 4},
        {"from": 1, "to": 4},
        {"from": 1, "to": 3},
        {"from": 3, "to": 4},
        {"from": 3, "to": 5}
      ]
    };
    var copyGraph = (JSON.parse(JSON.stringify(graph)));
    LongestPath.vertexPromotion(graph);
    var before = 0;
    var after = 0;
    var len1;
    var len2;
    LongestPath.vertexPromotion(copyGraph);
    LongestPath.vertexPromotion(graph);
    LongestPath.addDummy(copyGraph);
    LongestPath.addDummy(graph);
    len1 = copyGraph.nodes.length;
    len2 = graph.nodes.length;
    for(var i = 0; i < len1; i++)
    {
      if(copyGraph.nodes[i].isDummy)
      {
        before++;
      }
    }
    for(i = 0; i < len2; i++)
    {
      if(graph.nodes[i].isDummy)
      {
        after++;
      }
    }
    expect(after-before).not.toBeLessThan(0);
  });
});
