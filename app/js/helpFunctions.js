var CycleRemoval = require("./CycleRemoval.js");
var Sugiyama = require("./Sugiyama.js");

exports.modifiedDFS = function(start, end, graph, path){
  return modifiedDFS(start, end, graph, path);
};

function modifiedDFS(start, end, graph, path)
{
  console.log(arguments.length);
  if(path === undefined)
  {
    console.log("a");
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
    console.log("b");
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

/*var graph = {
  "nodes":[
    {"id": 1, "label": "A", "isDummy": false},
    {"id": 2, "label": "B", "isDummy": true},
    {"id": 3, "label": "C", "isDummy": true},
    {"id": 4, "label": "D", "isDummy": true},
    {"id": 5, "label": "E", "isDummy": true},
    {"id": 6, "label": "F", "isDummy": false},
    {"id": 7, "label": "G", "isDummy": false}
  ],
  "links":[
    {"from": 1, "to": 2},
    {"from": 2, "to": 4},
    {"from": 4, "to": 6},
    {"from": 1, "to": 3},
    {"from": 3, "to": 5},
    {"from": 5, "to": 7}
  ]
};

console.log(graph);
console.log(modifiedDFS(graph.nodes[0], graph.nodes[6], graph));*/
