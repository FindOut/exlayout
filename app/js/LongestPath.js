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
      CycleRemoval.deleteLinks([link],graph.links);
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
