var VertexOrdering = require("./VertexOrdering.js");
var CycleRemoval = require("./CycleRemoval.js");

exports.xCoordinateAssignment = function(graph){
  xCoordinateAssignment(graph);
};

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
      var currentNode;
      var dummiParNode;
      var layer;
      var ingoingEdges;
      var index;
      var upperNeighbor;
      for(var m= 1; m <= numberofNodesinRow; m++)
      {
        currentNode= NodesinRow[m-1];
        dummiParNode = isdummyPar(currentNode, NodesinRow);  //get ingoing dummy Node to NodesinRow[m]
        if(m == numberofNodesinRow || dummiParNode != null)
        {
          layer = height -i +1;
          kend = VertexOrdering.getLayer(Graph, layer).length;  //kend is the last position of row i
          if(dummiParNode != null)
          {
            kend = dummiParNode.order;  //kend change to position of ingoing dummy Node
          }
          while ( l <= m)
          {
            ingoingEdges = CycleRemoval.ingoing(NodesinRow[l-1], Graph.links);  //get all ingoingEdges of Nodes in Row i+1
            for(var x = 0; x < ingoingEdges.length; x++)
            {
              index = ingoingEdges[x].from;
              upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
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
  var index;
  var upperNeighbor;
  var ingoingEdges;
  if(node.isDummy) //node is Dummy, to check the upperNeighbor;
  {
    ingoingEdges = CycleRemoval.ingoing(node, Graph.links);
    for(var x = 0; x < ingoingEdges.length; x++)
    {
      index = ingoingEdges[x].from;
      upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
      if(upperNeighbor.isDummy)
      {
        return upperNeighbor;
      }
    }return null; //no dummy upperNeighbor
  }return null;  // it self is not dummy
}

function alignUpperLeft(Graph)
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

  var r;
  var xRowIndex;  //  index of x row
  var NodesinRow;  // nodes in one row
  var currentNode;
  var ingoingEdges;  //ingoingEdges of currentNode
  var upperNeighborArray;   //upperNeighbors array of currentNode
  var index; //id of node which ingoingEdges come from
  var upperNeighbor; // one upperNeighbor of currentNode
  var length; // length of upperNeighborArray
  var averageValue, averageValueFloor,averageValueCeil; //average length of upperNeighborArray
  var averageNode; // the node in middle position of upperNeighborArray
  var link;
  for(var x = 1; x <= height; x++)
  {
    r = 0;
    xRowIndex = height-x+1;
    NodesinRow = VertexOrdering.getLayer(Graph,xRowIndex);  // get nodes in x row

    for(var k = 1; k <= NodesinRow.length; k++)
    {
      currentNode = NodesinRow[k-1];
      ingoingEdges = CycleRemoval.ingoing(currentNode, Graph.links);
      upperNeighborArray = [];
      if(ingoingEdges.length > 0)   // check if exsit upperNeighbor
      {
        for(var y = 0; y < ingoingEdges.length; y++)
        {
          index = ingoingEdges[y].from;
          upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
          upperNeighborArray.push(upperNeighbor);
        }

        upperNeighborArray.sort(function(a,b){
          return a.order-b.order;
        }); //sort from small to big
        length = upperNeighborArray.length;
        averageValue = (length + 1)/2;
        averageValueFloor = Math.floor(averageValue);
        averageValueCeil = Math.ceil(averageValue);

        for(var m = averageValueFloor; m <= averageValueCeil; m++) //m is index in upperNeighborArray
        {
          averageNode = upperNeighborArray[m-1];
          if(currentNode.align == currentNode.id)
          {
            link = edgeBetweenTwoNodes(averageNode,currentNode, Graph);
            if(link != null && !link.ismark && r < averageNode.order)
            {
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

function alignUpperRight(Graph)
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

  var r;
  var xRowIndex;  //  index of x row
  var NodesinRow;  // nodes in one row
  var currentNode;
  var ingoingEdges;  //ingoingEdges of currentNode
  var upperNeighborArray;   //upperNeighbors array of currentNode
  var index; //id of node which ingoingEdges come from
  var upperNeighbor; // one upperNeighbor of currentNode
  var length; // length of upperNeighborArray
  var averageValue, averageValueFloor,averageValueCeil; //average length of upperNeighborArray
  var averageNode; // the node in middle position of upperNeighborArray
  var link;
  for(var x = 1; x <= height; x++)
  {
    r = Number.MAX_VALUE;   //R set to maximum value
    xRowIndex = height-x+1;
    NodesinRow = VertexOrdering.getLayer(Graph,xRowIndex);  // get nodes in x row

    for(var k = NodesinRow.length; k >= 1; k--)
    {
      currentNode = NodesinRow[k-1];
      ingoingEdges = CycleRemoval.ingoing(currentNode, Graph.links);
      upperNeighborArray = [];
      if(ingoingEdges.length > 0)   // check if exsit upperNeighbor
      {
        for(var y = 0; y < ingoingEdges.length; y++)
        {
          index = ingoingEdges[y].from;
          upperNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
          upperNeighborArray.push(upperNeighbor);
        }

        upperNeighborArray.sort(function(a,b){
          return a.order-b.order;
        }); //sort from small to big
        length = upperNeighborArray.length;
        averageValue = (length + 1)/2;
        averageValueFloor = Math.floor(averageValue);
        averageValueCeil = Math.ceil(averageValue);

        for(var m = averageValueCeil; m >= averageValueFloor; m--) //m is index in upperNeighborArray
        {
          averageNode = upperNeighborArray[m-1];
          if(currentNode.align == currentNode.id)
          {
            link = edgeBetweenTwoNodes(averageNode,currentNode, Graph);
            if(link != null && !link.ismark && r > averageNode.order)
            {
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

function alignLowerLeft(Graph)
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

  var r;
  var xRowIndex;  //  index of x row
  var NodesinRow;  // nodes in one row
  var currentNode;
  var outgoingEdges;  //ingoingEdges of currentNode
  var lowerNeighborArray;   //upperNeighbors array of currentNode
  var index; //id of node which ingoingEdges come from
  var lowerNeighbor; // one upperNeighbor of currentNode
  var length; // length of upperNeighborArray
  var averageValue, averageValueFloor,averageValueCeil; //average length of upperNeighborArray
  var averageNode; // the node in middle position of upperNeighborArray
  var link;
  for(var x = 1; x <= height; x++)
  {
    r = 0;
    xRowIndex = height-x+1;
    NodesinRow = VertexOrdering.getLayer(Graph,xRowIndex);  // get nodes in x row

    for(var k = 1; k <= NodesinRow.length; k++)
    {
      currentNode = NodesinRow[k-1];
      outgoingEdges = CycleRemoval.outgoing(currentNode, Graph.links);
      lowerNeighborArray = [];
      if(outgoingEdges.length > 0)   // check if exsit upperNeighbor
      {
        for(var y = 0; y < outgoingEdges.length; y++)
        {
          index = outgoingEdges[y].to;
          lowerNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
          lowerNeighborArray.push(lowerNeighbor);
        }

        lowerNeighborArray.sort(function(a,b){
          return a.order-b.order;
        }); //sort from small to big
        length = lowerNeighborArray.length;
        averageValue = (length + 1)/2;
        averageValueFloor = Math.floor(averageValue);
        averageValueCeil = Math.ceil(averageValue);

        for(var m = averageValueFloor; m <= averageValueCeil; m++) //m is index in upperNeighborArray
        {
          averageNode = lowerNeighborArray[m-1];
          if(currentNode.align == currentNode.root)
          {
            link = edgeBetweenTwoNodes(currentNode, averageNode, Graph);
            if(link != null && !link.ismark && r < averageNode.order)
            {
                currentNode.align = averageNode.id;
                averageNode.root = currentNode.root;
                averageNode.align = averageNode.root;
                r = averageNode.order;
            }
          }
        }
      }
    }
  }
}

function alignLowerRight(Graph)
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

  var r;
  var xRowIndex;  //  index of x row
  var NodesinRow;  // nodes in one row
  var currentNode;
  var outgoingEdges;  //ingoingEdges of currentNode
  var lowerNeighborArray;   //upperNeighbors array of currentNode
  var index; //id of node which ingoingEdges come from
  var lowerNeighbor; // one upperNeighbor of currentNode
  var length; // length of upperNeighborArray
  var averageValue, averageValueFloor,averageValueCeil; //average length of upperNeighborArray
  var averageNode; // the node in middle position of upperNeighborArray
  var link;
  for(var x = 1; x <= height; x++)
  {
    r = Number.MAX_VALUE;   //R set to maximum value
    xRowIndex = height-x+1;
    NodesinRow = VertexOrdering.getLayer(Graph,xRowIndex);  // get nodes in x row
    NodesinRow.sort(function(a,b){
      return a.order - b.order;
    });
    for(var k = NodesinRow.length; k >= 1; k--)
    {
      currentNode = NodesinRow[k-1];
      outgoingEdges = CycleRemoval.outgoing(currentNode, Graph.links);
      lowerNeighborArray = [];
      if(outgoingEdges.length > 0)   // check if exsit upperNeighbor
      {
        for(var y = 0; y < outgoingEdges.length; y++)
        {
          index = outgoingEdges[y].to;
          lowerNeighbor = CycleRemoval.getNodeById(index, Graph.nodes); // get upperNeighbor of NodesinRow[m]
          lowerNeighborArray.push(lowerNeighbor);
        }

        lowerNeighborArray.sort(function(a,b){
          return a.order-b.order;
        }); //sort from small to big
        length = lowerNeighborArray.length;
        averageValue = (length + 1)/2;
        averageValueFloor = Math.floor(averageValue);
        averageValueCeil = Math.ceil(averageValue);

        for(var m = averageValueCeil; m >= averageValueFloor; m--) //m is index in upperNeighborArray
        {
          averageNode = lowerNeighborArray[m-1];
          if(currentNode.align == currentNode.root)
          {
            link = edgeBetweenTwoNodes(currentNode, averageNode, Graph);
            if(link != null && !link.ismark && r > averageNode.order)
            {
              currentNode.align = averageNode.id;
              averageNode.root = currentNode.root;
              averageNode.align = averageNode.root;
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

function place_block(v, graph)
{
  var alpha = 1;
  if(v.x === undefined)
  {
    v.x = 0;
    var w = v;
    var u;
    var layer;
    do
    {
      if(w.order > 1)
      {
        layer = VertexOrdering.getLayer(graph, w.rank);
        layer.sort(function(a,b){
          return a.order - b.order;
        });
        u = CycleRemoval.getNodeById(layer[w.order-2].root, graph.nodes);
        place_block(u, graph);
        if(v.sink == v.id)
        {
          v.sink = u.sink;
        }
        if(v.sink != u.sink)
        {
          CycleRemoval.getNodeById(u.sink, graph.nodes).shift =
          CycleRemoval.getNodeById(u.sink, graph.nodes).shift < (v.x - u.x - alpha)
          ? CycleRemoval.getNodeById(u.sink, graph.nodes).shift : (v.x - u.x - alpha);
        }else{
          v.x = v.x > (u.x + alpha) ? v.x : (u.x + alpha);
        }
      }
      w = CycleRemoval.getNodeById(w.align, graph.nodes);
    }while(w.id != v.id)
  }
}

function coordinateAsignment(graph)
{
  var len = graph.nodes.length;
  graph.nodes.sort(function(a,b){
    return a.id - b.id;
  });
  for(var i = 0; i < len; i++)
  {
    graph.nodes[i].sink = graph.nodes[i].id;
    graph.nodes[i].shift = Number.MAX_VALUE;
    graph.nodes[i].x = undefined;
  }

  for(i = 0; i < len; i++)
  {
    if(graph.nodes[i].root == graph.nodes[i].id)
    {
      place_block(graph.nodes[i], graph);
    }
  }

  var root;
  var sink;
  var shift;
  var node;
  for(i = 0; i < len; i++)
  {
    node = graph.nodes[i];
    root = graph.nodes[node.root-1];
    sink = graph.nodes[root.sink-1];
    shift = sink.shift;
    node.x = root.x;
    if(node == root && shift < Number.MAX_VALUE)
    {
      node.x = node.x + shift;
    }
  }
}

function xCoordinateAssignment(Graph)
{
  preprocessing(Graph);
  var lowerRightGraph = (JSON.parse(JSON.stringify(Graph)));
  var lowerLeftGraph = (JSON.parse(JSON.stringify(Graph)));
  var upperRightGraph = (JSON.parse(JSON.stringify(Graph)));
  var upperLeftGraph = (JSON.parse(JSON.stringify(Graph)));
  alignLowerRight(lowerRightGraph);
  alignLowerLeft(lowerLeftGraph);
  alignUpperRight(upperRightGraph);
  alignUpperLeft(upperLeftGraph);
  coordinateAsignment(lowerRightGraph);
  coordinateAsignment(lowerLeftGraph);
  coordinateAsignment(upperRightGraph);
  coordinateAsignment(upperLeftGraph);
  var lowerRightMaxX = Number.MIN_VALUE;
  var lowerRightMinX = Number.MAX_VALUE;
  var lowerRightWidth;
  var len = Graph.nodes.length;
   //get the node with max and min x coordinater in different four x coordinater assignment
  for(var i = 0; i < len; i++)
  {
    if(lowerRightGraph.nodes[i].x < lowerRightMinX)
    {
      lowerRightMinX = lowerRightGraph.nodes[i].x;
    }else if(lowerRightGraph.nodes[i].x > lowerRightMaxX){
      lowerRightMaxX = lowerRightGraph.nodes[i].x;
    }
  }
  lowerRightWidth = lowerRightMaxX - lowerRightMinX;

  var lowerLeftMaxX = Number.MIN_VALUE;
  var lowerLeftMinX = Number.MAX_VALUE;
  var lowerLeftWidth;
  for(i = 0; i < len; i++)
  {
    if(lowerLeftGraph.nodes[i].x < lowerLeftMinX)
    {
      lowerLeftMinX = lowerLeftGraph.nodes[i].x;
    }else if(lowerLeftGraph.nodes[i].x > lowerLeftMaxX){
      lowerLeftMaxX = lowerLeftGraph.nodes[i].x;
  }
}
  lowerLeftWidth = lowerLeftMaxX - lowerLeftMinX;

  var upperRightMaxX = Number.MIN_VALUE;
  var upperRightMinX = Number.MAX_VALUE;
  var upperRightWidth;
  for(i = 0; i < len; i++)
  {
    if(upperRightGraph.nodes[i].x < upperRightMinX)
    {
      upperRightMinX = upperRightGraph.nodes[i].x;
    }else if(upperRightGraph.nodes[i].x > upperRightMaxX){
      upperRightMaxX = upperRightGraph.nodes[i].x;
    }
  }
  upperRightWidth = upperRightMaxX - upperRightMinX;

  var upperLeftMaxX = Number.MIN_VALUE;
  var upperLeftMinX = Number.MAX_VALUE;
  var upperLeftWidth;
  for(i = 0; i < len; i++)
  {
    if(upperLeftGraph.nodes[i].x < upperLeftMinX)
    {
      upperLeftMinX = upperLeftGraph.nodes[i].x;
    }else if(upperLeftGraph.nodes[i].x > upperLeftMaxX){
      upperLeftMaxX = upperLeftGraph.nodes[i].x;
    }
  }
  upperLeftWidth = upperLeftMaxX - upperLeftMinX;

 //find out the smallest width and assign the max and min x coordinater
 //of this graph to other max and min node in other three graph
  var minWidth = lowerLeftWidth;
  var alignMin = lowerLeftMinX;
  var alignMax = lowerLeftMaxX;
  if(lowerRightWidth < minWidth)
  {
    minWidth = lowerRightWidth;
    alignMin = lowerRightMinX;
    alignMax = lowerRightMaxX;
  }
  if(upperLeftWidth < minWidth)
  {
    minWidth = upperLeftWidth;
    alignMin = upperLeftMinX;
    alignMax = upperLeftMaxX;
  }
  if(upperRightWidth < minWidth)
  {
    minWidth = upperRightWidth;
    alignMin = upperRightMinX;
    alignMax = upperRightMaxX;
  }

  //do the adjustment of every node
  var shift;
  shift = alignMin - lowerLeftMinX;
  if(shift != 0)
  {
    for(i = 0; i < len; i++)
    {
      lowerLeftGraph.nodes[i].x = lowerLeftGraph.nodes[i].x + shift;
    }
  }
  shift = alignMin - upperLeftMinX;
  if(shift != 0)
  {
    for(i = 0; i < len; i++)
    {
      upperLeftGraph.nodes[i].x = upperLeftGraph.nodes[i].x + shift;
    }
  }
  shift = alignMax - lowerRightMaxX;
  if(shift != 0)
  {
    for(i = 0; i < len; i++)
    {
      lowerRightGraph.nodes[i].x = lowerRightGraph.nodes[i].x + shift;
    }
  }
  shift = alignMax - upperRightMaxX;
  if(shift != 0)
  {
    for(i = 0; i < len; i++)
    {
      upperRightGraph.nodes[i].x = upperRightGraph.nodes[i].x + shift;
    }
  }

//get the balanced postion of each node
  var xCoordinateCandidate;
  for(i = 0; i < len; i++)
  {
    xCoordinateCandidate = [];
    xCoordinateCandidate.push(upperLeftGraph.nodes[i].x);
    xCoordinateCandidate.push(upperRightGraph.nodes[i].x);
    xCoordinateCandidate.push(lowerLeftGraph.nodes[i].x);
    xCoordinateCandidate.push(lowerRightGraph.nodes[i].x);
    xCoordinateCandidate.sort();
    Graph.nodes[i].x = (xCoordinateCandidate[1]+xCoordinateCandidate[2])/2;
  }
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
/*for(var i = 0; i < Graph.nodes.length; i++)
{
  console.log(Graph.nodes[i].x);
}*/
