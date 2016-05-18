var CycleRemoval = require("./CycleRemoval.js");
var Sugiyama = require("./Sugiyama.js");

exports.modifiedDFS = function(start, end, graph, path){
  return modifiedDFS(start, end, graph, path);
};
exports.randomGraph = function(numberOfNodes, p){
  return randomGraph(numberOfNodes, p);
};
exports.getNodeById = function(id, nodes){
  return getNodeById(id, nodes);
};
exports.ingoing = function(node, links){
  return ingoing(node, links);
};
exports.outgoing = function(node, links){
  return outgoing(node, links);
};
exports.containsSink = function(nodes, links){
  return containsSink(nodes, links);
};
exports.containsSource = function(nodes, links){
  return containsSource(nodes, links);
};
exports.isolatedNodes = function(v, e){
  return isolatedNodes(v, e);
};
exports.maximumNode = function(v,e){
  return maximumNode(v,e);
};
exports.deleteNode = function(node, nodes){
  deleteNode(node, nodes);
};
exports.deleteLinks = function(edges, e){
  deleteLinks(edges,e);
};
exports.reverse = function(edges){
  reverse(edges);
};
exports.testDAG = function(graph){
  return testDAG(graph);
};
exports.topologicalOrder = function(graph){
  return topologicalOrder(graph);
};
exports.getLayer = function(graph, layer){
  return getLayer(graph, layer);
};
exports.getNodeCrossing = function(node1, node2, graph){
  return getNodeCrossing(node1, node2, graph);
};
exports.getLayerCrossing = function(layer, graph){
  return getLayerCrossing(layer, graph);
};
exports.getTotalCrossing = function(graph){
  return getTotalCrossing(graph);
};
exports.isdummyPar = function(node, graph){
  return isdummyPar(node, graph);
};
exports.edgeBetweenTwoNodes = function(nodeA, nodeB, Graph){
  return edgeBetweenTwoNodes(nodeA, nodeB, Graph);
};

// Inputs start and end node, returns dummyNode
// path from start to end
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
    var outgoingEdges = outgoing(start, graph.links);
    len = outgoingEdges.length;
    for(i = 0; i < len; i++)
    {
      if(getNodeById(outgoingEdges[i].to, graph.nodes).isDummy)
      {
        a = modifiedDFS(getNodeById(outgoingEdges[i].to, graph.nodes), end, graph, [getNodeById(outgoingEdges[i].to, graph.nodes)]);
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
      var outgoingEdges = outgoing(start, graph.links);
      len = outgoingEdges.length;
      for(i = 0; i < len; i++)
      {
        if(outgoingEdges[i].to == end.id)
        {
          return path;
        }else if(getNodeById(outgoingEdges[i].to, graph.nodes).isDummy)
        {
          path.push(getNodeById(outgoingEdges[i].to, graph.nodes));
          return modifiedDFS(getNodeById(outgoingEdges[i].to, graph.nodes), end, graph, path);
        }
      }
    }
    return [];
  }
}

// Inputs number of nodes to be generated and probability
// that each pair of nodes have link between them
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

// Inputs id and array of vertex. Outputs vertex with that id or null;
function getNodeById(id, nodes)
{
  for(var i = 0; i < nodes.length; i++)
  {
    if(nodes[i].id === id)
    {
      return nodes[i];
    }
  }
  return null;
}

// Inputs single vertex and array of edges. Outputs array of edges which is ingoing
// from that vertex
function ingoing(node, links)
{
  var edges = [];
  var linksLength = links.length;
  for(var i = 0; i < linksLength; i++)
  {
    if(links[i].to === node.id)  //have ingoing links from the node
    {
      edges.push(links[i]);
    }
  }
  return edges;
}

// Input single vertex and array of edges. Outputs array of edges which is outgoing
// from that vertex
function outgoing(node, links){
  var edges = [];
  var linksLength = links.length;
  for(var i = 0; i < linksLength; i++)
  {
    if(links[i].from === node.id) // have outgoing links from the node
    {
      edges.push(links[i]);
    }
  }
  return edges;
}

// Inputs array of vertex and array of edges. Outputs one vertex with none outgoing
// edges or null
function containsSink(nodes, links)
{
  var nodesSize = nodes.length;
  for(var i = 0; i < nodesSize; i++)
  {
    if(outgoing(nodes[i],links).length == 0)  // no outgoing link, so the node is sink
    {
      return nodes[i];
    }
  }
  return null;
}

// Inputs array of vertex and array of edges. Outputs one vertex with none ingoing
// edges or null
function containsSource(nodes, links)
{
  var nodesSize = nodes.length;
  for(var i = 0; i < nodesSize; i++)
  {
    if(ingoing(nodes[i],links).length == 0)  // no ingoing link, so the node is source
    {
      return nodes[i];
    }
  }
  return null;
}

// Inputs array of vertex and array of edges. Outputs array of vertex which does
// not have edges
function isolatedNodes(v,e)
{
    var iso = [];
    var len1 = v.length;
    var len2 = e.length;
    for(var i = 0; i < len1; i++)
    {
      for(var j = 0; j < len2; j++)
      {
        if(e[j].from == v[i].id || e[j].to == v[i].id)
        {
          break;
        }
        if(j == len2-1)
        {
          iso.push(v[i]);
        }
      }
    }
    return iso;
}

// Inputs array of vertex and array of edges. Outputs vertex with maximum difference
// (outgoingEdges - ingoingEdges).
function maximumNode(v,e)
{
  var max = -1;
  var current;
  var node;
  var len = v.length;
  for(var i = 0; i < len; i++)
  {
    current = outgoing(v[i],e).length - ingoing(v[i],e).length;
    if(current > max)
    {
      max = current;
      node = v[i];
    }
  }
  return node;
}

