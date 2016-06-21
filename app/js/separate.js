var Sugiyama = require("./Sugiyama.js");
var ConnectedGraphDetect = require("./ConnectedGraphDetection.js");

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
    Sugiyama.sugiyama(allGraphs[i]);
  }
  return allGraphs;
}
