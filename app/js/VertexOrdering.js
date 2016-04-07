function vertexOrdering(graph)
{

}

function setInitialOrder(graph){
  var currentRank = 1;
  var layer1 = getLayer(graph, currentRank);
  var layer2 = getLayer(graph, ++currentRank);
  var currentCrossing;
  var len = layer1.legnth;
  for(var i = 1; i <= len; i++)
  {
    layer1[i].order = i;
  }
}

function getLayer(graph, layer){
  var result = [];
  var len = graph.nodes.length;
  for(var i = 0; i < len; i++)
  {
    if(graph.nodes[i].rank == layer)
    {
      result.push(graph.nodes[i]);
    }
  }
  return result;
}
