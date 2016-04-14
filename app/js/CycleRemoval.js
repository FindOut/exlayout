/**********************************************************************************
This function removes cycle in a connected directed graph. Vertexs are represented as
js object = {"id": id, "label": label, "rank": rank, "isDummy": boolean}. Edges are
represented as js object = {"from": id, "to": id}. The algorithm that we are using
is greedy cycle removal.
**********************************************************************************/

// Exports modules for testing
exports.cycleRemoval = function(graph){
  cycleRemoval(graph);
};
exports.testDAG = function(graph){
  return testDAG(graph);
};
exports.topologicalOrder = function(graph){
  return topologicalOrder(graph);
};
exports.outgoing = function(node, links){
  return outgoing(node, links);
};
exports.ingoing = function(node, links){
  return ingoing(node, links);
};
exports.getNodeById = function(id, nodes){
  return getNodeById(id, nodes);
};
exports.deleteLinks = function(edges, e){
  deleteLinks(edges,e);
};
exports.reverse = function(edges){
  reverse(edges);
};
exports.containsSource = function(nodes, links){
  return containsSource(nodes, links);
};
exports.containsSink = function(nodes, links){
  return containsSink(nodes, links);
};
exports.deleteNode = function(node, nodes){
  deleteNode(node, nodes);
};
exports.isolatedNodes = function(v, e){
  return isolatedNodes(v, e);
};
exports.maximum = function(v,e){
  return maximum(v,e);
}

// Removes cycle from input graph using greddy cycle removal
function cycleRemoval(graph)
{
  var temporaryNodes = (JSON.parse(JSON.stringify(graph.nodes)));
  var temporaryEdges = (JSON.parse(JSON.stringify(graph.links)));
  var edges = [];
  var node;
  var sink;
  var source;
  var ingoingEdges;
  var outgoingEdges;
  var isolated;
  while(temporaryNodes.length > 0)
  {
    sink = containsSink(temporaryNodes,temporaryEdges); //check if there is sink node
    while(sink != null)
    {
      ingoingEdges = ingoing(sink,temporaryEdges);
      edges = edges.concat(ingoingEdges); //add ingoingEdges to reserved edges because sink will never be in a circle
      deleteNode(sink,temporaryNodes);
      deleteLinks(ingoingEdges,temporaryEdges);
      sink = containsSink(temporaryNodes,temporaryEdges);
    }
    isolated = isolatedNodes(temporaryNodes,temporaryEdges);  //find isolatedNodes and delete them
    for(var i = 0; i < isolated.length; i++)
    {
      deleteNode(isolated[i],temporaryNodes);
    }
    source = containsSource(temporaryNodes,temporaryEdges);
    while(source != null)
    {
      outgoingEdges = outgoing(source,temporaryEdges);
      edges = edges.concat(outgoingEdges); //add all outgoingEdges to reserved edges bacause source will never be in a circle
      deleteNode(source,temporaryNodes);
      deleteLinks(outgoingEdges,temporaryEdges);
      source = containsSource(temporaryNodes,temporaryEdges);
    }
    if(temporaryNodes.length > 0)
    {
      node = maximum(temporaryNodes, temporaryEdges); //choose the node with the most difference between outgoingEdges and ingoingEdges
      ingoingEdges = ingoing(node, temporaryEdges);
      outgoingEdges = outgoing(node, temporaryEdges);
      reverse(ingoingEdges);
      edges = edges.concat(outgoingEdges);
      edges = edges.concat(ingoingEdges);
      deleteNode(node, temporaryNodes);
      deleteLinks(ingoingEdges, temporaryEdges);
      deleteLinks(outgoingEdges, temporaryEdges);
    }
  }
  graph.links = edges;
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

// Inputs array of vertex and array of edges. Outputs vertex with maximum difference
// (outgoingEdges - ingoingEdges).
function maximum(v,e)
{
  var max = -1;
  var current;
  var node;
  for(var i = 0; i < v.length; i++)
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

// Inputs array of vertex and array of edges. Outputs array of vertex which does
// not have edges
function isolatedNodes(v,e)
{
    var iso = [];
    for(var i = 0; i < v.length; i++)
    {
      for(var j = 0; j < e.length; j++)
      {
        if(e[j].from == v[i].id || e[j].to == v[i].id)
        {
          break;
        }
        if(j == e.length-1)
        {
          iso.push(v[i]);
        }
      }
    }
    return iso;
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
  var length = edges.length;
  var elength = e.length;
  for(var i = 0; i < length; i++)
  {
    for(var j = 0; j < elength; j++)
    {
      if(edges[i].from == e[j].from && edges[i].to == e[j].to)
      {
        e.splice(j,1);
        break;
      }
    }
  }
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

// Input single vertex and array of edges. Outputs array of edges which is outgoing
// from that vertex
function outgoing(node, links){
  var edges = [];
  var linksLength = links.length;
  for(var i = 0; i < linksLength; i++)
  {
    if(links[i].from == node.id) // have outgoing links from the node
    {
      edges.push(links[i]);
    }
  }
  return edges;
}

// Inputs single vertex and array of edges. Outputs array of edges which is ingoing
// from that vertex
function ingoing(node, links)
{
  var edges = [];
  var linksLength = links.length;
  for(var i = 0; i < linksLength; i++)
  {
    if(links[i].to == node.id)  //have ingoing links from the node
    {
      edges.push(links[i]);
    }
  }
  return edges;
}

// Inputs id and array of vertex. Outputs vertex with that id or null;
function getNodeById(id, nodes)
{
  for(var i = 0; i < nodes.length; i++)
  {
    if(nodes[i].id == id)
    {
      return nodes[i];
    }
  }
  return null;
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
