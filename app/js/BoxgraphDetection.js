exports.boxgraphDetection = function(graph){
  return boxgraphDetection(graph);
};

exports.boxGraphController = function(graph){
  return boxGraphController(graph);
};

function boxGraphController(graph){
  var boxGraphs = boxgraphDetection(graph);
  hideBox(boxGraphs, graph.nodes, graph.links, graph);
  deleteNodesAndLinksInBox(boxGraphs, graph);
  return graph;
}

function boxgraphDetection(graph){
  var nodes = graph.nodes;
  var links = graph.links;
  var nodeslength = nodes.length;
  var linkslength = links.length;
  var boxgraphs = [];

  //find max box Number
  var maxBoxNum = Number.MIN_VALUE;
  for(var i = 0; i < nodeslength; i++)
  {
    if(nodes[i].box > maxBoxNum)
    {
      maxBoxNum = nodes[i].box;
    }
  }

  //box number begins from 1, the first element in boxgraph is not used
  for(var counter = 1; counter <= maxBoxNum; counter++)
  {
    boxgraphs[counter] = {"nodes":[], "links": [], "box": counter, "groupnumber": null};
    //get nodes whose box is the same
    var nodetoDelete = [];
    for(var j = 0; j < nodeslength; j++)
    {
      if(nodes[j].box == counter)
      {
        boxgraphs[counter].nodes.push(nodes[j]);
      }
    }
    //get links whose box is the same
    for(var i = 0; i < linkslength; i++)
    {
      if(links[i].box == counter)
      {
        boxgraphs[counter].links.push(links[i]);
      }
    }
  }
  return boxgraphs;
}

//se the whole box as one false node and all links to nodes in box will connect to the false node
function hideBox(boxgraphs, nodes, links, graph){
  for(var i = 1; i < boxgraphs.length; i++)
  {
    var boxNodes = boxgraphs[i].nodes;
    var falseNode = {"id": null, "label": "boxNode", "box": null, "group": null};
    var minId = Number.MAX_VALUE;
    var currentBoxNumber = i;
    var changedlinks = [];

    falseNode.box = currentBoxNumber;
    falseNode.group = boxNodes[0].group;
    //add false node
    graph.nodes.push(falseNode);

    //get minId as the falseNode ID
    for(var j = 0; j < boxNodes.length; j++)
    {
      if(minId > boxNodes[j].id)
      {
        minId = boxNodes[j].id;
      }
    }
    falseNode.id = minId;


    //check the links connect to each node in box
    for(var m = 0; m < boxNodes.length; m++)
    {
      for(var n = 0; n < links.length; n++)
      {
        if(links[n].from == boxNodes[m].id && links[n].box != currentBoxNumber) //start from box, end outside
        {
          changedlinks.push(links[n]);
          links[n].from = falseNode.id;
          deleteDoubleLink(links[n].from, links[n].to, graph);
        }
        if(links[n].to == boxNodes[m].id && links[n].box != currentBoxNumber)//start from outside node, end in box
        {
          changedlinks.push(links[n]);
          links[n].to = falseNode.id;
          deleteDoubleLink(links[n].from, links[n].to, graph);
        }
      }
    }
  }
}

function deleteNodesAndLinksInBox(boxgraphs, graph){
  for(var i = 1; i < boxgraphs.length; i++)
  {
    var boxgraph = boxgraphs[i];
    //delete node in box
    for(var j = 0; j < boxgraph.nodes.length; j++)
    {
      for(var m = 0; m < graph.nodes.length; m++)
      {
        if(graph.nodes[m].id == boxgraph.nodes[j].id && graph.nodes[m].box != null)
        {
          graph.nodes.splice(m,1);
          //console.log(graph);
          break;
        }
      }
    }
    //delete links in box
    for(var i = 0; i < boxgraph.links.length; i++)
    {
      for(var j = 0; j < graph.links.length; j++)
      {
        if(graph.links[j].from == boxgraph.links[i].from && graph.links[j].to == boxgraph.links[i].to)
        {
          graph.links.splice(j, 1);
          //console.log(graph);
          break;
        }
      }
    }
  }
}

function deleteDoubleLink(from, to, graph)
{
  counter = 0;
  for(var i = 0; i < graph.links.length; i++)
  {
    if(graph.links[i].from == from && graph.links[i].to == to)
    {
      counter++;
      if(counter > 1)
      {
        graph.links.splice(i, 1);
      }
    }
  }
}
/*var graph = {
  "nodes": [
    {"id": 1, "label": "1", "box":null},
    {"id": 2, "label": "2", "box":null},
    {"id": 3, "label": "3", "box": 1},
    {"id": 4, "label": "4", "box": 1}
  ],
  "links": [
    {"from": 1, "to": 2, "box":null},
    {"from": 3, "to": 4, "box":1},
    {"from": 4, "to": 2, "box":null},
    {"from": 1, "to": 4, "box":null},
    {"from": 1, "to": 3, "box":null}
  ]
}

var graph = {
  "nodes": [
    {"id": 1, "label": "1", "box":null},
    {"id": 2, "label": "2","box":null},
    {"id": 3, "label": "3","box":null},
    {"id": 4, "label": "4","box":null}
  ],
  "links": [
    {"from": 1, "to": 2,"box":null},
    {"from": 3, "to": 2,"box":null},
    {"from": 4, "to": 2,"box":null}
  ]
}
console.log(boxGraphController(graph));*/
