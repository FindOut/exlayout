var CycleRemoval = require("./CycleRemoval.js");
var LongestPath = require("./LongestPath.js");

function promoteVertex(node, graph)
{
  var dummyDiff = 0;
  var neighbor = CycleRemoval.ingoing(node, graph.links);
  var len = neighbor.length;
  var v;
  for(var i = 0; i < len; i++)
  {
    v = CycleRemoval.getNodeById(neighbor[i].from, graph.nodes);
    if(v.rank == node.rank+1)
    {
      dummyDiff = dummyDiff + promoteVertex(v, graph);
    }
  }
  node.rank = node.rank + 1;
  dummyDiff = dummyDiff -
  CycleRemoval.ingoing(node, graph.links).length +
  CycleRemoval.outgoing(node, graph.links).length;
  return dummyDiff;
}

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
console.log(graph);
console.log(promoteVertex(graph.nodes[2],graph));
