var VertexOrdering = require("./VertexOrdering.js");
var CycleRemoval = require("./CycleRemoval.js");
function preprocessing(Graph) //mark type 1 conflict
{
  var ignoreEdges = [];
  var height = 0;
  numberofNodes = Graph.nodes.length;
  for(var i = 0; i < numberofNodes; i++)
  {
    if(Graph.nodes[i].rank > height)
    {
      height = Graph.nodes[i].rank;
    }
  }
  //console.log(height);

  for(var i = 2; i < height-1; i++)
  {
      var kstart = 0;
      var l = 1;
      var NodesinRow = VertexOrdering.getLayer(Graph,height-i);  // get nodes in i + 1 row
      //console.log(NodesinRow);
      var numberofNodesinRow = NodesinRow.length;
      console.log(numberofNodesinRow);
      for(var m= 1; m <= numberofNodesinRow; m++)
      {
        var currentNode = NodesinRow[m-1];
        console.log("dummy node "+ currentNode.id);
        var dummiParNode = isdummyPar(currentNode, NodesinRow);  //get ingoing dummy Node to NodesinRow[m]
        if(dummiParNode == null)
        {
          console.log("dummiParNode is null");
        }
        else {
          console.log("dummiParNode is " + dummiParNode.id);
        }
        if(m == numberofNodesinRow || dummiParNode != null)
        {
          var layer = height -i +1;
          kend = VertexOrdering.getLayer(Graph, layer).length;  //kend is the last position of row i
          if(dummiParNode != null)
          {
            kend = dummiParNode.order;  //kend change to position of ingoing dummy Node
            console.log("kend is " + kend);
          }
          while ( l <= m)
          {
            var ingoingEdges = CycleRemoval.ingoing(NodesinRow[l], Graph.links);  //get all ingoingEdges of Nodes in Row i+1

            console.log("currentNode is " + NodesinRow[l].id);
            for(var x = 0; x < ingoingEdges.length; x++)
            {
              var index = ingoingEdges[x].from;
              console.log(index);
              var upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
              console.log("upperNeighbor is " + upperNeighbor.id);
              if(upperNeighbor.order < kstart || upperNeighbor.order > kend)
              {
                console.log("upperNeighbor order is " + upperNeighbor.order);
                ignoreEdges.push(ingoingEdges[x]); //sparas in ignoreEdges
                console.log(ignoreEdges);
              }
            }
            l++;
          } //end while
          kstart = kend;
        }
      }//else
  }
  return ignoreEdges;
}

function isdummyPar(node, NodesinRow)
{
  if(node.isDummy) //node is Dummy, to check the upperNeighbor;
  {
    //console.log("node " + node.id + "is dummy");
    var ingoingEdges = CycleRemoval.ingoing(node, Graph.links);
    //console.log(ingoingEdges.length);
    for(var x = 0; x < ingoingEdges.length; x++)
    {
      var index = ingoingEdges[x].from;
    //  console.log(index);
      var upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
      if(upperNeighbor.isDummy)
      {
      //  console.log(upperNeighbor.id);
        return upperNeighbor;
      }
    }return null; //no dummy upperNeighbor
  }return null;  // it self is not dummy
}

var Graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 5, "isDummy": false, "group": 1, "order": 1},
    {"id": 2, "label": "B", "rank": 5, "isDummy": false, "group": 1, "order": 2},
    {"id": 3, "label": "C", "rank": 4, "isDummy": false, "group": 1, "order": 1},
    {"id": 4, "label": "D", "rank": 4, "isDummy": false, "group": 1, "order": 2},
    {"id": 5, "label": "E", "rank": 4, "isDummy": true, "group": 1, "order": 3},
    {"id": 6, "label": "F", "rank": 4, "isDummy": false, "group": 1, "order": 4},
    {"id": 7, "label": "G", "rank": 4, "isDummy": true, "group": 1, "order": 5},
    {"id": 8, "label": "H", "rank": 4, "isDummy": true, "group": 1,"order": 6},
    {"id": 9, "label": "I", "rank": 4, "isDummy": false, "group": 1, "order": 7},
    {"id": 10, "label": "J", "rank": 4, "isDummy": false, "group": 1, "order": 8},
    {"id": 11, "label": "K", "rank": 3, "isDummy": false, "group": 1, "order": 1},
    {"id": 12, "label": "L", "rank": 3, "isDummy": false, "group": 1, "order": 2},
    {"id": 13, "label": "M", "rank": 3, "isDummy": true, "group": 1, "order": 3},
    {"id": 14, "label": "N", "rank": 3, "isDummy": true, "group": 1, "order": 4},
    {"id": 15, "label": "O", "rank": 3, "isDummy": true, "group": 1, "order": 5},
    {"id": 16, "label": "P", "rank": 3, "isDummy": false, "group": 1, "order": 6},
    {"id": 17, "label": "Q", "rank": 2, "isDummy": false, "group": 1,"order": 1},
    {"id": 18, "label": "R", "rank": 2, "isDummy": false, "group": 1, "order": 2},
    {"id": 19, "label": "S", "rank": 2, "isDummy": true, "group": 1, "order": 3},
    {"id": 20, "label": "T", "rank": 2, "isDummy": true, "group": 1, "order": 4},
    {"id": 21, "label": "U", "rank": 2, "isDummy": true, "group": 1, "order": 5},
    {"id": 22, "label": "V", "rank": 2, "isDummy": false, "group": 1,"order": 6},
    {"id": 23, "label": "W", "rank": 2, "isDummy": true, "group": 1, "order": 7},
    {"id": 24, "label": "X", "rank": 1, "isDummy": false, "group": 1, "order": 1},
    {"id": 25, "label": "Y", "rank": 1, "isDummy": false, "group": 1, "order": 2},
    {"id": 26, "label": "Z", "rank": 1, "isDummy": false, "group": 1,"order": 3}


  ],
  "links": [
    {"from": 1, "to": 3},
    {"from": 1, "to": 8},
    {"from": 1, "to": 10},
    {"from": 2, "to": 5},
    {"from": 2, "to": 7},
    {"from": 4, "to": 12},
    {"from": 5, "to": 12},
    {"from": 6, "to": 12},
    {"from": 7, "to": 13},
    {"from": 8, "to": 14},
    {"from": 9, "to": 12},
    {"from": 9, "to": 16},
    {"from": 10, "to": 12},
    {"from": 10, "to": 15},
    {"from": 11, "to": 17},
    {"from": 11, "to": 18},
    {"from": 11, "to": 22},
    {"from": 13, "to": 20},
    {"from": 14, "to": 21},
    {"from": 15, "to": 22},
    {"from": 16, "to": 20},
    {"from": 16, "to": 23},
    {"from": 17, "to": 24},
    {"from": 17, "to": 25},
    {"from": 18, "to": 25},
    {"from": 19, "to": 24},
    {"from": 20, "to": 26},
    {"from": 21, "to": 26},
    {"from": 22, "to": 26},
    {"from": 23, "to": 26}
  ]
};

console.log(preprocessing(Graph));
