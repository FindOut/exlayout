exports.cycleRemoval = function(v,e){
  return cycleRemoval(v,e);
};
exports.containsSource = function(v,e){
  return containsSource(v,e);
};
exports.deleteNode = function(node,nodes){
  return deleteNode(node,nodes);
};
exports.deleteLinks = function(edges,e){
  return deleteLinks(edges,e);
};
exports.ingoing = function(node,links){
  return ingoing(node,links);
};

function cycleRemoval(nodes, links)
{
  var v = nodes;
  var e = links;
  var edges = [];
  var node;
  var sink;
  var source;
  var ingoingEdges;
  var outgoingEdges;
  var isolated;
  while(v.length > 0)
  {
    sink = containsSink(v,e);
    while(sink != null)
    {
      ingoingEdges = ingoing(sink,e);
      edges = edges.concat(ingoingEdges);
      v = deleteNode(sink,v);
      e = deleteLinks(ingoingEdges,e);
      sink = containsSink(v,e);
    }
    isolated = isolatedNodes(v,e);
    for(var i = 0; i < isolated.length; i++)
    {
      v = deleteNode(isolated[i],v);
    }
    source = containsSource(v,e);
    while(source != null)
    {
      outgoingEdges = outgoing(source,e);
      edges = edges.concat(outgoingEdges);
      v = deleteNode(source,v);
      e = deleteLinks(outgoingEdges,e);
      source = containsSource(v,e);
    }
    if(v.length > 0)
    {
      node = maximum(v,e);
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

function deleteLinks(edges, e)
{
  var length = edges.length;
  if(length == 0)
  {
    return e;
  }
  var j = 0;
  for(var i = 0; i < e.length; i++)
  {
    if(edges[j].from == e[i].from && edges[j].to == e[i].to)
    {
      e.splice(i,1);
      i--;
      if(j == length-1)
      {
        break;
      }else{
        j++
      }
    }
  }
  return e;
}

function containsSink(nodes, links)
{
  for(var i = 0; i < nodes.length; i++)
  {
    if(outgoing(nodes[i],links).length == 0)
    {
      return nodes[i];
    }
  }
  return null;
}

function containsSource(nodes, links)
{
  for(var i = 0; i < nodes.length; i++)
  {
    if(ingoing(nodes[i],links).length == 0)
    {
      return nodes[i];
    }
  }
  return null;
}

function outgoing(node, links){
  var edges = [];
  for(var i = 0; i < links.length; i++)
  {
    if(links[i].from == node.id)
    {
      edges.push(links[i]);
    }
  }
  return edges;
}

function ingoing(node, links)
{
  var edges = [];
  for(var i = 0; i < links.length; i++)
  {
    if(links[i].to == node.id)
    {
      edges.push(links[i]);
    }
  }
  return edges;
}

function testDAG(v,e)
{
  var nodes = v;
  var temporaryNodes = (JSON.parse(JSON.stringify(v)));
  var links = e;
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
        neighbor = nodes[temporaryEdges[i].to-1];
        links = deleteLinks([temporaryEdges[i]],links);
        if(ingoing(neighbor,links).length == 0)
        {
          sources.push(neighbor);
        }
      }
    }
  }
  if(links.length > 0)
  {
    return false;
  }else{
    return true;
  }
}

/*var graph = {
  "nodes": [
    {"id": 1, "label": "A"},
    {"id": 2, "label": "B"},
    {"id": 3, "label": "C"},
    {"id": 4, "label": "D"},
    {"id": 5, "label": "E"},
    {"id": 6, "label": "F"},
    {"id": 7, "label": "G"},

  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 2, "to": 5},
    {"from": 2, "to": 4},
    {"from": 3, "to": 5},
    {"from": 4, "to": 5},
    {"from": 5, "to": 6},
    {"from": 7, "to": 4},
  ]
};

console.log(testDAG(graph.nodes, graph.links));*/
