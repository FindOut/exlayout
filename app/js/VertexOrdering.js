/*******************************************************************************
This class uses median with transpose to calculate order for each node in all
layer. The algorithm set one layers order to be fixed and tries to permutate
second layer to minimize number of crossing. This algorithm uses median order of
its neighbor to get order for itself. When we run the algoritm for the first time.
We pick random order for its first layer. When sorting upward we set lower layers
order to be fixed. When sorting downward we set upper layers order to be fixed.
After each sorting we run the transpose function to reduce crossing that are
obvious. The algorithm runs until upwardSorting and downwardSorting can not
reduce number of crossing furhter.
*******************************************************************************/
var CycleRemoval = require("./CycleRemoval.js");
var LongestPath = require("./LongestPath.js");

exports.vertexOrdering = function(graph){
  return vertexOrdering(graph);
};

exports.getLayer = function(graph, layer){
  return getLayer(graph, layer);
};

// This function calculates order each node in every layer
function vertexOrdering(graph)
{
  var a;
  var before;
  var efter;
  var i;
  var layer;
  var copyGraph;
  setInitialOrder(graph);
  a = getTotalCrossing(graph);
  do{

    before = getTotalCrossing(graph);
    copyGraph = upwardSorting(graph);
    efter = getTotalCrossing(copyGraph);
    if(efter < before)
    {
      graph = copyGraph;
    }
    transpose(graph);
    if(getTotalCrossing(graph) < efter){
      efter = getTotalCrossing(graph);
    }

    copyGraph = downwardSorting(graph);
    if(getTotalCrossing(copyGraph) < efter)
    {
      graph = copyGraph;
    }
    efter = getTotalCrossing(copyGraph);
    transpose(graph);
    if(getTotalCrossing(graph) < efter){
      efter = getTotalCrossing(graph);
    }

  }while(before != efter)
  return a - getTotalCrossing(graph);
}

// setInitialOrder is an upwardSorting but first layers order is set to be random
function setInitialOrder(graph){
  var currentRank = 1;
  var layer1 = getLayer(graph, currentRank);
  var layer2 = getLayer(graph, ++currentRank);
  var edges;
  var len1 = layer1.length;
  var len2;
  var position = [];
  for(var i = 1; i <= len1; i++)
  {
    layer1[i-1].order = i;
  }
  len2 = layer2.length;
  for(i = 0; i < len2; i++)
  {
    edges = CycleRemoval.outgoing(layer2[i], graph.links);
    len1 = edges.length;
    for(var j = 0; j < len1; j++)
    {
      position.push(CycleRemoval.getNodeById(edges[j].to, graph.nodes).order);
    }
    if(len1 == 0)
    {
      layer2[i].order = 0;
    }else{
      position.sort();
      if(len1 % 2 == 1)
      {
        layer2[i].order = position[Math.floor(len1/2)];
      }else{
        layer2[i].order = (position[len1/2]+position[len1/2-1])/2;
      }
    }
    position = [];
  }
  layer2.sort(function(a,b){
    if(a.order < b.order)
    {
      return -1;
    }else if(a.order > b.order){
      return 1;
    }else{
      if(CycleRemoval.outgoing(a, graph.links).length % 2 == 1)
      {
        return -1;
      }else{
        return 1;
      }
    }
  });
  for(var i = 1; i <= len2; i++)
  {
    layer2[i-1].order = i;
  }
  layer1 = layer2;
  layer2 = getLayer(graph, ++currentRank);
  len1 = len2;
  len2 = layer2.length;
  while(len2 > 0)
  {
    for(i = 0; i < len2; i++)
    {
      edges = CycleRemoval.outgoing(layer2[i], graph.links);
      len1 = edges.length;
      for(var j = 0; j < len1; j++)
      {
        position.push(CycleRemoval.getNodeById(edges[j].to, graph.nodes).order);
      }
      if(len1 == 0)
      {
        layer2[i].order = 0;
      }else{
        position.sort();
        if(len1 % 2 == 1)
        {
          layer2[i].order = position[Math.floor(len1/2)];
        }else{
          layer2[i].order = (position[len1/2]+position[len1/2-1])/2;
        }
      }
      position = [];
    }
    layer2.sort(function(a,b){
      if(a.order < b.order)
      {
        return -1;
      }else if(a.order > b.order){
        return 1;
      }else{
        if(CycleRemoval.outgoing(a, graph.links).length % 2 == 1)
        {
          return -1;
        }else{
          return 1;
        }
      }
    });
    for(var i = 1; i <= len2; i++)
    {
      layer2[i-1].order = i;
    }
    layer1 = layer2;
    layer2 = getLayer(graph, ++currentRank);
    len1 = len2;
    len2 = layer2.length;
  }
}

