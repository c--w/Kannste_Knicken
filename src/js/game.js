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

var folds_small = [
  [3, 3],
  [11, 3],
  [3, 11],
  [11, 11]
];

var folds_big = [
  [5, 5],
  [9, 5],
  [5, 9],
  [9, 9]
];

var smiley_done = [0, 0, 0, 0];
var g_stars = 0;

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
    '<button class="btn btn-lg btn-primary">' + tmp[0] + "</button>"
  );
  cubes.append(button1);
  button1.on("click", buttonValueClicked);
  if (tmp[1]) {
    var button2 = $(
      '<button class="btn btn-lg btn-primary">' + tmp[1] + "</button>"
    );
    cubes.append(button2);
    button2.on("click", buttonValueClicked);
  }
}

function fold(event) {
  var button = $(event.target);
  var quadrant = button.data("quadrant");
  var type = button.data("type");
  fold2(quadrant, type);
}

function fold2(quadrant, type) {
  switch (quadrant) {
    case 0:
      var pos = [0, 0];
      var mx = 1;
      var my = 1;
      break;
    case 1:
      var pos = [14, 0];
      var mx = -1;
      var my = 1;
      break;
    case 2:
      var pos = [0, 14];
      var mx = 1;
      var my = -1;
      break;
    case 3:
      var pos = [14, 14];
      var mx = -1;
      var my = -1;
      break;

    default:
      break;
  }
  if (type == "1") {
    var max = 3;
  } else {
    var max = 5;
  }
  var max_x = pos[0] + mx * max;
  var max_y = pos[1] + my * max;
  for (var i = pos[1]; i != max_y; i += my) {
    for (var j = pos[0]; j != max_x; j += mx) {
      var td = $(getTd(j, i));
      if (max_y - i + max_x - j < max) {
        td.css("background-color", "transparent");
      } else {
        td.css("background-color", "gold");
      }
    }
  }
}
function addFolding(x, y, val) {
  var button = $(
    '<button class="corner btn btn-xs btn-primary" onclick="fold(event)">x</button>'
  );
  button.data("type", val);
  var quadrant = getQuadrant(x, y);
  button.data("quadrant", quadrant);
  switch (quadrant) {
    case 0:
      button.addClass("bottom-right");
      break;
    case 1:
      button.addClass("bottom-left");
      break;
    case 2:
      button.addClass("top-right");
      break;
    case 3:
      button.addClass("top-left");
      break;

    default:
      break;
  }
  var td = getTd(x, y);
  $(td).append(button);
}

function showFold(quadrant, val) {
  if (val == 1) {
    var pos = folds_small[quadrant];
  } else {
    var pos = folds_big[quadrant];
  }
  var td = $(getTd(pos[0], pos[1]));
  td.find("button").show();
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
    if (
      (j == 3 && i == 3) ||
      (j == 11 && i == 3) ||
      (j == 3 && i == 11) ||
      (j == 11 && i == 11)
    ) {
      addFolding(j, i, 1);
    }
    if (
      (j == 5 && i == 5) ||
      (j == 9 && i == 5) ||
      (j == 5 && i == 9) ||
      (j == 9 && i == 9)
    ) {
      addFolding(j, i, 2);
    }
  }
}
var g_selected_amount;
var g_selected_amount_button;
function buttonValueClicked(e) {
  var button = e.target;
  var val = button.innerHTML;
  console.log("dice value:", val);
  g_selected_amount = val;
  g_selected_amount_button = button;
  $("#cubes buttons").css("background-color", "");
  $(button).css("background-color", "#8888ff");
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
add_dice_buttons();

function getTd(x, y) {
  var index = y * 15 + x;
  var td = $(".grid td")[index];
  return td;
}

function addContent(x, y, text) {
  var td = getTd(x, y);
  $(td).append($("<span>" + text + "</span>"));
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
      td.addClass("start");
      td.on("click", startSelected);
      td.data("i", i);
    }
  });
}

var g_selected_start;
function startSelected(e) {
  if (e.target.tagName === "I") var td = $(e.target.parentElement);
  else var td = $(e.target);
  $(".start").removeClass("active");
  td.addClass("active");
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
  move2(g_selected_start, direction, g_selected_amount);
}

function move2(start, direction, amount) {
  var pos = start_points[start];
  var td = $(getTd(pos[0], pos[1]));
  td.off("click");
  td.removeClass("active");
  td.removeClass("start");
  td.addClass("visited");
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
    td.addClass("visited");
    checkContents(td);
  }

  td.addClass("start");
  td.on("click", startSelected);
  td.data("i", start);

  $(g_selected_amount_button).remove();
  $("#direction").hide(0);
  var has_amount_buttons = $("#cubes button").length;
  if (!has_amount_buttons) {
    add_dice_buttons();
  }
}

function add_dice_buttons() {
  var button1 = $(
    '<button class="btn btn-lg btn-primary" onclick="throwDice()">Throw dice!</button>'
  );
  $("#cubes").append(button1);
}

var quadrant_enabled = [0, 0, 0, 0];
function checkContents(td) {
  if (td[0].innerHTML.includes("🙂")) {
    td.find("span")[0].innerHTML = "😃";
    var quadrant = getQuadrant(td.data("x"), td.data("y"));
    smiley_done[quadrant]++;
    if (smiley_done[quadrant] === 3) {
      quadrant_enabled[quadrant] = 1;
      showFold(quadrant, 1);
    } else if (smiley_done[quadrant] > 3) {
      quadrant_enabled[quadrant] = 2;
      showFold(quadrant, 2);
    }
  } else if (td[0].innerHTML.includes("⭐")) {
    g_stars++;
    td.find("span")[0].innerHTML = "☆";
  } else if (td.find("i").length) {
    var i = td.find("i");
    if (!i.data("used")) {
      i.data("used", true);
      var new_dice_ammount = i[0].innerHTML;
      var button1 = $(
        '<button class="btn btn-lg btn-primary">' +
          new_dice_ammount +
          "</button>"
      );
      $("#cubes").append(button1);
      button1.on("click", buttonValueClicked);
    }
  }
}

function getQuadrant(x, y) {
  if (x < 6 && y < 6) return 0;
  if (x > 8 && y < 6) return 1;
  if (x < 6 && y > 8) return 2;
  if (x > 8 && y > 8) return 3;
}
