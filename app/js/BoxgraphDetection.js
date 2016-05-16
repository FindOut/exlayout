exports.getBoxGraph = function(graph){
  return getBoxGraph(graph);
};

function getBoxGraph(graph){
  var boxGraphs = boxgraphDetection(graph);
  if(boxGraphs.length > 0)
  {
    hideBox(graph, boxGraphs);
    return boxGraphs;
  }
  return [];
}

function boxgraphDetection(graph){
  var nodes = graph.nodes;
  var links = graph.links;
  var nodeslength = nodes.length;
  var linkslength = links.length;
  var box;
  var boxGraphs = [];

  //find max box Number
  var maxBoxNum = Number.MIN_VALUE;
  for(var i = 0; i < nodeslength; i++)
  {
    if(nodes[i].box !== null && nodes[i].box > maxBoxNum)
    {
      maxBoxNum = nodes[i].box;
    }
  }

  //box number begins from 1, the first element in boxgraph is not used
  for(var counter = 0; counter <= maxBoxNum; counter++)
  {
    box = {"nodes":[], "links": [], "box": counter, "graph": null};
    boxGraphs.push(box);
    //get nodes whose box is the same
    for(var j = 0; j < nodeslength; j++)
    {
      if(nodes[j].box === counter)
      {
        box.nodes.push(nodes[j]);
      }
    }
    //get links whose box is the same
    for(var i = 0; i < linkslength; i++)
    {
      if(links[i].box === counter)
      {
        box.links.push(links[i]);
      }
    }
  }
  return boxGraphs;
}

//se the whole box as one false node and all links to nodes in box will connect to the false node
function hideBox(graph, boxGraphs){
  var len = boxGraphs.length;
  var len1;
  var minId;
  for(var i = 0; i < len; i++)
  {
    len1 = boxGraphs[i].nodes.length;
    minId = Number.MAX_VALUE;
    for(var j = 0; j < len1; j++)
    {
      if(boxGraphs[i].nodes[j].id < minId)
      {
        minId = boxGraphs[i].nodes[j].id;
      }
    }
    boxGraphs[i].minId = minId;
    for(var k = 0; k < graph.links.length; k++)
    {
      if(graph.links[k].from === ("box"+boxGraphs[i].box))
      {
        graph.links[k].from = minId;
      }else if(graph.links[k].to === ("box"+boxGraphs[i].box)){
        graph.links[k].to = minId;
      }
    }
    for(j = 0; j < graph.nodes.length; j++)
    {
      if(graph.nodes[j].box === boxGraphs[i].box && graph.nodes[j].id != minId)
      {
        graph.nodes.splice(j,1);
        j--;
      }
    }
    for(j = 0; j < graph.links.length; j++)
    {
      if(graph.links[j].box !== null)
      {
        graph.links.splice(j,1);
        j--;
      }
    }
  }
}

/*var graph = {
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
}*/
/*hideBox(graph, boxgraphDetection(graph));
console.log(graph);*/