// upwardSorting set lower layers order to be fixed and calculate order for each
// nodes in upper layer. The method that we are using is median of its neighbor
function upwardSorting(graph)
{
  var copyGraph = (JSON.parse(JSON.stringify(graph)));
  var currentRank = 1;
  var layer1 = getLayer(copyGraph, currentRank);
  var layer2 = getLayer(copyGraph, ++currentRank);
  var edges;
  var len1;
  var len2;
  var position = [];
  len2 = layer2.length;
  for(var i = 0; i < len2; i++)
  {
    edges = CycleRemoval.outgoing(layer2[i], copyGraph.links);
    len1 = edges.length;
    for(var j = 0; j < len1; j++)
    {
      position.push(CycleRemoval.getNodeById(edges[j].to, copyGraph.nodes).order);
    }
    if(len1 == 0)
    {
      layer2[i].order = 0;
    }else{
      position.sort();
      if(len1 % 2 == 1)
      {
        layer2[i].order = position[Math.floor(len1/2)];
      }else{
        layer2[i].order = (position[len1/2]+position[len1/2-1])/2;
      }
    }
    position = [];
  }
  layer2.sort(function(a,b){
    if(a.order < b.order)
    {
      return -1;
    }else if(a.order > b.order){
      return 1;
    }else{
      if(CycleRemoval.outgoing(a, copyGraph.links).length % 2 == 1)
      {
        return -1;
      }else{
        return 1;
      }
    }
  });
  for(i = 1; i <= len2; i++)
  {
    layer2[i-1].order = i;
  }
  layer1 = layer2;
  layer2 = getLayer(copyGraph, ++currentRank);
  len1 = len2;
  len2 = layer2.length;
  while(len2 > 0)
  {
    for(i = 0; i < len2; i++)
    {
      edges = CycleRemoval.outgoing(layer2[i], copyGraph.links);
      len1 = edges.length;
      for(j = 0; j < len1; j++)
      {
        position.push(CycleRemoval.getNodeById(edges[j].to, copyGraph.nodes).order);
      }
      if(len1 == 0)
      {
        layer2[i].order = 0;
      }else{
        position.sort();
        if(len1 % 2 == 1)
        {
          layer2[i].order = position[Math.floor(len1/2)];
        }else{
          layer2[i].order = (position[len1/2]+position[len1/2-1])/2;
        }
      }
      position = [];
    }
    layer2.sort(function(a,b){
      if(a.order < b.order)
      {
        return -1;
      }else if(a.order > b.order){
        return 1;
      }else{
        if(CycleRemoval.outgoing(a, copyGraph.links).length % 2 == 1)
        {
          return -1;
        }else{
          return 1;
        }
      }
    });
    for(i = 1; i <= len2; i++)
    {
      layer2[i-1].order = i;
    }
    layer1 = layer2;
    layer2 = getLayer(copyGraph, ++currentRank);
    len1 = len2;
    len2 = layer2.length;
  }
  return copyGraph;
}


// downwardSorting set upper layers order to be fixed and calculate order for each
// nodes in lower layer. The method that we are using is median of its neighbor
function downwardSorting(graph)
{
  var copyGraph = (JSON.parse(JSON.stringify(graph)));
  var currentRank = 0;
  var edges;
  var len1;
  var len2;
  var position = [];
  len1 = copyGraph.nodes.length;
  for(var i = 0; i < len1; i++)
  {
    if(copyGraph.nodes[i].rank > currentRank)
    {
      currentRank = copyGraph.nodes[i].rank;
    }
  }
  var layer2 = getLayer(copyGraph, currentRank);
  var layer1 = getLayer(copyGraph, --currentRank);
  len1 = layer1.length;
  for(i = 0; i < len1; i++)
  {
    edges = CycleRemoval.ingoing(layer1[i] , copyGraph.links);
    len2 = edges.length;
    for(var j = 0; j < len2; j++)
    {
      position.push(CycleRemoval.getNodeById(edges[j].from, copyGraph.nodes).order);
    }
    if(len2 == 0)
    {
      layer1[i].order = 0;
    }else{
      position.sort();
      if(len2 % 2 == 1)
      {
        layer1[i].order = position[Math.floor(len2/2)];
      }else{
        layer1[i].order = (position[len2/2]+position[len2/2-1])/2;
      }
    }
    position = [];
  }
  layer1.sort(function(a,b){
    if(a.order < b.order)
    {
      return -1;
    }else if(a.order > b.order){
      return 1;
    }else{
      if(CycleRemoval.outgoing(a, copyGraph.links).length % 2 == 1)
      {
        return -1;
      }else{
        return 1;
      }
    }
  });
  for(i = 1; i <= len1; i++)
  {
    layer1[i-1].order = i;
  }
  layer2 = layer1;
  layer1 = getLayer(copyGraph, --currentRank);
  len2 = len1;
  len1 = layer1.length;
  while(len1 > 0)
  {
    for(i = 0; i < len1; i++)
    {
      edges = CycleRemoval.ingoing(layer1[i], copyGraph.links);
      len2 = edges.length;
      for(var j = 0; j < len2; j++)
      {
        position.push(CycleRemoval.getNodeById(edges[j].from, copyGraph.nodes).order);
      }
      if(len2 == 0)
      {
        layer1[i].order = 0;
      }else{
        position.sort();
        if(len2 % 2 == 1)
        {
          layer1[i].order = position[Math.floor(len2/2)];
        }else{
          layer1[i].order = (position[len2/2]+position[len2/2-1])/2;
        }
      }
      position = [];
    }
    layer1.sort(function(a,b){
      if(a.order < b.order)
      {
        return -1;
      }else if(a.order > b.order){
        return 1;
      }else{
        if(CycleRemoval.outgoing(a, copyGraph.links).length % 2 == 1)
        {
          return -1;
        }else{
          return 1;
        }
      }
    });
    for(i = 1; i <= len1; i++)
    {
      layer1[i-1].order = i;
    }
    layer2 = layer1;
    layer1 = getLayer(copyGraph, --currentRank);
    len2 = len1;
    len1 = layer1.length;
  }
  return copyGraph;
}

