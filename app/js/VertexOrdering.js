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

exports.vertexOrdering = function(graph){
  return vertexOrdering(graph);
};
exports.setInitialOrder = function(graph){
  setInitialOrder(graph);
};
exports.upwardSorting = function(graph){
  return upwardSorting(graph);
};
exports.downwardSorting = function(graph){
  return downwardSorting(graph);
};
exports.transpose = function(graph){
  transpose(graph);
};

var helpFunctions = require("./helpFunctions.js");

// This function calculates order each node in every layer
function vertexOrdering(graph)
{
  var a;
  var before;
  var efter;
  var i;
  var layer;
  var copyGraph;
  setInitialOrder(graph); // Give initial order to every nodes
  a = helpFunctions.getTotalCrossing(graph); // Get total crossing of the graph before improvement
  do{

    before = helpFunctions.getTotalCrossing(graph); // Total crossing before each upwardSorting
    copyGraph = upwardSorting(graph); // Sort the graph upward using median method
    efter = helpFunctions.getTotalCrossing(copyGraph); // Total crossing after each upwardSorting
    if(efter < before) // If we reduced crossing
    {
      graph = copyGraph; // Set graph order to the new one
    }
    transpose(graph); // Check for obvious crossing minimization
    if(helpFunctions.getTotalCrossing(graph) < efter) // If we reduced crossing
    {
      efter = helpFunctions.getTotalCrossing(graph); // Total crossing after sorting and transpose function
    }

    copyGraph = downwardSorting(graph); // Sort the graph downward using median method
    if(helpFunctions.getTotalCrossing(copyGraph) < efter) // If we reduced crossing
    {
      graph = copyGraph; // Set graph order to the new one
    }
    efter = helpFunctions.getTotalCrossing(copyGraph); // Total crossing after each downwardSorting
    transpose(graph); // Check for obvios crossing minimization
    if(helpFunctions.getTotalCrossing(graph) < efter) // If we reduced crossing
    {
      efter = helpFunctions.getTotalCrossing(graph); // Total crossing after sorting and transpose function
    }

  }while(before != efter) // Continue crossing reduction while we can imporve the graph
  return a - helpFunctions.getTotalCrossing(graph); // Return total number of minimized crossing for the algorithm
}

// setInitialOrder is an upwardSorting but first layers order is set to be random
function setInitialOrder(graph){
  var currentRank = 1;
  var layer1 = helpFunctions.getLayer(graph, currentRank);
  var layer2 = helpFunctions.getLayer(graph, ++currentRank);
  var edges;
  var len1 = layer1.length;
  var len2;
  var position = [];
  // Give random order for layer1
  for(var i = 1; i <= len1; i++)
  {
    layer1[i-1].order = i;
  }
  // Give order for layer2 based on median method
  len2 = layer2.length;
  for(i = 0; i < len2; i++)
  {
    edges = helpFunctions.outgoing(layer2[i], graph.links);
    len1 = edges.length;
    for(var j = 0; j < len1; j++)
    {
      position.push(helpFunctions.getNodeById(edges[j].to, graph.nodes).order);
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
      if(helpFunctions.outgoing(a, graph.links).length % 2 == 1)
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
  // Move layer1 and layer2 one layer upward
  layer1 = layer2;
  layer2 = helpFunctions.getLayer(graph, ++currentRank);
  len1 = len2;
  len2 = layer2.length;
  while(len2 > 0)
  {
    for(i = 0; i < len2; i++)
    {
      edges = helpFunctions.outgoing(layer2[i], graph.links);
      len1 = edges.length;
      for(var j = 0; j < len1; j++)
      {
        position.push(helpFunctions.getNodeById(edges[j].to, graph.nodes).order);
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
        if(helpFunctions.outgoing(a, graph.links).length % 2 == 1)
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
    layer2 = helpFunctions.getLayer(graph, ++currentRank);
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
  var layer1 = helpFunctions.getLayer(copyGraph, currentRank);
  var layer2 = helpFunctions.getLayer(copyGraph, ++currentRank);
  var edges;
  var len1;
  var len2;
  var position = [];
  // Give order to layer2 based on median method
  len2 = layer2.length;
  for(var i = 0; i < len2; i++)
  {
    edges = helpFunctions.outgoing(layer2[i], copyGraph.links);
    len1 = edges.length;
    for(var j = 0; j < len1; j++)
    {
      position.push(helpFunctions.getNodeById(edges[j].to, copyGraph.nodes).order);
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
      if(helpFunctions.outgoing(a, copyGraph.links).length % 2 == 1)
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
  // Move layer1 and layer2 up by one layer and continue median method
  layer1 = layer2;
  layer2 = helpFunctions.getLayer(copyGraph, ++currentRank);
  len1 = len2;
  len2 = layer2.length;
  while(len2 > 0)
  {
    for(i = 0; i < len2; i++)
    {
      edges = helpFunctions.outgoing(layer2[i], copyGraph.links);
      len1 = edges.length;
      for(j = 0; j < len1; j++)
      {
        position.push(helpFunctions.getNodeById(edges[j].to, copyGraph.nodes).order);
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
        if(helpFunctions.outgoing(a, copyGraph.links).length % 2 == 1)
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
    layer2 = helpFunctions.getLayer(copyGraph, ++currentRank);
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
  // Give order to layer1 based on median method
  var layer2 = helpFunctions.getLayer(copyGraph, currentRank);
  var layer1 = helpFunctions.getLayer(copyGraph, --currentRank);
  len1 = layer1.length;
  for(i = 0; i < len1; i++)
  {
    edges = helpFunctions.ingoing(layer1[i] , copyGraph.links);
    len2 = edges.length;
    for(var j = 0; j < len2; j++)
    {
      position.push(helpFunctions.getNodeById(edges[j].from, copyGraph.nodes).order);
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
      if(helpFunctions.outgoing(a, copyGraph.links).length % 2 == 1)
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
  // Move layer1 and layer2 down by one layer
  layer2 = layer1;
  layer1 = helpFunctions.getLayer(copyGraph, --currentRank);
  len2 = len1;
  len1 = layer1.length;
  while(len1 > 0)
  {
    for(i = 0; i < len1; i++)
    {
      edges = helpFunctions.ingoing(layer1[i], copyGraph.links);
      len2 = edges.length;
      for(var j = 0; j < len2; j++)
      {
        position.push(helpFunctions.getNodeById(edges[j].from, copyGraph.nodes).order);
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
        if(helpFunctions.outgoing(a, copyGraph.links).length % 2 == 1)
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
    layer1 = helpFunctions.getLayer(copyGraph, --currentRank);
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
    layer = helpFunctions.getLayer(graph, rank);
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
        if(helpFunctions.getNodeCrossing(node1,node2,graph) > helpFunctions.getNodeCrossing(node2,node1,graph)) // Check if we can minimize crossing by simply swapping two next to each other
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
      layer = helpFunctions.getLayer(graph, rank);
      layer.sort(function(a,b){
        return a.order - b.order;
      });
      len = layer.length;
    }
  }
}
