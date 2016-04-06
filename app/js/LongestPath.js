/**********************************************************************************
This function converts DAG to layred DAG. Vertexs are represented asjs object =
{"id": id, "label": label, "rank": rank, "isDummy": boolean}. Edges arerepresented
as js object = {"from": id, "to": id}. The algorithm that we are using LongestPath
algorithm, if one edge is crossing more than two layers, we add dummyNode and
dummyLink between then so between vertex that is linked, the difference in layer
is 1.
**********************************************************************************/

// Exports function for testing
exports.layering = function(graph){
  return layering(graph);
}

// Import module
var CycleRemoval = require("./CycleRemoval");

// Calculate rank property for each node and add dummyNode and dummyLink if
// necessary. Inputs DAG, outputs layred DAG
function layering(graph)
{
  var edges;
  var maxRank = -1;
  var currentRank;
  var len;
  var sortedVertex = CycleRemoval.topologicalOrder(graph);
  for(var i = sortedVertex.length-1; i >= 0; i--)
  {
    edges = CycleRemoval.outgoing(sortedVertex[i], graph.links);
    len = edges.length;
    if(len == 0)
    {
      sortedVertex[i].rank = 1;
    }else{
      for(var j = 0; j < len; j++)
      {
        currentRank = CycleRemoval.getNodeById(edges[j].to, sortedVertex).rank;
        if(currentRank > maxRank)
        {
          maxRank = currentRank;
        }
      }
      sortedVertex[i].rank = maxRank + 1;
    }
    maxRank = -1;
  }
  graph.nodes = sortedVertex;
  addDummy(graph);
}

// Add dummyNode and dummyLink when edges are crossing more than two layers.
// Inputs layered DAG, output proper layered DAG
function addDummy(graph)
{
  var max = -1;
  var current;
  var len = graph.nodes.length;
  var diff;
  var node;
  var dummyNode;
  var dummyLink;
  var link;
  for(var i = 0; i < len; i++)
  {
    current = graph.nodes[i].id;
    if(current > max)
    {
      max = current;
    }
  }
  for(i = 0; i < graph.links.length; i++)
  {
    link = (JSON.parse(JSON.stringify(graph.links[i])));
    node = CycleRemoval.getNodeById(link.to, graph.nodes);
    diff = CycleRemoval.getNodeById(link.from, graph.nodes).rank - node.rank;
    if(diff > 1)
    {
      CycleRemoval.deleteLinks([link], graph.links);
      i--;
      dummyNode = {"id": ++max, "label": "", "rank": node.rank+1, "isDummy": true};
      dummyLink = {"from": max, "to": link.to};
      graph.nodes.push(dummyNode);
      graph.links.push(dummyLink);
      for(var j = 2; j < diff; j++)
      {
        dummyNode = {"id": ++max, "label": "", "rank": node.rank+j, "isDummy": true};
        dummyLink = {"from": max, "to": max-1};
        graph.nodes.push(dummyNode);
        graph.links.push(dummyLink);
      }
      dummyLink = {"from": link.from, "to": max};
      graph.links.push(dummyLink);
    }
  }
}

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

function vertexPromotion(graph)
{
  var backUp = (JSON.parse(JSON.stringify(graph.nodes)));
  var len = backUp.length;
  var promotions;
  var node;
  do{
    promotions = 0;
    for(var i = 0; i < len; i++)
    {
      if(CycleRemoval.ingoing(graph.nodes[i], graph.links).length > 0)
      {
        if(promoteVertex(graph.nodes[i]) < 0)
        {
          promotions = promotions + 1;
          backUp = (JSON.parse(JSON.stringify(graph.nodes)));
        }else{
          graph.nodes = (JSON.parse(JSON.stringify(backUp)));
        }
      }
    }
  }while(promotions != 0)
}
