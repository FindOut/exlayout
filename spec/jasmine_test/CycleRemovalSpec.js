var CycleRemoval = require("../../app/js/CycleRemoval.js");
var helpFunctions = require("../../app/js/helpFunctions.js");

describe("Test for CycleRemoval", function(){
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
    CycleRemoval.cycleRemoval(graph);
    expect(helpFunctions.testDAG(graph)).toBe(true);
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
    CycleRemoval.cycleRemoval(graph);
    expect(helpFunctions.testDAG(graph)).toBe(true);
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
    CycleRemoval.cycleRemoval(graph);
    expect(helpFunctions.testDAG(graph)).toBe(true);
  });

  it("Bigger graph which is not DAG", function() {
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
    CycleRemoval.cycleRemoval(graph);
    expect(helpFunctions.testDAG(graph)).toBe(true);
  });

  it("Even bigger graph which is not DAG", function() {
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
    CycleRemoval.cycleRemoval(graph);
    expect(helpFunctions.testDAG(graph)).toBe(true);
  });
});
