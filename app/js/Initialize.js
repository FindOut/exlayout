exports.initialize = function(graph){
  initialize(graph);
};

function initialize(graph){
  var nodesLength = graph.nodes.length;
  var linksLength = graph.links.length;
  for(var i = 0; i < nodesLength; i++)
  {
    graph.nodes[i].rank = 0;
    graph.nodes[i].order = 0;
    graph.nodes[i].isDummy = false;
    graph.nodes[i].group = 0;
  }
  for(i = 0; i < linksLength; i++)
  {
    graph.links[i].ismark = false;
    graph.links[i].isReversed = false;
  }
}
