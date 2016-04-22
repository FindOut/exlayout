var CycleRemoval = require("./CycleRemoval.js");

exports.getIngoingNodes = function(node, graph){
  return getIngoingNodes(node,graph);
};

exports.getOutgoingNodes = function(node, graph){
  return getOutgoingNodes(node,graph);
};

//find ingoing and outgoing edges
function getIngoingNodes(node, graph){
    var ingoingNodes = [];
    var ingoingEdges = CycleRemoval.ingoing(node, graph.links);
    for(var i = 0; i < ingoingEdges.length; i++)
    {
      var id = ingoingEdges[i].from;
      ingoingNodes.push(CycleRemoval.getNodeById(id, graph.nodes));
    }
    return ingoingNodes;
}

function getOutgoingNodes(node, graph){
    var outgoingNodes = [];
    var outgoingEdges = CycleRemoval.outgoing(node, graph.links);
    for(var i = 0; i < outgoingEdges.length; i++)
    {
      var id = outgoingEdges[i].to;
      outgoingNodes.push(CycleRemoval.getNodeById(id, graph.nodes));
    }
}
