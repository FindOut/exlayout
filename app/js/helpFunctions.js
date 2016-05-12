var CycleRemoval = require("./CycleRemoval.js");
var Sugiyama = require("./Sugiyama.js");

exports.modifiedDFS = function(start, end, graph, path){
  return modifiedDFS(start, end, graph, path);
};

exports.randomGraph = function(numberOfNodes, p){
  return randomGraph(numberOfNodes, p);
}

exports.boxGraphDataCalculater = function(boxGraphs){
  return boxGraphDataCalculater(boxGraphs);
}

function modifiedDFS(start, end, graph, path)
{
  if(path === undefined)
  {
    var a;
    var len = graph.nodes.length;
    for(var i = 0; i < len; i++)
    {
      graph.nodes[i].visited = false;
    }
    start.visited = true;
    var outgoingEdges = CycleRemoval.outgoing(start, graph.links);
    len = outgoingEdges.length;
    for(i = 0; i < len; i++)
    {
      if(CycleRemoval.getNodeById(outgoingEdges[i].to, graph.nodes).isDummy)
      {
        a = modifiedDFS(CycleRemoval.getNodeById(outgoingEdges[i].to, graph.nodes), end, graph, [CycleRemoval.getNodeById(outgoingEdges[i].to, graph.nodes)]);
        if(a.length > 0)
        {
          return a;
        }
      }
    }
    return [];
  }else{
    if(!start.visited)
    {
      start.visited = true;
      var outgoingEdges = CycleRemoval.outgoing(start, graph.links);
      len = outgoingEdges.length;
      for(i = 0; i < len; i++)
      {
        if(outgoingEdges[i].to == end.id)
        {
          return path;
        }else if(CycleRemoval.getNodeById(outgoingEdges[i].to, graph.nodes).isDummy)
        {
          path.push(CycleRemoval.getNodeById(outgoingEdges[i].to, graph.nodes));
          return modifiedDFS(CycleRemoval.getNodeById(outgoingEdges[i].to, graph.nodes), end, graph, path);
        }
      }
    }
    return [];
  }
}

function randomGraph(numberOfNodes, p)
{
  var graph = {"nodes": [], "links": []};
  for(var i = 0; i < numberOfNodes; i++)
  {
    graph.nodes.push({"id": i+1, "label": (i+1).toString()});
  }
  var neighbors = [];
  for(i = 0; i < numberOfNodes; i++)
  {
    neighbors.push([]);
  }
  for(i = 0; i < numberOfNodes; i++)
  {
    for(var j = 0; j < numberOfNodes; j++)
    {
      neighbors[i][j] = 0;
    }
  }
  for(i = 0; i < numberOfNodes; i++)
  {
    for(var j = 0; j < numberOfNodes; j++)
    {
      if(i != j)
      {
        if(Math.random() < p)
        {
          neighbors[i][j] = 1;
        }
      }
    }
  }
  for(i = 0; i < numberOfNodes; i++)
  {
    for(var j = 0; j < numberOfNodes; j++)
    {
      if(neighbors[i][j] == 1)
      {
        graph.links.push({"from": i+1, "to": j+1});
      }
    }
  }
  return graph;
}

//function boxGraphLocationCalculater calculate the postions for each boxgraph
function boxGraphDataCalculater(boxGraphs)
{
  var boxGraphDatas = [];
    for(var i = 0; i < boxGraphs.length; i++)
    {
      var currentBoxGraph = boxGraphs[i];
      var biggestY = 0;
      var biggestX = 0;
      var boxGraphData = {"x": null, "y": null, "r": null, "groupnumber":null, "box":null};
      for(var j = 0; j < currentBoxGraph.nodes.length; j++)
      {
        if(biggestY < currentBoxGraph.nodes[j].rank)
        {
          biggestY = currentBoxGraph.nodes[j].rank;
        }
        if(biggestX < currentBoxGraph.nodes[j].order)
        {
          biggestX = currentBoxGraph.nodes[j].order;
        }
      }
      var radius = Math.sqrt(biggestX*biggestX + biggestY*biggestY)/2;
      boxGraphData.x = biggestX;
      boxGraphData.y = biggestY;
      boxGraphData.r = radius;
      boxGraphData.groupnumber = currentBoxGraph.groupnumber;
      boxGraphData.box = currentBoxGraph.box;
      boxGraphDatas.push(boxGraphData);
    }
  return boxGraphDatas;
}
