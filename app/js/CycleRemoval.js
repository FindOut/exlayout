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
    if(nodes[i] === node)
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
    if(edges[j] === e[i])
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

var nodes = [{"id": 1, "label": "A"},{"id": 2, "label": "B"},{"id": 3, "label": "C"},{"id": 4, "label": "E"}];
var links = [{"from": 1, "to": 2},{"from": 2, "to": 4},{"from": 3, "to": 1},{"from": 1, "to": 4},{"from": 4, "to": 3}];

console.log(cycleRemoval(nodes,links));
