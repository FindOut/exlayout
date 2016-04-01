var o = require("../../app/js/CycleRemoval.js");

function testDAG(v,e)
{
  var nodes = v;
  var temporaryNodes = (JSON.parse(JSON.stringify(v)));
  var links = e;
  var temporaryEdges = (JSON.parse(JSON.stringify(e)));
  var list = [];
  var sources = [];
  var node;
  var neighbor;
  for(var i = o.containsSource(temporaryNodes,links); i != null; i = o.containsSource(temporaryNodes,links))
  {
    sources.push(i);
    temporaryNodes = o.deleteNode(i,temporaryNodes);
  }
  while(sources.length > 0)
  {
    node = sources.pop();
    list.push(node);
    for(i = 0; i < temporaryEdges.length; i++)
    {
      if(temporaryEdges[i].from === node.id)
      {
        neighbor = nodes[temporaryEdges[i].to-1];
        links = o.deleteLinks([temporaryEdges[i]],links);
        if(o.ingoing(neighbor,links).length == 0)
        {
          sources.push(neighbor);
        }
      }
    }
  }
  if(links.length > 0)
  {
    return false;
  }else{
    return true;
  }
}

describe("Test for DAG", function(){
  it("Simple graph which is DAG", function() {
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3}
      ]
    };
    expect(testDAG(graph.nodes, graph.links)).toBe(true);
  });

  it("Simple graph which is not DAG", function() {
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3},
        {"from": 3, "to": 1}
      ]
    };
    expect(testDAG(graph.nodes, graph.links)).toBe(false);
  });

  it("Bigger graph which is DAG", function() {
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},

      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3},
        {"from": 2, "to": 5},
        {"from": 2, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 5},
        {"from": 5, "to": 6},
        {"from": 7, "to": 4}
      ]
    };
    expect(testDAG(graph.nodes, graph.links)).toBe(true);
  });

  it("Bigger graph which is not DAG", function() {
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},

      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 5},
        {"from": 2, "to": 3},
        {"from": 3, "to": 1},
        {"from": 3, "to": 4},
        {"from": 4, "to": 5},
        {"from": 4, "to": 6},
        {"from": 5, "to": 2},
        {"from": 5, "to": 3},
        {"from": 6, "to": 5}
      ]
    };
    expect(testDAG(graph.nodes, graph.links)).toBe(false);
  });
});
