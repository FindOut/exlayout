var XCoordinateAssignment = require("../../app/js/XcoordinateAssignment.js");
var VertexOrdering = require("../../app/js/VertexOrdering.js");

describe("White box test for XCoordinateAssignment", function(){
  it("Test preprocessing", function(){
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
    var markedEdges = XCoordinateAssignment.preprocessing(graph);
    expect(markedEdges).toContain({"from": 9, "to": 12, "ismark": true});
    expect(markedEdges).toContain({"from": 10, "to": 12, "ismark": true});
    expect(markedEdges).toContain({"from": 11, "to": 22, "ismark": true});
    expect(markedEdges).toContain({"from": 16, "to": 19, "ismark": true});
  });

  it("Test isdummyPar", function(){
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
    expect(XCoordinateAssignment.isdummyPar(graph.nodes[12], graph)).not.toBe(null);
    expect(XCoordinateAssignment.isdummyPar(graph.nodes[19], graph)).not.toBe(null);
    expect(XCoordinateAssignment.isdummyPar(graph.nodes[9], graph)).toBe(null);
    expect(XCoordinateAssignment.isdummyPar(graph.nodes[23], graph)).toBe(null);
  });

  it("Test alignUpperLeft", function(){
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
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignUpperLeft(graph);
    expect(graph.nodes[1].align).toBe(5);
    expect(graph.nodes[8].align).toBe(9);
    expect(graph.nodes[9].align).toBe(15);
    expect(graph.nodes[20].align).toBe(26);

    var graph = {
      "nodes": [
        {"id": 1, "label": "H", "rank": 3, "isDummy": false, "order": 1},
        {"id": 2, "label": "I", "rank": 2, "isDummy": false, "order": 1},
        {"id": 3, "label": "J", "rank": 2, "isDummy": false, "order": 2},
        {"id": 4, "label": "K", "rank": 1, "isDummy": false, "order": 1},
        {"id": 5, "label": "L", "rank": 1, "isDummy": false, "order": 2},
        {"id": 6, "label": "M", "rank": 1, "isDummy": false, "order": 3},
        {"id": 7, "label": "N", "rank": 1, "isDummy": false, "order": 4}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7}
      ]
    };
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignUpperLeft(graph);
    expect(graph.nodes[0].align).toBe(2);
    expect(graph.nodes[2].align).toBe(6);
  });

  it("Test alignUpperRight", function(){
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
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignUpperRight(graph);
    expect(graph.nodes[14].align).toBe(22);
    expect(graph.nodes[18].align).toBe(24);
    expect(graph.nodes[21].align).toBe(26);

    var graph = {
      "nodes": [
        {"id": 1, "label": "H", "rank": 3, "isDummy": false, "order": 1},
        {"id": 2, "label": "I", "rank": 2, "isDummy": false, "order": 1},
        {"id": 3, "label": "J", "rank": 2, "isDummy": false, "order": 2},
        {"id": 4, "label": "K", "rank": 1, "isDummy": false, "order": 1},
        {"id": 5, "label": "L", "rank": 1, "isDummy": false, "order": 2},
        {"id": 6, "label": "M", "rank": 1, "isDummy": false, "order": 3},
        {"id": 7, "label": "N", "rank": 1, "isDummy": false, "order": 4}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7}
      ]
    };
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignUpperLeft(graph);
    expect(graph.nodes[0].align).toBe(2);
    expect(graph.nodes[2].align).toBe(6);
  });

  it("Test alignLowerLeft", function(){
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
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignLowerLeft(graph);
    expect(graph.nodes[16].align).toBe(24);
    expect(graph.nodes[10].align).toBe(18);
    expect(graph.nodes[1].align).toBe(2);

    var graph = {
      "nodes": [
        {"id": 1, "label": "H", "rank": 3, "isDummy": false, "order": 1},
        {"id": 2, "label": "I", "rank": 2, "isDummy": false, "order": 1},
        {"id": 3, "label": "J", "rank": 2, "isDummy": false, "order": 2},
        {"id": 4, "label": "K", "rank": 1, "isDummy": false, "order": 1},
        {"id": 5, "label": "L", "rank": 1, "isDummy": false, "order": 2},
        {"id": 6, "label": "M", "rank": 1, "isDummy": false, "order": 3},
        {"id": 7, "label": "N", "rank": 1, "isDummy": false, "order": 4}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7}
      ]
    };
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignUpperLeft(graph);
    expect(graph.nodes[0].align).toBe(2);
    expect(graph.nodes[2].align).toBe(6);
  });

  it("Test alignLowerRight", function(){
    /*var graph = {
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
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignLowerRight(graph);
    expect(graph.nodes[16].align).toBe(25);
    expect(graph.nodes[0].align).toBe(8);
    expect(graph.nodes[4].align).toBe(5);*/

    var graph = {
      "nodes": [
        {"id": 1, "label": "H", "rank": 3, "isDummy": false, "order": 1},
        {"id": 2, "label": "I", "rank": 2, "isDummy": false, "order": 1},
        {"id": 3, "label": "J", "rank": 2, "isDummy": false, "order": 2},
        {"id": 4, "label": "K", "rank": 1, "isDummy": false, "order": 1},
        {"id": 5, "label": "L", "rank": 1, "isDummy": false, "order": 2},
        {"id": 6, "label": "M", "rank": 1, "isDummy": false, "order": 3},
        {"id": 7, "label": "N", "rank": 1, "isDummy": false, "order": 4}
      ],
      "links": [
        {"from": 1, "to": 2},
        {"from": 1, "to": 3},
        {"from": 2, "to": 4},
        {"from": 2, "to": 5},
        {"from": 3, "to": 6},
        {"from": 3, "to": 7}
      ]
    };
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignLowerRight(graph);
    expect(graph.nodes[0].align).toBe(3);
    expect(graph.nodes[2].align).toBe(7);
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
    expect(XCoordinateAssignment.edgeBetweenTwoNodes(graph.nodes[8], graph.nodes[15], graph))
      .toEqual({"from": 9, "to": 16, "ismark": false});
    expect(XCoordinateAssignment.edgeBetweenTwoNodes(graph.nodes[4], graph.nodes[9], graph))
      .toBe(null);
    expect(XCoordinateAssignment.edgeBetweenTwoNodes(graph.nodes[16], graph.nodes[23], graph))
      .toEqual({"from": 17, "to": 24, "ismark": false});
  });

  it("Test coordinateAsignment", function(){
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
    XCoordinateAssignment.preprocessing(graph);
    XCoordinateAssignment.alignLowerRight(graph);
    XCoordinateAssignment.coordinateAsignment(graph);
    var len = graph.nodes.length;
    for(var i = 0; i < len; i++)
    {
      expect(graph.nodes[i].x).toBe(graph.nodes[graph.nodes[i].align-1].x);
    }

    var rank = 1;
    var layer = VertexOrdering.getLayer(graph, rank++);
    len = layer.length;
    while(len > 0)
    {
      layer.sort(function(a,b){
        return a.order - b.order;
      });
      for(var i = 0; i < len-1; i++)
      {
        expect(layer[i].x).toBeLessThan(layer[i+1].x);
      }
      layer = VertexOrdering.getLayer(graph, rank++);
      len = layer.length;
    }
  });
});