// Transpose function reduces obvious crossing. This function checks if order
// changed between two node beside each other will reduce the crossing.
function transpose(graph)
{
  var improved = true;
  var rank;
  var layer;
  var len;
  var node;
  var node1;
  var node2;
  var order;
  while(improved)
  {
    improved = false;
    rank = 2;
    layer = getLayer(graph, rank);
    layer.sort(function(a,b){
      return a.order - b.order;
    });
    len = layer.length;
    while(len > 0)
    {
      for(var i = 0; i < len-1; i++)
      {
        node1 = layer[i];
        node2 = layer[i+1];
        if(getNodeCrossing(node1,node2,graph) > getNodeCrossing(node2,node1,graph))
        {
          improved = true;
          order = node1.order;
          node1.order = node2.order;
          node2.order = order;
          node = node1;
          layer[i] = node2;
          layer[i+1] = node;
        }
      }
      rank++;
      layer = getLayer(graph, rank);
      layer.sort(function(a,b){
        return a.order - b.order;
      });
      len = layer.length;
    }
  }
}

// Inputs node1(node with lower order), node2(node with higher order) and the
// graph. Outputs number of crossing for node1s outgoingEdges and node2s
// outgoingEdges.
function getNodeCrossing(node1, node2, graph)
{
  var number = 0;
  var edges1 = CycleRemoval.outgoing(node1, graph.links);
  var edges2 = CycleRemoval.outgoing(node2, graph.links);
  var len1 = edges1.length;
  var len2 = edges2.length;
  var node;
  for(var a = 0; a < len1; a++)
  {
    node = CycleRemoval.getNodeById(edges1[a].to, graph.nodes);
    for(var b = 0; b < len2; b++)
    {
      if(node.order > CycleRemoval.getNodeById(edges2[b].to, graph.nodes).order)
      {
        number++;
      }
    }
  }
  return number;
}

// Inputs layer that is array of node and the graph. Outsputs number of crossing
// between input layer and its lower layer
function getLayerCrossing(layer, graph)
{
  layer.sort(function(a,b){
    return a.order - b.order;
  });
  var len = layer.length;
  var number = 0;
  var edges1;
  var edges2;
  var len1;
  var len2;
  var node
  for(var i = 0; i < len; i++)
  {
    edges1 = CycleRemoval.outgoing(layer[i], graph.links);
    len1 = edges1.length;
    for(var j = i+1; j < len; j++)
    {
      edges2 = CycleRemoval.outgoing(layer[j], graph.links);
      len2 = edges2.length;
      for(var a = 0; a < len1; a++)
      {
        node = CycleRemoval.getNodeById(edges1[a].to, graph.nodes);
        for(var b = 0; b < len2; b++)
        {
          if(node.order > CycleRemoval.getNodeById(edges2[b].to, graph.nodes).order)
          {
            number++;
          }
        }
      }
    }
  }
  return number;
}

// Inputs graph. Outputs number of crossing for the graph
function getTotalCrossing(graph)
{
  var total = 0;
  var i = 2;
  var layer;
  while(true)
  {
    layer = getLayer(graph, i++);
    if(layer.length > 0)
    {
      total += getLayerCrossing(layer, graph);
    }else{
      break;
    }
  }
  return total;
}

// Inputs graph and layer as integer. Returns array of nodes that is in this
// layer.
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
