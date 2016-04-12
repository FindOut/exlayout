var connectedGraph = require("../../app/js/ConnectedGraphDetection.js");
describe("connectedGraphDetect", function(){
  it("is conneted graph detected", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 0, "isDummy": false, "group": 0},
        {"id": 2, "label": "B", "rank": 0, "isDummy": false, "group": 0},
        {"id": 3, "label": "C", "rank": 0, "isDummy": false, "group": 0},
        {"id": 4, "label": "D", "rank": 0, "isDummy": false, "group": 0},
        {"id": 5, "label": "E", "rank": 0, "isDummy": false, "group": 0},
        {"id": 6, "label": "F", "rank": 0, "isDummy": false, "group": 0},
        {"id": 7, "label": "G", "rank": 0, "isDummy": false, "group": 0},

        {"id": 8, "label": "s", "rank": 0, "isDummy": false, "group": 0},
        {"id": 9, "label": "H", "rank": 0, "isDummy": false, "group": 0},
        {"id": 10, "label": "X", "rank": 0, "isDummy": false, "group": 0}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3},
        {"from": 2, "to": 5},
        {"from": 2, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 5},
        {"from": 5, "to": 6},
        {"from": 7, "to": 4},

        {"from": 8, "to": 9},
        {"from": 9, "to": 10},
        {"from": 10, "to": 8}
      ]
    };
    connectedGraph.connectedGraphDetect(graph);
    var len = graph.nodes.length;
    for(var i = 0; i < len-3; i++)
    {
      expect
      (graph.nodes[i].group).toBe(1);
    }
    for(var i = len-3; i < len; i++)
    {
      expect
      (graph.nodes[i].group).toBe(2);
    }

  });
});
