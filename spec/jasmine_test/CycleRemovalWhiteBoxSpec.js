var CycleRemoval = require("../../app/js/CycleRemoval.js");
var Initialize = require("../../app/js/Initialize.js");

describe("White box test for cycleRemoval", function(){
  it("Test topologicalOrder function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"}
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
    Initialize.initialize(graph);
    var list = CycleRemoval.topologicalOrder(graph);
    graph.nodes = list;
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect(list.indexOf(CycleRemoval.getNodeById(graph.links[i].from, graph.nodes))
      -list.indexOf(CycleRemoval.getNodeById(graph.links[i].to, graph.nodes))).toBeLessThan(0);
    }

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},
        {"id": 8, "label": "H"},
        {"id": 9, "label": "I"},
        {"id": 10, "label": "J"},
        {"id": 11, "label": "K"}
      ],
      "links": [
        {"from": 1, "to": 3},
        {"from": 1, "to": 4},
        {"from": 1, "to": 5},
        {"from": 2, "to": 4},
        {"from": 2, "to": 6},
        {"from": 3, "to": 7},
        {"from": 3, "to": 8},
        {"from": 3, "to": 9},
        {"from": 4, "to": 8},
        {"from": 5, "to": 9},
        {"from": 6, "to": 11},
        {"from": 8, "to": 10},
        {"from": 8, "to": 11}
      ]
    };
    Initialize.initialize(graph);
    list = CycleRemoval.topologicalOrder(graph);
    graph.nodes = list;
    len = graph.links.length;
    for(i = 0; i < len; i++)
    {
      expect(list.indexOf(CycleRemoval.getNodeById(graph.links[i].from, graph.nodes))
      -list.indexOf(CycleRemoval.getNodeById(graph.links[i].to, graph.nodes))).toBeLessThan(0);
    }

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},
        {"id": 8, "label": "H"},
        {"id": 9, "label": "I"},
        {"id": 10, "label": "J"},
        {"id": 11, "label": "K"},
        {"id": 12, "label": "L"},
        {"id": 13, "label": "M"},
        {"id": 14, "label": "N"},
        {"id": 15, "label": "O"},
        {"id": 16, "label": "P"}
      ],
      "links": [
        {"from": 1, "to": 14},
        {"from": 1, "to": 9},
        {"from": 1, "to": 15},
        {"from": 1, "to": 8},
        {"from": 2, "to": 3},
        {"from": 2, "to": 14},
        {"from": 2, "to": 10},
        {"from": 3, "to": 13},
        {"from": 3, "to": 14},
        {"from": 3, "to": 11},
        {"from": 3, "to": 15},
        {"from": 4, "to": 10},
        {"from": 4, "to": 7},
        {"from": 4, "to": 12},
        {"from": 4, "to": 9},
        {"from": 5, "to": 8},
        {"from": 6, "to": 11},
        {"from": 6, "to": 8},
        {"from": 6, "to": 10},
        {"from": 6, "to": 7},
        {"from": 7, "to": 16},
        {"from": 8, "to": 15},
        {"from": 9, "to": 16},
        {"from": 10, "to": 12},
        {"from": 10, "to": 15},
        {"from": 11, "to": 15}
      ]
    };
    Initialize.initialize(graph);
    list = CycleRemoval.topologicalOrder(graph);
    graph.nodes = list;
    len = graph.links.length;
    for(i = 0; i < len; i++)
    {
      expect(list.indexOf(CycleRemoval.getNodeById(graph.links[i].from, graph.nodes))
      -list.indexOf(CycleRemoval.getNodeById(graph.links[i].to, graph.nodes))).toBeLessThan(0);
    }
  });

  it("Test testDAG function", function(){
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
    Initialize.initialize(graph);
    expect(CycleRemoval.testDAG(graph)).toBe(false);

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"}

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
    Initialize.initialize(graph);
    expect(CycleRemoval.testDAG(graph)).toBe(true);

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},
        {"id": 8, "label": "H"},
        {"id": 9, "label": "I"},
        {"id": 10, "label": "J"},
        {"id": 11, "label": "K"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7},
        {"from": 4, "to": 2},
        {"from": 4, "to": 8},
        {"from": 6, "to": 5},
        {"from": 6, "to": 4},
        {"from": 7, "to": 9},
        {"from": 8, "to": 10},
        {"from": 8, "to": 11}
      ]
    };
    Initialize.initialize(graph);
    expect(CycleRemoval.testDAG(graph)).toBe(false);

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},
        {"id": 8, "label": "H"},
        {"id": 9, "label": "I"},
        {"id": 10, "label": "J"},
        {"id": 11, "label": "K"},
        {"id": 12, "label": "L"},
        {"id": 13, "label": "M"},
        {"id": 14, "label": "N"},
        {"id": 15, "label": "O"},
        {"id": 16, "label": "P"}
      ],
      "links": [
        {"from": 1, "to": 14},
        {"from": 1, "to": 9},
        {"from": 1, "to": 15},
        {"from": 1, "to": 8},
        {"from": 2, "to": 3},
        {"from": 2, "to": 14},
        {"from": 2, "to": 10},
        {"from": 3, "to": 13},
        {"from": 3, "to": 14},
        {"from": 3, "to": 11},
        {"from": 3, "to": 15},
        {"from": 4, "to": 10},
        {"from": 4, "to": 7},
        {"from": 4, "to": 12},
        {"from": 4, "to": 9},
        {"from": 5, "to": 8},
        {"from": 6, "to": 11},
        {"from": 6, "to": 8},
        {"from": 6, "to": 10},
        {"from": 6, "to": 7},
        {"from": 7, "to": 16},
        {"from": 8, "to": 15},
        {"from": 9, "to": 16},
        {"from": 10, "to": 12},
        {"from": 10, "to": 15},
        {"from": 11, "to": 15}
      ]
    };
    Initialize.initialize(graph);
    expect(CycleRemoval.testDAG(graph)).toBe(true);
  });

  it("Test getNodeById function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},
        {"id": 8, "label": "H"},
        {"id": 9, "label": "I"},
        {"id": 10, "label": "J"},
        {"id": 11, "label": "K"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 2, "to": 3},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7},
        {"from": 4, "to": 2},
        {"from": 4, "to": 8},
        {"from": 6, "to": 5},
        {"from": 6, "to": 4},
        {"from": 7, "to": 9},
        {"from": 8, "to": 10},
        {"from": 8, "to": 11}
      ]
    };
    Initialize.initialize(graph);
    expect(CycleRemoval.getNodeById(10, graph.nodes).id).toBe(10);
    expect(CycleRemoval.getNodeById(5, graph.nodes).id).toBe(5);
    expect(CycleRemoval.getNodeById(3, graph.nodes).id).toBe(3);
  });

  it("Test ingoing function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"}
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
    Initialize.initialize(graph);
    expect(CycleRemoval.ingoing(graph.nodes[0], graph.links)).toContain(graph.links[3]);
    expect(CycleRemoval.ingoing(graph.nodes[0], graph.links)).not.toContain(graph.links[1]);
    expect(CycleRemoval.ingoing(graph.nodes[4], graph.links)).toContain(graph.links[1]);
    expect(CycleRemoval.ingoing(graph.nodes[4], graph.links)).toContain(graph.links[5]);
    expect(CycleRemoval.ingoing(graph.nodes[4], graph.links)).toContain(graph.links[9]);
    expect(CycleRemoval.ingoing(graph.nodes[4], graph.links)).not.toContain(graph.links[6]);
    expect(CycleRemoval.ingoing(graph.nodes[4], graph.links)).not.toContain(graph.links[7]);
  });

  it("Test outgoing function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"}
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
    Initialize.initialize(graph);
    expect(CycleRemoval.outgoing(graph.nodes[0], graph.links)).toContain(graph.links[0]);
    expect(CycleRemoval.outgoing(graph.nodes[0], graph.links)).not.toContain(graph.links[2]);
    expect(CycleRemoval.outgoing(graph.nodes[3], graph.links)).toContain(graph.links[5]);
    expect(CycleRemoval.outgoing(graph.nodes[3], graph.links)).toContain(graph.links[6]);
    expect(CycleRemoval.outgoing(graph.nodes[3], graph.links)).not.toContain(graph.links[4]);
    expect(CycleRemoval.outgoing(graph.nodes[3], graph.links)).not.toContain(graph.links[8]);
  });

  it("Test containsSource function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"}

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
    Initialize.initialize(graph);
    expect(CycleRemoval.containsSource(graph.nodes, graph.links)).not.toBe(null);

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"}

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
    Initialize.initialize(graph);
    expect(CycleRemoval.containsSource(graph.nodes, graph.links)).toBe(null);
  });

  it("Test containsSink function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"}

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
    Initialize.initialize(graph);
    expect(CycleRemoval.containsSink(graph.nodes, graph.links)).toBe(null);

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"},
        {"id": 8, "label": "H"},
        {"id": 9, "label": "I"},
        {"id": 10, "label": "J"},
        {"id": 11, "label": "K"},
        {"id": 12, "label": "L"},
        {"id": 13, "label": "M"},
        {"id": 14, "label": "N"},
        {"id": 15, "label": "O"},
        {"id": 16, "label": "P"}
      ],
      "links": [
        {"from": 1, "to": 14},
        {"from": 1, "to": 9},
        {"from": 1, "to": 15},
        {"from": 1, "to": 8},
        {"from": 2, "to": 3},
        {"from": 2, "to": 14},
        {"from": 2, "to": 10},
        {"from": 3, "to": 13},
        {"from": 3, "to": 14},
        {"from": 3, "to": 11},
        {"from": 3, "to": 15},
        {"from": 4, "to": 10},
        {"from": 4, "to": 7},
        {"from": 4, "to": 12},
        {"from": 4, "to": 9},
        {"from": 5, "to": 8},
        {"from": 6, "to": 11},
        {"from": 6, "to": 8},
        {"from": 6, "to": 10},
        {"from": 6, "to": 7},
        {"from": 7, "to": 16},
        {"from": 8, "to": 15},
        {"from": 9, "to": 16},
        {"from": 10, "to": 12},
        {"from": 10, "to": 15},
        {"from": 11, "to": 15}
      ]
    };
    Initialize.initialize(graph);
    expect(CycleRemoval.containsSink(graph.nodes, graph.links)).not.toBe(null);
  });

  it("Test deleteLinks function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"}

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
    CycleRemoval.deleteLinks([{"from": 3, "to": 1},{"from": 4, "to": 5}], graph.links);
    expect(graph.links).not.toContain({"from": 3, "to": 1});
    expect(graph.links).not.toContain({"from": 4, "to": 5});
    expect(graph.links).toContain({"from": 1, "to": 2});
    expect(graph.links).toContain({"from": 6, "to": 5});
  });

  it("Test deleteNode function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"}
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
    CycleRemoval.deleteNode({"id": 6, "label": "F"}, graph.nodes);
    expect(graph.nodes).not.toContain({"id": 6, "label": "F"});
    expect(graph.nodes).toContain({"id": 5, "label": "E"});
    CycleRemoval.deleteNode({"id": 3, "label": "C"}, graph.nodes);
    expect(graph.nodes).not.toContain({"id": 3, "label": "C"});
    expect(graph.nodes).toContain({"id": 5, "label": "E"});
  });

  it("Test isolatedNodes function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3}
      ]
    };
    var iso = CycleRemoval.isolatedNodes(graph.nodes, graph.links);
    expect(iso).toContain({"id": 4, "label": "D"});
    expect(iso).not.toContain({"id": 1, "label": "A"});
  });

  it("Test maximum function", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 3, "to": 4}
      ]
    };
    expect(CycleRemoval.maximum(graph.nodes, graph.links)).not.toEqual({"id": 2, "label": "B"});
    expect(CycleRemoval.maximum(graph.nodes, graph.links)).toEqual({"id": 1, "label": "A"});

    graph = {
      "nodes": [
        {"id": 1, "label": "A"},
        {"id": 2, "label": "B"},
        {"id": 3, "label": "C"},
        {"id": 4, "label": "D"},
        {"id": 5, "label": "E"},
        {"id": 6, "label": "F"},
        {"id": 7, "label": "G"}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 2, "to": 7},
        {"from": 3, "to": 5}
      ]
    };
    expect(CycleRemoval.maximum(graph.nodes, graph.links)).not.toEqual({"id": 1, "label": "A"});
    expect(CycleRemoval.maximum(graph.nodes, graph.links)).toEqual({"id": 2, "label": "B"});
  });

  it("Test reverse function", function(){
    var links = [
      {"from": 1, "to": 2},
      {"from": 1, "to": 3},
      {"from": 2, "to": 4},
      {"from": 2, "to": 5},
      {"from": 2, "to": 6},
      {"from": 2, "to": 7},
      {"from": 3, "to": 5}
    ];
    var linksReversed = [
      {"from": 2, "to": 1, "isReversed": true},
      {"from": 3, "to": 1, "isReversed": true},
      {"from": 4, "to": 2, "isReversed": true},
      {"from": 5, "to": 2, "isReversed": true},
      {"from": 6, "to": 2, "isReversed": true},
      {"from": 7, "to": 2, "isReversed": true},
      {"from": 5, "to": 3, "isReversed": true}
    ];
    CycleRemoval.reverse(links);
    expect(links).toEqual(linksReversed);

    links = [
      {"from": 1, "to": 2},
      {"from": 1, "to": 3},
      {"from": 2, "to": 4},
      {"from": 2, "to": 5},
      {"from": 2, "to": 6},
      {"from": 2, "to": 7},
      {"from": 3, "to": 5}
    ];
    linksReversed = [
      {"from": 2, "to": 1, "isReversed": true},
      {"from": 3, "to": 1, "isReversed": true},
      {"from": 2, "to": 4, "isReversed": true},
      {"from": 5, "to": 2, "isReversed": true},
      {"from": 6, "to": 2, "isReversed": true},
      {"from": 7, "to": 2, "isReversed": true},
      {"from": 5, "to": 3, "isReversed": true}
    ];
    CycleRemoval.reverse(links);
    expect(links).not.toEqual(linksReversed);
  });
});
