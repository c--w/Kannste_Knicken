var smilies = [
  [2, 1],
  [11, 1],
  [0, 2],
  [14, 2],
  [3, 3],
  [13, 3],
  [4, 4],
  [10, 4],
  [4, 10],
  [10, 10],
  [1, 11],
  [13, 11],
  [14, 12],
  [2, 13],
  [11, 13],
  [3, 14]
];

var start_points = [
  [0, 0],
  [14, 0],
  [0, 14],
  [14, 14]
];

var start_points_small = [
  [0, 0],
  [14, 0],
  [0, 14],
  [14, 14]
];

var start_points_big = [
  [0, 0],
  [14, 0],
  [0, 14],
  [14, 14]
];

var bonuses = [
  [4, 5, 2],
  [9, 4, 1],
  [6, 6, 2],
  [2, 7, 2],
  [13, 7, 3],
  [10, 9, 3],
  [5, 10, 1],
  [7, 11, 1]
];

var stars_small = [
  [3, 2, 0],
  [12, 1, 0],
  [7, 7, 1],
  [3, 13, 0],
  [13, 11, 0]
];

var stars_big = [
  [4, 3, 0],
  [11, 2, 0],
  [7, 7, 1],
  [4, 12, 0],
  [12, 2, 0]
];

var smiley_done = [0, 0, 0, 0];

function throwDice() {
  var faces_black = [4, 4, 5, [2, 2], [2, 3], [2, 3]];
  var faces_white = [3, [1, 1], [1, 1], [1, 2], [1, 2], [1, 2]];
  var b = Math.floor(Math.random() * 6);
  var w = Math.floor(Math.random() * 6);
  var black = faces_black[b];
  var white = faces_white[w];
  var cubes = $("#cubes");
  cubes.empty();
  var button1 = $(
    '<button id="button_black" class="btn btn-lg black-button">' +
      black +
      "</button>"
  );
  var button2 = $(
    '<button id="button_white" class="btn btn-lg white-button">' +
      white +
      "</button>"
  );
  cubes.append(button1);
  cubes.append(button2);
  button1.on("click", cubesButtonClicked);
  button2.on("click", cubesButtonClicked);
}

function cubesButtonClicked(e) {
  var button = e.target;
  var val = button.innerHTML;
  console.log("dice:", val);
  var cubes = $("#cubes");
  cubes.empty();
  var tmp = val.split(",");
  var button1 = $(
    '<button id="button_first" class="btn btn-lg btn-primary">' +
      tmp[0] +
      "</button>"
  );
  cubes.append(button1);
  button1.on("click", buttonValueClicked);
  if (tmp[1]) {
    var button2 = $(
      '<button id="button_second" class="btn btn-lg btn-primary">' +
        tmp[1] +
        "</button>"
    );
    cubes.append(button2);
    button2.on("click", buttonValueClicked);
  }
}

var tbody = $(".grid tbody");
for (var i = 0; i < 15; i++) {
  var tr = $("<tr>");
  tbody.append(tr);
  for (var j = 0; j < 15; j++) {
    var td = $("<td>");
    td.data("x", j);
    td.data("y", i);
    tr.append(td);
  }
}
var g_selected_amount;
function buttonValueClicked(e) {
  var button = e.target;
  var val = button.innerHTML;
  console.log("dice value:", val);
  g_selected_amount = val;
  $(button).remove();
}

function resize() {
  var width = $(".grid td")[0].clientWidth;
  $(".grid td").css("height", width + "px");
  var height = $(".grid i")[0].clientHeight;
  $(".grid i").css("width", height + "px");
}
$(window).resize(resize);
addSmilies();
addStartPoints();
addStars();
make_dotted_borders();
addBonuses();
resize();

function getTd(x, y) {
  var index = y * 15 + x;
  var td = $(".grid td")[index];
  return td;
}

function addContent(x, y, text) {
  var td = getTd(x, y);
  td.innerHTML = text;
}

function addSmilies() {
  smilies.forEach(function (a) {
    addContent(a[0], a[1], "🙂");
  });
}

function addStartPoints() {
  start_points.forEach(function (a, i) {
    if (g_selected_amount != 0) {
      var td = $(getTd(a[0], a[1]));
      td.css("background-color", "green");
      td.css("cursor", "pointer");
      td.on("click", startSelected);
      td.data("i", i);
    }
  });
}

var g_selected_start;
function startSelected(e) {
  var td = $(e.target);
  td.css("background-color", "#88ff88");
  var start = td.data("i");
  g_selected_start = start;
  console.log(g_selected_start);
  $("#direction").show(0);
}
function addStars() {
  stars_small.forEach(function (a) {
    if (a[2]) addContent(a[0], a[1], "⭐");
  });
}

function addBonuses() {
  bonuses.forEach(function (a) {
    addContent(a[0], a[1], "<i>" + a[2] + "</i>");
  });
}

function make_dotted_borders() {
  for (var i = 0; i < 4; i++) {
    changeCellTopBorder(i, 4);
    changeCellTopBorder(i, 11);
    changeCellTopBorder(i + 11, 4);
    changeCellTopBorder(i + 11, 11);
    changeCellRightBorder(3, i);
    changeCellRightBorder(10, i);
    changeCellRightBorder(3, i + 11);
    changeCellRightBorder(10, i + 11);
  }
  for (var i = 0; i < 6; i++) {
    changeCellTopBorder(i, 6);
    changeCellTopBorder(i, 9);
    changeCellTopBorder(i + 9, 6);
    changeCellTopBorder(i + 9, 9);
    changeCellRightBorder(5, i);
    changeCellRightBorder(8, i);
    changeCellRightBorder(5, i + 9);
    changeCellRightBorder(8, i + 9);
  }
}

function changeCellTopBorder(x, y) {
  var td = getTd(x, y);
  $(td).css("border-top", "2px dotted gold");
}

function changeCellRightBorder(x, y) {
  var td = getTd(x, y);
  $(td).css("border-right", "2px dotted gold");
}

function move(e) {
  var button = $(e.target);
  var direction = button.attr("data-direction");
  move2(g_selected_start, direction, g_selected_value);
}

function move2(start, direction, amount) {
  var pos = start_points[start];
  var td = $(getTd(pos[0], pos[1]));
  td.css("background-color", "silver");
  var mx, my;
  switch (direction) {
    case "0":
      mx = 1;
      my = 0;
      break;
    case "1":
      mx = 0;
      my = -1;
      break;
    case "2":
      mx = -1;
      my = 0;
      break;
    case "3":
      mx = 0;
      my = 1;
      break;

    default:
      break;
  }
  var td;
  for (var i = 1; i <= amount; i++) {
    pos[0] += mx;
    pos[1] += my;
    td = $(getTd(pos[0], pos[1]));
    td.css("background-color", "silver");
    checkContents(td);
  }
  td.css("background-color", "green");
}
var quadrant_enabled = [0, 0, 0, 0];
function checkContents(td) {
  if (td[0].innerHTML === "🙂") {
    td[0].innerHTML = "😃";
    var quadrant = getQuadrant(td.data("x"), td.data("y"));
    smiley_done[quadrant]++;
    if (smiley_done[quadrant] === 3) quadrant_enabled[quadrant] = 1;
    else if (smiley_done[quadrant] > 3) quadrant_enabled[quadrant] = 2;
  }
}

function getQuadrant(x, y) {
  if (x < 6 && y < 6) return 0;
  if (x > 8 && y < 6) return 1;
  if (x < 6 && y > 8) return 2;
  if (x > 8 && y > 8) return 3;
}
