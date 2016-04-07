var CycleRemoval = require("./CycleRemoval.js");
var LongestPath = require("./LongestPath.js");

function vertexOrdering(graph)
{
  var changed = false;
  setInitialOrder(graph);
  console.log(graph);
  downwardSorting(graph);
  console.log(graph);
  upwardSorting(graph);
  console.log(graph);
  /*while(true)
  {
    if(!upwardSorting(graph))
    {
      if(!downwardSorting(graph))
      {
        break;
      }
    }else{
      downwardSorting(graph);
    }
  }*/
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
      layer2[i].order = 1;
    }else{
      layer2[i].order = position.sort()[Math.floor(len1/2)];
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
        layer2[i].order = 1;
      }else{
        layer2[i].order = position.sort()[Math.floor(len1/2)];
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
  var currentRank = 1;
  var layer1 = getLayer(graph, currentRank);
  var layer2 = getLayer(graph, ++currentRank);
  var changed = false;
  var before;
  var efter;
  var edges;
  var len1;
  var len2;
  var position = [];
  len2 = layer2.length;
  for(var i = 0; i < len2; i++)
  {
    edges = CycleRemoval.outgoing(layer2[i], graph.links);
    len1 = edges.length;
    for(var j = 0; j < len1; j++)
    {
      position.push(CycleRemoval.getNodeById(edges[j].to, graph.nodes).order);
    }
    if(len1 == 0)
    {
      layer2[i].order = 1;
    }else{
      layer2[i].order = position.sort()[Math.floor(len1/2)];
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
  before = numberOfCrossing(layer2, graph);
  for(i = 1; i <= len2; i++)
  {
    layer2[i-1].order = i;
  }
  efter = numberOfCrossing(layer2, graph);
  if((before-efter) != 0)
  {
    changed = true;
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
      for(j = 0; j < len1; j++)
      {
        position.push(CycleRemoval.getNodeById(edges[j].to, graph.nodes).order);
      }
      if(len1 == 0)
      {
        layer2[i].order = 1;
      }else{
        layer2[i].order = position.sort()[Math.floor(len1/2)];
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
    before = numberOfCrossing(layer2, graph);
    for(i = 1; i <= len2; i++)
    {
      layer2[i-1].order = i;
    }
    efter = numberOfCrossing(layer2, graph);
    if((before-efter) != 0)
    {
      changed = true;
    }
    layer1 = layer2;
    layer2 = getLayer(graph, ++currentRank);
    len1 = len2;
    len2 = layer2.length;
  }
  return changed;
}

function downwardSorting(graph)
{
  var currentRank = 0;
  var changed = false;
  var before;
  var efter;
  var edges;
  var len1;
  var len2;
  var position = [];
  len1 = graph.nodes.length;
  for(var i = 0; i < len1; i++)
  {
    if(graph.nodes[i].rank > currentRank)
    {
      currentRank = graph.nodes[i].rank;
    }
  }
  var layer2 = getLayer(graph, currentRank);
  var layer1 = getLayer(graph, --currentRank);
  len1 = layer1.length;
  for(i = 0; i < len1; i++)
  {
    edges = CycleRemoval.ingoing(layer1[i] , graph.links);
    len2 = edges.length;
    for(var j = 0; j < len2; j++)
    {
      position.push(CycleRemoval.getNodeById(edges[j].from, graph.nodes).order);
    }
    if(len2 == 0)
    {
      layer1[i].order = 1;
    }else{
      layer1[i].order = position.sort()[Math.floor(len2/2)];
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
      if(CycleRemoval.outgoing(a, graph.links).length % 2 == 1)
      {
        return -1;
      }else{
        return 1;
      }
    }
  });
  before = numberOfCrossing(layer2, graph);
  for(i = 1; i <= len1; i++)
  {
    layer1[i-1].order = i;
  }
  efter = numberOfCrossing(layer2, graph);
  if((before-efter) != 0)
  {
    changed = true;
  }
  layer2 = layer1;
  layer1 = getLayer(graph, --currentRank);
  len2 = len1;
  len1 = layer1.length;
  while(len1 > 0)
  {
    for(i = 0; i < len1; i++)
    {
      edges = CycleRemoval.ingoing(layer1[i], graph.links);
      len2 = edges.length;
      for(var j = 0; j < len2; j++)
      {
        position.push(CycleRemoval.getNodeById(edges[j].from, graph.nodes).order);
      }
      if(len2 == 0)
      {
        layer1[i].order = 1;
      }else{
        layer1[i].order = position.sort()[Math.floor(len2/2)];
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
        if(CycleRemoval.outgoing(a, graph.links).length % 2 == 1)
        {
          return -1;
        }else{
          return 1;
        }
      }
    });
    before = numberOfCrossing(layer2, graph);
    for(i = 1; i <= len1; i++)
    {
      layer1[i-1].order = i;
    }
    efter = numberOfCrossing(layer2, graph);
    if((before-efter) != 0)
    {
      changed = true;
    }
    layer2 = layer1;
    layer1 = getLayer(graph, --currentRank);
    len2 = len1;
    len1 = layer1.length;
  }
  return changed;
}

function numberOfCrossing(layer, graph)
{
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

var graph = {
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
    {"id": 11, "label": "K", "rank": 0, "order": 0, "isDummy": false}
  ],
  "links": [
    {"from": 1, "to": 3},
    {"from": 1, "to": 4},
    {"from": 1, "to": 5},
    {"from": 2, "to": 4},
    {"from": 2, "to": 6},
    {"from": 3, "to": 7},
    {"from": 3, "to": 8},
    {"from": 3, "to": 9},
    {"from": 4, "to": 8},
    {"from": 5, "to": 9},
    {"from": 6, "to": 11},
    {"from": 8, "to": 10},
    {"from": 8, "to": 11}
  ]
};
LongestPath.layering(graph);
vertexOrdering(graph);
