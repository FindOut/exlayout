/**********************************************************************************
This function removes cycle in a connected directed graph. Vertexs are represented as
js object = {"id": id, "label": label, "rank": rank, "isDummy": boolean}. Edges are
represented as js object = {"from": id, "to": id}. The algorithm that we are using
is greedy cycle removal.
**********************************************************************************/

// Exports modules for testing
exports.cycleRemoval = function(graph){
  cycleRemoval(graph);
};

var helpFunctions = require("./helpFunctions.js");

// Removes cycle from input graph using greddy cycle removal
function cycleRemoval(graph)
{
  var temporaryNodes = (JSON.parse(JSON.stringify(graph.nodes)));
  var temporaryEdges = (JSON.parse(JSON.stringify(graph.links)));
  var edges = [];
  var node;
  var sink;
  var source;
  var ingoingEdges;
  var outgoingEdges;
  var isolated;
  var len;
  while(temporaryNodes.length > 0)
  {
    sink = helpFunctions.containsSink(temporaryNodes,temporaryEdges); //check if there is sink node
    while(sink != null)
    {
      ingoingEdges = helpFunctions.ingoing(sink,temporaryEdges);
      edges = edges.concat(ingoingEdges); //add ingoingEdges to reserved edges because sink will never be in a circle
      helpFunctions.deleteNode(sink,temporaryNodes);
      helpFunctions.deleteLinks(ingoingEdges,temporaryEdges);
      sink = helpFunctions.containsSink(temporaryNodes,temporaryEdges);
    }
    isolated = helpFunctions.isolatedNodes(temporaryNodes,temporaryEdges);  //find isolatedNodes and delete them
    len = isolated.length;
    for(var i = 0; i < len; i++)
    {
      helpFunctions.deleteNode(isolated[i],temporaryNodes);
    }
    source = helpFunctions.containsSource(temporaryNodes,temporaryEdges);
    while(source != null)
    {
      outgoingEdges = helpFunctions.outgoing(source,temporaryEdges);
      edges = edges.concat(outgoingEdges); //add all outgoingEdges to reserved edges bacause source will never be in a circle
      helpFunctions.deleteNode(source,temporaryNodes);
      helpFunctions.deleteLinks(outgoingEdges,temporaryEdges);
      source = helpFunctions.containsSource(temporaryNodes,temporaryEdges);
    }
    if(temporaryNodes.length > 0)
    {
      node = helpFunctions.maximumNode(temporaryNodes, temporaryEdges); //choose the node with the most difference between outgoingEdges and ingoingEdges
      ingoingEdges = helpFunctions.ingoing(node, temporaryEdges);
      outgoingEdges = helpFunctions.outgoing(node, temporaryEdges);
      helpFunctions.reverse(ingoingEdges);
      edges = edges.concat(outgoingEdges);
      edges = edges.concat(ingoingEdges);
      helpFunctions.deleteNode(node, temporaryNodes);
      helpFunctions.deleteLinks(ingoingEdges, temporaryEdges);
      helpFunctions.deleteLinks(outgoingEdges, temporaryEdges);
    }
  }
  graph.links = edges;
}
