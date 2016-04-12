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
      for(var m= 1; m <= numberofNodesinRow; m++)
      {
        var currentNode = NodesinRow[m-1];
        var dummiParNode = isdummyPar(currentNode, NodesinRow);  //get ingoing dummy Node to NodesinRow[m]
        if(m == numberofNodesinRow || dummiParNode != null)
        {
          var layer = height -i +1;
          kend = VertexOrdering.getLayer(Graph, layer).length;  //kend is the last position of row i
          if(dummiParNode != null)
          {
            kend = dummiParNode.order;  //kend change to position of ingoing dummy Node
          }
          while ( l <= m)
          {
            var ingoingEdges = CycleRemoval.ingoing(NodesinRow[l-1], Graph.links);  //get all ingoingEdges of Nodes in Row i+1
            for(var x = 0; x < ingoingEdges.length; x++)
            {
              var index = ingoingEdges[x].from;
              var upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
              if(upperNeighbor.order < kstart || upperNeighbor.order > kend)
              {
                ignoreEdges.push(ingoingEdges[x]); //sparas in ignoreEdges
                ingoingEdges[x].ismark = true;
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
    var ingoingEdges = CycleRemoval.ingoing(node, Graph.links);
    for(var x = 0; x < ingoingEdges.length; x++)
    {
      var index = ingoingEdges[x].from;
      var upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
      if(upperNeighbor.isDummy)
      {
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
    {"from": 1, "to": 3, "ismark": false},
    {"from": 1, "to": 8, "ismark": false},
    {"from": 1, "to": 10, "ismark": false},
    {"from": 2, "to": 5, "ismark": false},
    {"from": 2, "to": 7, "ismark": false},
    {"from": 4, "to": 12, "ismark": false},
    {"from": 5, "to": 12, "ismark": false},
    {"from": 6, "to": 12, "ismark": false},
    {"from": 7, "to": 13, "ismark": false},
    {"from": 8, "to": 14, "ismark": false},
    {"from": 9, "to": 12, "ismark": false},
    {"from": 9, "to": 16, "ismark": false},
    {"from": 10, "to": 12, "ismark": false},
    {"from": 10, "to": 15, "ismark": false},
    {"from": 11, "to": 17, "ismark": false},
    {"from": 11, "to": 18, "ismark": false},
    {"from": 11, "to": 22, "ismark": false},
    {"from": 13, "to": 20, "ismark": false},
    {"from": 14, "to": 21, "ismark": false},
    {"from": 15, "to": 22, "ismark": false},
    {"from": 16, "to": 19, "ismark": false},
    {"from": 16, "to": 23, "ismark": false},
    {"from": 17, "to": 24, "ismark": false},
    {"from": 17, "to": 25, "ismark": false},
    {"from": 18, "to": 25, "ismark": false},
    {"from": 19, "to": 24, "ismark": false},
    {"from": 20, "to": 26, "ismark": false},
    {"from": 21, "to": 26, "ismark": false},
    {"from": 22, "to": 26, "ismark": false},
    {"from": 23, "to": 26, "ismark": false}
  ]
};


//console.log(preprocessing(Graph));
alignment(Graph);
//console.log(Graph);


function alignment(Graph)
{
  var numberofNodes = Graph.nodes.length;
  //initialize root[v] and align[v]
  var height = 0;
  for(var i = 0; i < numberofNodes; i++)
  {
    Graph.nodes[i].root = Graph.nodes[i].id;
    Graph.nodes[i].align = Graph.nodes[i].id;
  }

  for(var j = 0; j < numberofNodes; j++)  // get height
  {
    if(Graph.nodes[j].rank > height)
    {
      height = Graph.nodes[j].rank;
    }
  }

  for(var x = 1; x <= height; x++)
  {
    var r = 0;
    var xRowIndex = height-x+1;
    var NodesinRow = VertexOrdering.getLayer(Graph,xRowIndex);  // get nodes in x row
    console.log(NodesinRow);
    var upperNeighborsOrderArray = [];
    for(var k = 1; k <= NodesinRow.length; k++)
    {
      var currentNode = NodesinRow[k-1];
      var ingoingEdges = CycleRemoval.ingoing(currentNode, Graph.links);
      if(ingoingEdges.length > 0)   // check if exsit upperNeighbor
      {
        for(var y = 0; y < ingoingEdges.length; y++)
        {
          var index = ingoingEdges[y].from;
          var upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
          upperNeighborsOrderArray.push(upperNeighbor);
        }

        upperNeighborsOrderArray.sort(function(a,b){
          return a.order-b.order;
        }); //sort from small to big
        var length = upperNeighborsOrderArray.length;
        var averageValue = (length + 1)/2;
        var averageValueFloor = Math.floor(averageValue);
        var averageValueCeil = Math.ceil(averageValue);

        for(var m = averageValueFloor; m <= averageValueCeil; m++) //m is index in upperNeighborsOrderArray
        {

          var averageNode = upperNeighborsOrderArray[m-1];
          console.log("averageNode id is  " + averageNode.id);
          if(currentNode.align == currentNode.id)
          {
            var link = edgeBetweenTwoNodes(averageNode,currentNode, Graph);
            if(link != null && !link.ismark && r < averageNode.order)
            {
              console.log("BBBBBBBBBBBBBBBB");
                console.log(link);
                averageNode.align = currentNode.id;
                currentNode.root = averageNode.root;
                currentNode.align = currentNode.root;
                r = averageNode.order;
            }
          }
        }
      }
    }
  }
}

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
