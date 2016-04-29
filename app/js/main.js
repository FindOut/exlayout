
var Sugiyama = require("./Sugiyama.js");
var ConnectedGraphDetect = require("./ConnectedGraphDetection.js");

exports.main = function(graph){
  return main(graph);
};

function main(graph)
{
  var allGraphs = ConnectedGraphDetect.connectedGraphDetect(graph);
  for(var i = 0; i < allGraphs.length; i++)
  {
    Sugiyama.sugiyama(allGraphs[i]);
  }
  return allGraphs;
}
