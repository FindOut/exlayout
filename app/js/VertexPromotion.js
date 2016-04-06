var CycleRemoval = require("CycleRemoval.js");

function PromoteVertex(node, graph)
{
  var dummyDiff = 0;
  var neighbor = CycleRemoval.ingoing(node, graph.links);
  var len = neighbor.length;
  var v;
  for(var i = 0; i < len; i++)
  {
    v = CycleRemoval.getNodeById(neighbor[i].from);
    if(v.rank == node.rank+1)
    {
      dummyDiff = dummyDiff + PromoteVertex(v, graph);
    }
  }
  node.rank = node.rank + 1;
  dummyDiff = dummyDiff -
  CycleRemoval.ingoing(node, graph.links).length +
  CycleRemoval.outgoing(node, graph.links).length;
  return dummyDiff;
}
