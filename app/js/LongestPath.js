/**********************************************************************************
This function converts DAG to layred DAG. Vertexs are represented asjs object =
{"id": id, "label": label, "rank": rank, "isDummy": boolean}. Edges arerepresented
as js object = {"from": id, "to": id}. The algorithm that we are using LongestPath
algorithm. Efterwards we use vertex promotion to try minimize number of dummyNode
and dummyLink. In the last step we add dummyNode and dummyLink between all nodes
with layer difference bigger than 1.
**********************************************************************************/

// Exports function for testing
exports.layering = function(graph){
  return layering(graph);
}

exports.addDummy = function(graph){
  return addDummy(graph);
}

exports.promoteVertex = function(node, graph){
  return promoteVertex(node, graph);
}

exports.vertexPromotion = function(graph){
  return vertexPromotion(graph);
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
  vertexPromotion(graph);
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
  var isReversed;
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
    isReversed = link.isReversed;
    if(diff > 1)
    {
      CycleRemoval.deleteLinks([link], graph.links);
      i--;
      dummyNode = {"id": ++max, "label": "", "rank": node.rank+1, "order": 0, "isDummy": true};
      dummyLink = {"from": max, "to": link.to, "ismark": false, "isReversed": isReversed};
      graph.nodes.push(dummyNode);
      graph.links.push(dummyLink);
      for(var j = 2; j < diff; j++)
      {
        dummyNode = {"id": ++max, "label": "", "rank": node.rank+j, "order": 0, "isDummy": true};
        dummyLink = {"from": max, "to": max-1, "ismark": false, "isReversed": isReversed};
        graph.nodes.push(dummyNode);
        graph.links.push(dummyLink);
      }
      dummyLink = {"from": link.from, "to": max, "ismark": false, "isReversed": isReversed};
      graph.links.push(dummyLink);
    }
  }
}

//promote Vertex recursivly to Calculate dummy diff
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

//test promotion with each vertex, and save the promotion result with reduced vertex
//otherwise roll it back. repeat until no dummy will be reduced.
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
        if(promoteVertex(graph.nodes[i], graph) < 0)
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

/*var graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "isDummy": false},
    {"id": 8, "label": "H", "rank": 0, "isDummy": false},
    {"id": 9, "label": "I", "rank": 0, "isDummy": false},
    {"id": 10, "label": "J", "rank": 0, "isDummy": false},
    {"id": 11, "label": "K", "rank": 0, "isDummy": false}
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

layering(graph);
console.log(graph);*/
