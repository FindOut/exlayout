var helpFunctions = require("../../app/js/helpFunctions.js");

describe("Test all functions in helpFunctions.js", function(){
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
    var list = helpFunctions.topologicalOrder(graph);
    graph.nodes = list;
    var len = graph.links.length;
    for(var i = 0; i < len; i++)
    {
      expect(list.indexOf(helpFunctions.getNodeById(graph.links[i].from, graph.nodes))
      -list.indexOf(helpFunctions.getNodeById(graph.links[i].to, graph.nodes))).toBeLessThan(0);
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
    list = helpFunctions.topologicalOrder(graph);
    graph.nodes = list;
    len = graph.links.length;
    for(i = 0; i < len; i++)
    {
      expect(list.indexOf(helpFunctions.getNodeById(graph.links[i].from, graph.nodes))
      -list.indexOf(helpFunctions.getNodeById(graph.links[i].to, graph.nodes))).toBeLessThan(0);
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
    list = helpFunctions.topologicalOrder(graph);
    graph.nodes = list;
    len = graph.links.length;
    for(i = 0; i < len; i++)
    {
      expect(list.indexOf(helpFunctions.getNodeById(graph.links[i].from, graph.nodes))
      -list.indexOf(helpFunctions.getNodeById(graph.links[i].to, graph.nodes))).toBeLessThan(0);
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
    expect(helpFunctions.testDAG(graph)).toBe(false);

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
    expect(helpFunctions.testDAG(graph)).toBe(true);

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
    expect(helpFunctions.testDAG(graph)).toBe(false);

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
    expect(helpFunctions.testDAG(graph)).toBe(true);
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
    expect(helpFunctions.getNodeById(10, graph.nodes).id).toBe(10);
    expect(helpFunctions.getNodeById(5, graph.nodes).id).toBe(5);
    expect(helpFunctions.getNodeById(3, graph.nodes).id).toBe(3);
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
    expect(helpFunctions.ingoing(graph.nodes[0], graph.links)).toContain(graph.links[3]);
    expect(helpFunctions.ingoing(graph.nodes[0], graph.links)).not.toContain(graph.links[1]);
    expect(helpFunctions.ingoing(graph.nodes[4], graph.links)).toContain(graph.links[1]);
    expect(helpFunctions.ingoing(graph.nodes[4], graph.links)).toContain(graph.links[5]);
    expect(helpFunctions.ingoing(graph.nodes[4], graph.links)).toContain(graph.links[9]);
    expect(helpFunctions.ingoing(graph.nodes[4], graph.links)).not.toContain(graph.links[6]);
    expect(helpFunctions.ingoing(graph.nodes[4], graph.links)).not.toContain(graph.links[7]);
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
    expect(helpFunctions.outgoing(graph.nodes[0], graph.links)).toContain(graph.links[0]);
    expect(helpFunctions.outgoing(graph.nodes[0], graph.links)).not.toContain(graph.links[2]);
    expect(helpFunctions.outgoing(graph.nodes[3], graph.links)).toContain(graph.links[5]);
    expect(helpFunctions.outgoing(graph.nodes[3], graph.links)).toContain(graph.links[6]);
    expect(helpFunctions.outgoing(graph.nodes[3], graph.links)).not.toContain(graph.links[4]);
    expect(helpFunctions.outgoing(graph.nodes[3], graph.links)).not.toContain(graph.links[8]);
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
    expect(helpFunctions.containsSource(graph.nodes, graph.links)).not.toBe(null);

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
    expect(helpFunctions.containsSource(graph.nodes, graph.links)).toBe(null);
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
    expect(helpFunctions.containsSink(graph.nodes, graph.links)).toBe(null);

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
    expect(helpFunctions.containsSink(graph.nodes, graph.links)).not.toBe(null);
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
    helpFunctions.deleteLinks([{"from": 3, "to": 1},{"from": 4, "to": 5}], graph.links);
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
    helpFunctions.deleteNode({"id": 6, "label": "F"}, graph.nodes);
    expect(graph.nodes).not.toContain({"id": 6, "label": "F"});
    expect(graph.nodes).toContain({"id": 5, "label": "E"});
    helpFunctions.deleteNode({"id": 3, "label": "C"}, graph.nodes);
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
    var iso = helpFunctions.isolatedNodes(graph.nodes, graph.links);
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
    expect(helpFunctions.maximumNode(graph.nodes, graph.links)).not.toEqual({"id": 2, "label": "B"});
    expect(helpFunctions.maximumNode(graph.nodes, graph.links)).toEqual({"id": 1, "label": "A"});

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
    expect(helpFunctions.maximumNode(graph.nodes, graph.links)).not.toEqual({"id": 1, "label": "A"});
    expect(helpFunctions.maximumNode(graph.nodes, graph.links)).toEqual({"id": 2, "label": "B"});
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
    helpFunctions.reverse(links);
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
    helpFunctions.reverse(links);
    expect(links).not.toEqual(linksReversed);
  });

  it("Test getNodeCrossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 2, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 2, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 1, "order": 1, "isDummy": false},
        {"id": 4, "label": "D", "rank": 1, "order": 2, "isDummy": false},
        {"id": 5, "label": "E", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 3},
        {"from": 1, "to": 4},
        {"from": 1, "to": 5},
        {"from": 2, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5}
      ]
    };
    expect(helpFunctions.getNodeCrossing(graph.nodes[0], graph.nodes[1], graph))
      .toBe(3);
  });

  it("Test getLayerCrossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 2, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 2, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 2, "order": 3, "isDummy": false},
        {"id": 4, "label": "D", "rank": 1, "order": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 1, "order": 2, "isDummy": false},
        {"id": 6, "label": "F", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 4},
        {"from": 1, "to": 6},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 3, "to": 4}
      ]
    };
    expect(helpFunctions.getLayerCrossing(helpFunctions.getLayer(graph,2), graph))
      .toBe(4);
  });

  it("Test getTotalCrossing", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 3, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 3, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 3, "order": 3, "isDummy": false},
        {"id": 4, "label": "D", "rank": 2, "order": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 2, "order": 2, "isDummy": false},
        {"id": 6, "label": "F", "rank": 2, "order": 3, "isDummy": false},
        {"id": 7, "label": "G", "rank": 1, "order": 1, "isDummy": false},
        {"id": 8, "label": "H", "rank": 1, "order": 2, "isDummy": false},
        {"id": 9, "label": "I", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 4},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 3, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 9},
        {"from": 5, "to": 7},
        {"from": 5, "to": 8},
        {"from": 6, "to": 7},
        {"from": 6, "to": 8}
      ]
    };
    expect(helpFunctions.getTotalCrossing(graph)).toBe(8);
  });

  it("Test getLayer", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 3, "order": 1, "isDummy": false},
        {"id": 2, "label": "B", "rank": 3, "order": 2, "isDummy": false},
        {"id": 3, "label": "C", "rank": 3, "order": 3, "isDummy": false},
        {"id": 4, "label": "D", "rank": 2, "order": 1, "isDummy": false},
        {"id": 5, "label": "E", "rank": 2, "order": 2, "isDummy": false},
        {"id": 6, "label": "F", "rank": 2, "order": 3, "isDummy": false},
        {"id": 7, "label": "G", "rank": 1, "order": 1, "isDummy": false},
        {"id": 8, "label": "H", "rank": 1, "order": 2, "isDummy": false},
        {"id": 9, "label": "I", "rank": 1, "order": 3, "isDummy": false}
      ],
      "links": [
        {"from": 1, "to": 4},
        {"from": 2, "to": 5},
        {"from": 2, "to": 6},
        {"from": 3, "to": 4},
        {"from": 3, "to": 5},
        {"from": 4, "to": 9},
        {"from": 5, "to": 7},
        {"from": 5, "to": 8},
        {"from": 6, "to": 7},
        {"from": 6, "to": 8}
      ]
    };
    var layer = helpFunctions.getLayer(graph,1);
    expect(layer).toContain(graph.nodes[6]);
    expect(layer).toContain(graph.nodes[8]);
    layer = helpFunctions.getLayer(graph,3);
    expect(layer).toContain(graph.nodes[0]);
    expect(layer).toContain(graph.nodes[1]);
  });

  it("Test edgeBetweenTwoNodes", function(){
    var graph = {
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
    expect(helpFunctions.edgeBetweenTwoNodes(graph.nodes[8], graph.nodes[15], graph))
      .toEqual({"from": 9, "to": 16, "ismark": false});
    expect(helpFunctions.edgeBetweenTwoNodes(graph.nodes[4], graph.nodes[9], graph))
      .toBe(null);
    expect(helpFunctions.edgeBetweenTwoNodes(graph.nodes[16], graph.nodes[23], graph))
      .toEqual({"from": 17, "to": 24, "ismark": false});
  });
});
