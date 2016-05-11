
var Sugiyama = require("./Sugiyama.js");
var ConnectedGraphDetect = require("./ConnectedGraphDetection.js");
var BoxGraphController = require("./BoxgraphDetection.js");

exports.main = function(graph){
  return main(graph);
};

//sugiyama should be executed for each subgraph in graph array
function main(graph)
{
  //get graph array
  var allGraphs = ConnectedGraphDetect.connectedGraphDetect(graph);
  //do sugiyama to subgraph in which boxes are instead by falseNode
  for(var i = 0; i < allGraphs.length; i++)
  {
    var graphWithFalseNode = BoxGraphController.boxGraphController(allGraphs[i]);
    //console.log(allGraphs[i]);
    Sugiyama.sugiyama(graphWithFalseNode);
    //console.log(graphWithFalseNode);
  }
  return allGraphs;
}

//do sugiyama to boxGraphs in each subgraph
function boxGraphSugiyama(graph){
  //get graph array
  var allGraphs = ConnectedGraphDetect.connectedGraphDetect(graph);

  for(var i = 0; i < allGraphs.length; i++)
  {
    var boxgraphs = BoxGraphController.boxgraphDetection(allGraphs[i]);
    var currentGroupNum = allGraphs[i].groupnumber;
    for(var j = 1; j < boxgraphs.length; j++)
    {
      boxgraphs[j].groupnumber = currentGroupNum;
      //console.log(boxgraphs[j]);
      Sugiyama.sugiyama(boxgraphs[j]); // do sugiyama on each boxgraph
    }
  }
  //return boxgraphs;
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
}*/
var graph = {
  "nodes": [
    {"id": 1, "label": "1"},
    {"id": 2, "label": "2"},
    {"id": 3, "label": "3"},
    {"id": 4, "label": "4"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 3, "to": 2},
    {"from": 4, "to": 2}
  ]
}

console.log(JSON.stringify(main(graph), null, 2));