// Delete node from nodes
function deleteNode(node, nodes)
{
  for(var i = 0; i < nodes.length; i++)
  {
    if(nodes[i].id === node.id)
    {
      nodes.splice(i,1);
    }
  }
}

// Delete edges from e
function deleteLinks(edges, e)
{
  for(var i = 0; i < edges.length; i++)
  {
    for(var j = 0; j < e.length; j++)
    {
      if(edges[i].from == e[j].from && edges[i].to == e[j].to)
      {
        e.splice(j,1);
        break;
      }
    }
  }
}

function reverse(edges)
{
  var len = edges.length;
  var to;
  for(var i = 0; i < len; i++)
  {
    edges[i].isReversed = true;
    to = edges[i].to;
    edges[i].to = edges[i].from;
    edges[i].from = to;
  }
}

// Inputs graph. Outputs true if that graph is DAG or false
// otherwise. topological sorting with Kahn's algorithm is used here.
function testDAG(graph)
{
  var nodes = (JSON.parse(JSON.stringify(graph.nodes)));
  var temporaryNodes = (JSON.parse(JSON.stringify(graph.nodes)));
  var links = (JSON.parse(JSON.stringify(graph.links)));
  var temporaryEdges = (JSON.parse(JSON.stringify(graph.links)));
  var list = [];
  var sources = [];
  var node;
  var neighbor;
  //find all sources
  for(var i = containsSource(temporaryNodes,links); i != null; i = containsSource(temporaryNodes,links))
  {
    sources.push(i);
    deleteNode(i,temporaryNodes);
  }
  while(sources.length > 0)
  {
    node = sources.pop();
    list.push(node);
    for(i = 0; i < temporaryEdges.length; i++)
    {
      if(temporaryEdges[i].from === node.id)
      {
        neighbor = getNodeById(temporaryEdges[i].to, nodes);
        deleteLinks([temporaryEdges[i]],links);
        if(ingoing(neighbor,links).length == 0)
        {
          sources.push(neighbor);
        }
      }
    }
  }
  if(links.length > 0) //no order, is not DAG
  {
    return false;
  }else{  //har order, is DAG
    return true;
  }
}

// Inputs graoh. Outputs the topological order of nodes using Kahn's algorithm
function topologicalOrder(graph)
{
  var nodes = (JSON.parse(JSON.stringify(graph.nodes)));
  var temporaryNodes = (JSON.parse(JSON.stringify(graph.nodes)));
  var links = (JSON.parse(JSON.stringify(graph.links)));
  var temporaryEdges = (JSON.parse(JSON.stringify(graph.links)));
  var list = [];
  var sources = [];
  var node;
  var neighbor;
  for(var i = containsSource(temporaryNodes,links); i != null; i = containsSource(temporaryNodes,links))
  {
    sources.push(i);
    deleteNode(i,temporaryNodes);
  }
  while(sources.length > 0)
  {
    node = sources.pop();
    list.push(node);
    for(i = 0; i < temporaryEdges.length; i++)
    {
      if(temporaryEdges[i].from === node.id)
      {
        neighbor = getNodeById(temporaryEdges[i].to, nodes);
        deleteLinks([temporaryEdges[i]],links);
        if(ingoing(neighbor,links).length == 0)
        {
          sources.push(neighbor);
        }
      }
    }
  }
  return list;
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

// Inputs node1(node with lower order), node2(node with higher order) and the
// graph. Outputs number of crossing for node1s outgoingEdges and node2s
// outgoingEdges.
function getNodeCrossing(node1, node2, graph)
{
  var number = 0;
  var edges1 = outgoing(node1, graph.links);
  var edges2 = outgoing(node2, graph.links);
  var len1 = edges1.length;
  var len2 = edges2.length;
  var node;
  for(var a = 0; a < len1; a++)
  {
    node = getNodeById(edges1[a].to, graph.nodes);
    for(var b = 0; b < len2; b++)
    {
      if(node.order > getNodeById(edges2[b].to, graph.nodes).order)
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
    edges1 = outgoing(layer[i], graph.links);
    len1 = edges1.length;
    for(var j = i+1; j < len; j++)
    {
      edges2 = outgoing(layer[j], graph.links);
      len2 = edges2.length;
      for(var a = 0; a < len1; a++)
      {
        node = getNodeById(edges1[a].to, graph.nodes);
        for(var b = 0; b < len2; b++)
        {
          if(node.order > getNodeById(edges2[b].to, graph.nodes).order)
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

// Inputs node and the graph. Outputs if node is dummy, and if it is, this
// function checks if it has upper dummy node. Returns null if node is not dummy
// or node is dummy but its neighbor is not dummy, otherwise returns its upper
// dummy neighbor
function isdummyPar(node, Graph)
{
  var index;
  var upperNeighbor;
  var ingoingEdges;
  if(node.isDummy) //node is Dummy, to check the upperNeighbor;
  {
    ingoingEdges = ingoing(node, Graph.links);
    for(var x = 0; x < ingoingEdges.length; x++)
    {
      index = ingoingEdges[x].from;
      upperNeighbor = getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
      if(upperNeighbor.isDummy)
      {
        return upperNeighbor;
      }
    }return null; //no dummy upperNeighbor
  }return null;  // it self is not dummy
}

// Checks if there exist edges from nodeA to nodeB. Returns the link if it exist,
// otherwise returns null
function edgeBetweenTwoNodes(nodeA, nodeB, Graph)
{
  var link = null;
  for(var i = 0; i< Graph.links.length; i++)
  {
    if(Graph.links[i].from == nodeA.id && Graph.links[i].to == nodeB.id)
    {
      link = Graph.links[i];
      break;
    }
  }
  return link;
}
