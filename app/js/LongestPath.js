var CycleRemoval = require("./CycleRemoval");

function layering(graph)
{
  var edges;
  var maxRank = -1;
  var currentRank;
  var len;
  var sortedVertex = CycleRemoval.topologicalOrder(graph.nodes, graph.links);
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
  return graph;
}

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
      graph.links = CycleRemoval.deleteLinks([link],graph.links);
      dummyNode = {"id": ++max, "label": "", "rank": node.rank+1, "isDummy": true};
      dummyLink = {"from": max, "to": link.to};
      graph.nodes.push(dummyNode);
      graph.links.push(dummyLink)
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
  return graph;
}

var graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 5, "isDummy": false},
    {"id": 2, "label": "B", "rank": 4, "isDummy": false},
    {"id": 3, "label": "C", "rank": 3, "isDummy": false},
    {"id": 4, "label": "D", "rank": 3, "isDummy": false},
    {"id": 5, "label": "E", "rank": 2, "isDummy": false},
    {"id": 6, "label": "F", "rank": 1, "isDummy": false},
    {"id": 7, "label": "G", "rank": 4, "isDummy": false}

  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 2, "to": 5},
    {"from": 2, "to": 4},
    {"from": 3, "to": 5},
    {"from": 4, "to": 5},
    {"from": 5, "to": 6},
    {"from": 7, "to": 4}
  ]
};

console.log(addDummy(layering(graph)));
