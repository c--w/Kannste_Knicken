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

var width = $(".grid td")[0].clientWidth;
$(".grid td").css("height", width + "px");
addSmilies();
addStartPoints();
addStars();
make_dotted_borders();
addBonuses();
var width = $(".grid i")[0].clientHeight;
$(".grid i").css("width", width + "px");

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
    var td = $(getTd(a[0], a[1]));
    td.css("background-color", "green");
    td.css("cursor", "pointer");
    td.on("click", startSelected);
    td.data("i", i);
  });
}

function startSelected(e) {
  console.log(e);
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

function move(start, direction, amount) {
  var pos = start_points[start];
  var td = $(getTd(pos[0], pos[1]));
  td.css("background-color", "silver");
  var mx, my;
  switch (direction) {
    case 0:
      mx = 1;
      my = 0;
      break;
    case 1:
      mx = 0;
      my = -1;
      break;
    case 2:
      mx = -1;
      my = 0;
      break;
    case 3:
      mx = 0;
      my = 1;
      break;

    default:
      break;
  }
  var td;
  for (var i = 1; i < amount; i++) {
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
