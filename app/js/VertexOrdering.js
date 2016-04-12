var CycleRemoval = require("./CycleRemoval.js");
var LongestPath = require("./LongestPath.js");

exports.vertexOrdering = function(graph){
  return vertexOrdering(graph);
};

exports.getLayer = function(graph, layer){
  return getLayer(graph, layer);
};

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

/*var graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false},
    {"id": 8, "label": "H", "rank": 0, "order": 0, "isDummy": false},
    {"id": 9, "label": "I", "rank": 0, "order": 0, "isDummy": false},
    {"id": 10, "label": "J", "rank": 0, "order": 0, "isDummy": false},
    {"id": 11, "label": "K", "rank": 0, "order": 0, "isDummy": false},
    {"id": 12, "label": "L", "rank": 0, "order": 0, "isDummy": false},
    {"id": 13, "label": "M", "rank": 0, "order": 0, "isDummy": false},
    {"id": 14, "label": "N", "rank": 0, "order": 0, "isDummy": false},
    {"id": 15, "label": "O", "rank": 0, "order": 0, "isDummy": false},
    {"id": 16, "label": "P", "rank": 0, "order": 0, "isDummy": false}
  ],
  "links": [
    {"from": 1, "to": 14},
    {"from": 1, "to": 9},
    {"from": 1, "to": 15},
    {"from": 1, "to": 8},
    {"from": 2, "to": 3},
    {"from": 2, "to": 14},
    {"from": 2, "to": 10},
    {"from": 3, "to": 13},
    {"from": 3, "to": 14},
    {"from": 3, "to": 11},
    {"from": 3, "to": 15},
    {"from": 4, "to": 10},
    {"from": 4, "to": 7},
    {"from": 4, "to": 12},
    {"from": 4, "to": 9},
    {"from": 5, "to": 8},
    {"from": 6, "to": 11},
    {"from": 6, "to": 8},
    {"from": 6, "to": 10},
    {"from": 6, "to": 7},
    {"from": 7, "to": 16},
    {"from": 8, "to": 15},
    {"from": 9, "to": 16},
    {"from": 10, "to": 12},
    {"from": 10, "to": 15},
    {"from": 11, "to": 15}
  ]
};

LongestPath.layering(graph);
vertexOrdering(graph);
console.log(graph);*/
