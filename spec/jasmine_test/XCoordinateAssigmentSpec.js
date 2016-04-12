var XcoordinateAssigment = require("../../app/js/XcoordinateAssigment.js");
describe("preprocessing", function(){
  it("preprocessing check", function(){
    var graph = {
      "nodes": [
        {"id": 1, "label": "A", "rank": 5, "isDummy": false, "group": 1},
        {"id": 2, "label": "B", "rank": 5, "isDummy": false, "group": 1},
        {"id": 3, "label": "C", "rank": 4, "isDummy": false, "group": 1},
        {"id": 4, "label": "D", "rank": 4, "isDummy": false, "group": 1},
        {"id": 5, "label": "E", "rank": 4, "isDummy": true, "group": 1},
        {"id": 6, "label": "F", "rank": 4, "isDummy": false, "group": 1},
        {"id": 7, "label": "G", "rank": 4, "isDummy": true, "group": 1},
        {"id": 8, "label": "H", "rank": 4, "isDummy": true, "group": 1},
        {"id": 9, "label": "I", "rank": 4, "isDummy": false, "group": 1},
        {"id": 10, "label": "J", "rank": 4, "isDummy": false, "group": 1},
        {"id": 11, "label": "K", "rank": 3, "isDummy": false, "group": 1},
        {"id": 12, "label": "L", "rank": 3, "isDummy": false, "group": 1},
        {"id": 13, "label": "M", "rank": 3, "isDummy": true, "group": 1},
        {"id": 14, "label": "N", "rank": 3, "isDummy": true, "group": 1},
        {"id": 15, "label": "O", "rank": 3, "isDummy": true, "group": 1},
        {"id": 16, "label": "P", "rank": 3, "isDummy": false, "group": 1},
        {"id": 17, "label": "Q", "rank": 2, "isDummy": false, "group": 1},
        {"id": 18, "label": "R", "rank": 2, "isDummy": false, "group": 1},
        {"id": 19, "label": "S", "rank": 2, "isDummy": true, "group": 1},
        {"id": 20, "label": "T", "rank": 2, "isDummy": true, "group": 1},
        {"id": 21, "label": "U", "rank": 2, "isDummy": true, "group": 1},
        {"id": 22, "label": "V", "rank": 2, "isDummy": false, "group": 1},
        {"id": 23, "label": "W", "rank": 2, "isDummy": true, "group": 1},
        {"id": 24, "label": "X", "rank": 1, "isDummy": false, "group": 1},
        {"id": 25, "label": "Y", "rank": 1, "isDummy": false, "group": 1},
        {"id": 26, "label": "Z", "rank": 1, "isDummy": false, "group": 1}


      ],
      "links": [
        {"from": 1, "to": 3},
        {"from": 1, "to": 8},
        {"from": 1, "to": 10},
        {"from": 2, "to": 5},
        {"from": 2, "to": 7},
        {"from": 4, "to": 12},
        {"from": 5, "to": 12},
        {"from": 6, "to": 12},
        {"from": 7, "to": 13},
        {"from": 8, "to": 14},
        {"from": 9, "to": 12},
        {"from": 9, "to": 16},
        {"from": 10, "to": 12},
        {"from": 10, "to": 15},
        {"from": 11, "to": 17},
        {"from": 11, "to": 18},
        {"from": 11, "to": 22},
        {"from": 13, "to": 20},
        {"from": 14, "to": 21},
        {"from": 15, "to": 22},
        {"from": 16, "to": 20},
        {"from": 16, "to": 23},
        {"from": 17, "to": 24},
        {"from": 17, "to": 25},
        {"from": 18, "to": 25},
        {"from": 19, "to": 24},
        {"from": 20, "to": 26},
        {"from": 21, "to": 26},
        {"from": 22, "to": 26},
        {"from": 23, "to": 26}
      ]
    };
    XcoordinateAssigment.preprocessing(graph);
    /*var len = graph.nodes.length;
    for(var i = 0; i < len-3; i++)
    {
      expect
      (graph.nodes[i].group).toBe(1);
    }
    for(var i = len-3; i < len; i++)
    {
      expect
      (graph.nodes[i].group).toBe(2);
    }*/

  });
});
