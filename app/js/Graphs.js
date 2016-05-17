exports.getGraph = function(){
  return getGraph();
}

function getGraph(){
  return Graph9;
}

var Graph1 = {
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
    {"from": 1, "to": 3},
    {"from": 1, "to": 7},
    {"from": 1, "to": 16},
    {"from": 2, "to": 9},
    {"from": 2, "to": 16},
    {"from": 4, "to": 9},
    {"from": 5, "to": 9},
    {"from": 6, "to": 9},
    {"from": 6, "to": 10},
    {"from": 7, "to": 9},
    {"from": 7, "to": 13},
    {"from": 8, "to": 11},
    {"from": 8, "to": 12},
    {"from": 8, "to": 13},
    {"from": 10, "to": 14},
    {"from": 10, "to": 16},
    {"from": 11, "to": 14},
    {"from": 11, "to": 15},
    {"from": 12, "to": 15},
    {"from": 13, "to": 16}
  ]
};

var Graph2 = {
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

var Graph3 = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false}
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

var Graph4 = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "isDummy": false},
    {"id": 8, "label": "H", "rank": 0, "isDummy": false},
    {"id": 9, "label": "I", "rank": 0, "isDummy": false},
    {"id": 10, "label": "J", "rank": 0, "isDummy": false},
    {"id": 11, "label": "K", "rank": 0, "isDummy": false}
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

var Graph5 = {
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
    {"from": 3, "to": 6},
    {"from": 3, "to": 7}
  ]
};

var Graph6 = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "isDummy": false},
    {"id": 8, "label": "H", "rank": 0, "isDummy": false},
    {"id": 9, "label": "I", "rank": 0, "isDummy": false},
    {"id": 10, "label": "J", "rank": 0, "isDummy": false},
    {"id": 11, "label": "K", "rank": 0, "isDummy": false},
    {"id": 12, "label": "L", "rank": 0, "isDummy": false},
    {"id": 13, "label": "M", "rank": 0, "isDummy": false},
    {"id": 14, "label": "N", "rank": 0, "isDummy": false},
    {"id": 15, "label": "O", "rank": 0, "isDummy": false},
    {"id": 16, "label": "P", "rank": 0, "isDummy": false}
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

var Graph7 = {
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
    {"id": 15, "label": "O"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 1, "to": 3},
    {"from": 2, "to": 4},
    {"from": 2, "to": 5},
    {"from": 3, "to": 6},
    {"from": 3, "to": 7},
    {"from": 4, "to": 8},
    {"from": 4, "to": 9},
    {"from": 5, "to": 10},
    {"from": 5, "to": 11},
    {"from": 6, "to": 12},
    {"from": 6, "to": 13},
    {"from": 7, "to": 14},
    {"from": 7, "to": 15}
  ]
};

var Graph8 = {
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

var Graph9 = {
  "nodes": [
    {"id": 1, "label": "1"},
    {"id": 2, "label": "2"},
    {"id": 3, "label": "3"},
    {"id": 4, "label": "4"},
    {"id": 5, "label": "5"},
    {"id": 6, "label": "6"},
    {"id": 7, "label": "7"},

    {"id": 8, "label": "8"},
    {"id": 9, "label": "9"},
    {"id": 10, "label": "10"},
    {"id": 11, "label": "11"},
    {"id": 12, "label": "12"},
    {"id": 13, "label": "13"},
    {"id": 14, "label": "14"},
    {"id": 15, "label": "15"},
    {"id": 16, "label": "16"},
    {"id": 17, "label": "17"},
    {"id": 18, "label": "18"},
    {"id": 19, "label": "19"},
    {"id": 20, "label": "20"},
    {"id": 21, "label": "21"},
    {"id": 22, "label": "22"},
    {"id": 23, "label": "23"},
    {"id": 24, "label": "24"},
    {"id": 25, "label": "25"},
    {"id": 26, "label": "26"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 2, "to": 5},
    {"from": 2, "to": 4},
    {"from": 3, "to": 5},
    {"from": 4, "to": 5},
    {"from": 5, "to": 6},
    {"from": 7, "to": 4},

    {"from": 8, "to": 9},
    {"from": 8, "to": 10},
    {"from": 8, "to": 22},
    {"from": 10, "to": 11},
    {"from": 10, "to": 12},
    {"from": 9, "to": 13},
    {"from": 9, "to": 14},
    {"from": 11, "to": 15},
    {"from": 11, "to": 16},
    {"from": 12, "to": 17},
    {"from": 12, "to": 18},
    {"from": 13, "to": 19},
    {"from": 13, "to": 20},
    {"from": 14, "to": 21},
    {"from": 14, "to": 22},

    {"from": 23, "to": 24},
    {"from": 24, "to": 25},
    {"from": 25, "to": 23},
    {"from": 25, "to": 26},
    {"from": 26, "to": 23}
  ]
};


var Graph10 = {
  "nodes": [
    {"id": 1, "label": "H"},
    {"id": 2, "label": "I"},
    {"id": 3, "label": "J"},
    {"id": 4, "label": "K"},
    {"id": 5, "label": "L"},
    {"id": 6, "label": "M"},
    {"id": 7, "label": "N"}
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

var Graph11 = {
  "nodes": [
    {"id": 1, "label": "1","box":null},
    {"id": 2, "label": "2","box":null},
    {"id": 3, "label": "3","box":null},
    {"id": 4, "label": "4","box":null}
  ],
  "links": [
    {"from": 1, "to": 2,"box":null},
    {"from": 3, "to": 2,"box":null},
    {"from": 4, "to": 2,"box":null}
  ]
}

//graph contains box
var Graph12 = {
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
}

var Graph13 = {
  "nodes": [
    {"id": 1, "label": "1", "box": null},
    {"id": 2, "label": "2", "box": 0},
    {"id": 3, "label": "3", "box": 0},
    {"id": 4, "label": "4", "box": 1},
    {"id": 5, "label": "5", "box": 1},
    {"id": 6, "label": "6", "box": null},
    {"id": 7, "label": "7", "box": 0}

  ],
  "links": [
    {"from": 1, "to": "box0", "box":null},
    {"from": 2, "to": 3, "box": 0},
    {"from": 2, "to": 7, "box": 0},
    {"from": 3, "to": 7, "box": 0},
    {"from": "box0", "to": "box1", "box": null},
    {"from": 4, "to": 5, "box": 1},
    {"from": "box0", "to": 6, "box": null}
  ]
};
