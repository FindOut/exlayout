/*DFS(G,v)   ( v is the vertex where the search starts )
         S S := {};   ( start with an empty S )
         for each vertex u, set visited[u] := false;
         push S, v;
         while (S is not empty) do
            u := pop S;
            if (not visited[u]) then
               visited[u] := true;
               for each unvisited neighbour w of u
                  push S, w;
            end if
         end while
      END DFS()*/
exports.connectedGraphDetect = function(graph){
      return connectedGraphDetect(graph);
};
var CycleRemoval = require("./CycleRemoval.js");
function connectedGraphDetect(graph)
{
  var Nodes = graph.nodes;
  var Edges = graph.links;
  var S = [];
  var Nodeslength = Nodes.length;
  var visited = [];
  var conter = 0;  //record total number of visited node
  var groupnumber = 0;
  var start;
  for(var i = 0; i < Nodeslength; i++)  //set all nodes as not visited
  {
    Nodes[i].visited = false;
  }

  while(conter != Nodeslength)
  {
    for(var m = 0; m < Nodeslength; m++) //find the first element which is not visited
    {
      if(Nodes[m].visited === false)
      {
        start = Nodes[m];
        groupnumber++;
        break;
      }
    }
    S.push(start); //add node 1 into statck
    while(S.length > 0)
    {
      var u = S.pop();
      if(!u.visited)   //if node u is not visited, set it true
      {
        u.visited = true;
        u.group = groupnumber; // set group number
        conter++; //total visited node conter
        //console.log(Edges);
        var outgoingEdges = CycleRemoval.outgoing(u, Edges);  //find all the outgoing edges of node u

        for(var j = 0; j < outgoingEdges.length; j++)
        {
          var index = outgoingEdges[j].to;
          outgoingEdges[j].group = groupnumber;
          if(!visited[index-1]) //check if neighbour node is unvisited, do this while loop again
          {
            S.push(CycleRemoval.getNodeById(index, Nodes));
          }
        }

        var ingoingEdges = CycleRemoval.ingoing(u, Edges);  //find all the outgoing edges of node u

        for(var j = 0; j < ingoingEdges.length; j++)
        {
          var index = ingoingEdges[j].from;
          ingoingEdges[j].group = groupnumber;
          if(!visited[index-1]) //check if neighbour node is unvisited, do this while loop again
          {
            S.push(CycleRemoval.getNodeById(index, Nodes));
          }
        }
      }
    }
  }
//find max Group Number
var maxGroupNum = 1;
  for(var i = 0; i < Nodeslength; i++)
  {
    if(Nodes[i].group > maxGroupNum)
    {
      maxGroupNum = Nodes[i].group;
    }
  }

var allGraphs = [];
for(var counter = 1; counter <= maxGroupNum; counter++)
{
  allGraphs[counter-1] = {"nodes":[], "links": [], "groupnumber": counter};
  for(var j = 0; j < Nodeslength; j++)
  {
    if(Nodes[j].group == counter)
    {
      allGraphs[counter-1].nodes.push(Nodes[j]);
    }
  }

  for(var i = 0; i < Edges.length; i++)
  {
    if(Edges[i].group == counter)
    {
      allGraphs[counter-1].links.push(Edges[i]);
    }
  }
}
return allGraphs;

}

/*var graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "isDummy": false, "group": 0},
    {"id": 2, "label": "B", "rank": 0, "isDummy": false, "group": 0},
    {"id": 3, "label": "C", "rank": 0, "isDummy": false, "group": 0},
    {"id": 4, "label": "D", "rank": 0, "isDummy": false, "group": 0},
    {"id": 5, "label": "E", "rank": 0, "isDummy": false, "group": 0},
    {"id": 6, "label": "F", "rank": 0, "isDummy": false, "group": 0},
    {"id": 7, "label": "G", "rank": 0, "isDummy": false, "group": 0},

    {"id": 8, "label": "s", "rank": 0, "isDummy": false, "group": 0},
    {"id": 9, "label": "H", "rank": 0, "isDummy": false, "group": 0},
    {"id": 10, "label": "X", "rank": 0, "isDummy": false, "group": 0}
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

    {"from": 8, "to": 9},
    {"from": 9, "to": 10},
    {"from": 10, "to": 8}
  ]
};



console.log(JSON.stringify(connectedGraphDetect(graph)));*/
