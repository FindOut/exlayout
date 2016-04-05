/**********************************************************************************
This function removes cycle in a connected directed graph. Vertexs are represented as
js object = {"id": id, "label": label, "rank": rank, "isDummy": boolean}. Edges are
represented as js object = {"from": id, "to": id}. The algorithm that we are using
is greedy cycle removal.
**********************************************************************************/

// Exports modules for testing
exports.cycleRemoval = function(v,e){
  return cycleRemoval(v,e);
};
exports.testDAG = function(v,e){
  return testDAG(v,e);
};
exports.topologicalOrder = function(v,e){
  return topologicalOrder(v,e);
};
exports.outgoing = function(node, links){
  return outgoing(node, links);
};
exports.getNodeById = function(id, nodes){
  return getNodeById(id, nodes);
}
exports.deleteLinks = function(edges, e){
  return deleteLinks(edges,e);
}

// Inputs array of vertex and array of edges. Outputs array of edges
// without cycle using greedy cycle removal algorithm
function cycleRemoval(nodes, links)
{
  var v = (JSON.parse(JSON.stringify(nodes)));
  var e = (JSON.parse(JSON.stringify(links)));
  var edges = [];
  var node;
  var sink;
  var source;
  var ingoingEdges;
  var outgoingEdges;
  var isolated;
  while(v.length > 0)
  {
    sink = containsSink(v,e); //check if there is sink node
    while(sink != null)
    {
      ingoingEdges = ingoing(sink,e);
      edges = edges.concat(ingoingEdges); //add ingoingEdges to reserved edges because sink will never be in a circle
      v = deleteNode(sink,v);
      e = deleteLinks(ingoingEdges,e);
      sink = containsSink(v,e);
    }
    isolated = isolatedNodes(v,e);  //find isolatedNodes and delete them
    for(var i = 0; i < isolated.length; i++)
    {
      v = deleteNode(isolated[i],v);
    }
    source = containsSource(v,e);
    while(source != null)
    {
      outgoingEdges = outgoing(source,e);
      edges = edges.concat(outgoingEdges); //add all outgoingEdges to reserved edges bacause source will never be in a circle
      v = deleteNode(source,v);
      e = deleteLinks(outgoingEdges,e);
      source = containsSource(v,e);
    }
    if(v.length > 0)
    {
      node = maximum(v,e); //choose the node with the most difference between outgoingEdges and ingoingEdges
      ingoingEdges = ingoing(node,e);
      outgoingEdges = outgoing(node,e);
      edges = edges.concat(outgoingEdges);
      v = deleteNode(node,v);
      e = deleteLinks(ingoingEdges,e);
      e = deleteLinks(outgoingEdges,e);
    }
  }
  return edges;
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

// Inputs single vertex and array of vertex. Outputs array of vertex which does not
// contain the single vertex.
function deleteNode(node, nodes)
{
  for(var i = 0; i < nodes.length; i++)
  {
    if(nodes[i].id === node.id)
    {
      nodes.splice(i,1);
    }
  }
  return nodes;
}

// Inputs two array of edges. Outputs array of edges which is array2 / array1
// (set operation) which means to delete all the same links set (both exsist in array2 and array1) in array2.
function deleteLinks(edges, e)
{
  var newEdge = (JSON.parse(JSON.stringify(e)));
  var length = edges.length;
  var elength = e.length;
  if(length == 0)
  {
    return newEdge;
  }
  for(var i = 0; i < length; i++)
  {
<<<<<<< HEAD
    for(var j = 0; j < elength; j++)
=======
    for(var j = 0; j < newEdge.length; j++)
>>>>>>> 49a7cebf54467ade91bc1e694f46b7c7d6fa4786
    {
      if(edges[i].from == newEdge[j].from && edges[i].to == newEdge[j].to)
      {
        newEdge.splice(j,1);
        break;
      }
    }
  }
  return newEdge;
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

// Inputs array of vertexs and array of edges. Outputs true if that graph is DAG or false
// otherwise. topological sorting with Kahn's algorithm is used here.
function testDAG(v,e)
{
  var nodes = (JSON.parse(JSON.stringify(v)));
  var temporaryNodes = (JSON.parse(JSON.stringify(v)));
  var links = (JSON.parse(JSON.stringify(e)));
  var temporaryEdges = (JSON.parse(JSON.stringify(e)));
  var list = [];
  var sources = [];
  var node;
  var neighbor;
  //find all sources
  for(var i = containsSource(temporaryNodes,links); i != null; i = containsSource(temporaryNodes,links))
  {
    sources.push(i);
    temporaryNodes = deleteNode(i,temporaryNodes);
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
        links = deleteLinks([temporaryEdges[i]],links);
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
<<<<<<< HEAD
=======

function topologicalOrder(v,e)
{
  var nodes = (JSON.parse(JSON.stringify(v)));
  var temporaryNodes = (JSON.parse(JSON.stringify(v)));
  var links = (JSON.parse(JSON.stringify(e)));
  var temporaryEdges = (JSON.parse(JSON.stringify(e)));
  var list = [];
  var sources = [];
  var node;
  var neighbor;
  for(var i = containsSource(temporaryNodes,links); i != null; i = containsSource(temporaryNodes,links))
  {
    sources.push(i);
    temporaryNodes = deleteNode(i,temporaryNodes);
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
        links = deleteLinks([temporaryEdges[i]],links);
        if(ingoing(neighbor,links).length == 0)
        {
          sources.push(neighbor);
        }
      }
    }
  }
  return list;
}

/*var graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0},
    {"id": 2, "label": "B", "rank": 0},
    {"id": 3, "label": "C", "rank": 0}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 1, "to": 3}
  ]
};

console.log(topologicalOrder(graph.nodes, graph.links));*/
>>>>>>> 49a7cebf54467ade91bc1e694f46b7c7d6fa4786
