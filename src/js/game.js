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
  [1, 3],
  [12, 3],
  [2, 11],
  [11, 12]
];

var start_points_big = [
  [3, 5],
  [10, 5],
  [4, 9],
  [9, 10]
];

var stars_small = [
  [3, 2, 0],
  [11, 1, 0],
  [3, 13, 0],
  [13, 11, 0],
  [7, 7, 1]
];

var stars_big = [
  [5, 4, 0],
  [9, 3, 0],
  [5, 11, 0],
  [11, 9, 0],
  [7, 7, 1]
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
    '<button class="btn btn-lg btn-secondary">' + tmp[0] + "</button>"
  );
  cubes.append(button1);
  button1.on("click", buttonValueClicked);
  if (tmp[1]) {
    var button2 = $(
      '<button class="btn btn-lg btn-secondary">' + tmp[1] + "</button>"
    );
    cubes.append(button2);
    button2.on("click", buttonValueClicked);
  }
  defaultButtonValueClicked();
}

function fold(event) {
  var button = $(event.target);
  var quadrant = button.data("quadrant");
  var type = button.data("type");
  $("button[quadrant=" + quadrant + "]").remove();
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
    var max = 4;
    var star = stars_small[quadrant];
    var start = start_points_small[quadrant];
  } else {
    var max = 6;
    var star = stars_big[quadrant];
    var start = start_points_big[quadrant];
  }
  var max_x = pos[0] + mx * max;
  var max_y = pos[1] + my * max;
  for (var i = pos[1]; i != max_y; i += my) {
    for (var j = pos[0]; j != max_x; j += mx) {
      var td = $(getTd(j, i));
      if ((i - pos[1]) * my + (j - pos[0]) * mx < max) {
        td.css("background-color", "transparent");
      } else {
        td.removeClass("visited");
      }
      td.find("span").remove();
    }
  }
  star[2] = 1;
  addContent(star[0], star[1], "⭐");
  var old_start = start_points[quadrant];
  var td_old = $(getTd(old_start[0], old_start[1]));
  var td_new = $(getTd(start[0], start[1]));
  td_old.addClass("visited");
  td_old.off("click");
  td_old.removeClass("start");
  makeStart(td_new, quadrant);
  old_start[0] = start[0];
  old_start[1] = start[1];
}

function addFolding(x, y, val) {
  var button = $(
    '<button class="corner btn btn-xs btn-primary" onclick="fold(event)">x</button>'
  );
  button.data("type", val);
  var quadrant = getQuadrant(x, y);
  button.data("quadrant", quadrant);
  button.attr("quadrant", quadrant);
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
    if (
      (j <= 3 && i <= 3) ||
      (j >= 11 && i <= 3) ||
      (j <= 3 && i >= 11) ||
      (j >= 11 && i >= 11)
    ) {
      td.addClass("small-corner");
    }
    if (
      (j <= 5 && i <= 5) ||
      (j >= 9 && i <= 5) ||
      (j <= 5 && i >= 9) ||
      (j >= 9 && i >= 9)
    ) {
      td.addClass("big-corner");
    }
  }
}
var g_selected_amount = 0;
var g_selected_amount_button;
function defaultButtonValueClicked() {
  var button = $("#cubes button")[0];
  buttonValueClicked2(button);
}

function buttonValueClicked(e) {
  var button = e.target;
  buttonValueClicked2(button);
}
function buttonValueClicked2(button) {
  var val = button.innerHTML;
  console.log("dice value:", val);
  g_selected_amount = val;
  g_selected_amount_button = button;
  $("#cubes button").removeClass("btn-success");
  $(button).addClass("btn-success");
}
function resize() {
  var width = $(".grid td")[0].clientWidth;
  $(".grid td").css("height", width + "px");
  var height = $(".grid .bonus")[0].clientHeight;
  $(".grid .bonus").css("width", height + "px");
}
$(window).resize(resize);
addSmilies();
addStartPoints();
addStars();
addBonuses();
resize();
add_dice_buttons();

function getTd(x, y) {
  var index = y * 15 + x;
  var td = $(".grid td")[index];
  return td;
}

function addContent(x, y, text, klass) {
  var td = getTd(x, y);
  var span = $("<span>" + text + "</span>");
  if (klass) span.addClass(klass);
  $(td).append(span);
}

function addSmilies() {
  smilies.forEach(function (a) {
    addContent(a[0], a[1], "🙂");
  });
}

function addStartPoints() {
  start_points.forEach(function (a, i) {
    var td = $(getTd(a[0], a[1]));
    makeStart(td, i);
  });
}

function makeStart(td, quadrant) {
  td.addClass("start");
  td.on("click", startSelected);
  td.data("i", quadrant);
}

var g_selected_start;
function startSelected(e) {
  if (g_selected_amount == 0) return;
  if (e.target.tagName !== "TD") var td = $(e.target.parentElement);
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
    addContent(a[0], a[1], a[2], "bonus");
  });
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
  var d = getMxMy(direction);
  var td;
  for (var i = 1; i <= amount; i++) {
    pos[0] += d.mx;
    pos[1] += d.my;
    td = $(getTd(pos[0], pos[1]));
    td.addClass("visited");
    checkContents(td);
  }
  makeStart(td, start);

  $(g_selected_amount_button).remove();
  g_selected_amount = 0;
  $("#direction").hide(0);
  var has_amount_buttons = $("#cubes button").length;
  if (!has_amount_buttons) {
    add_dice_buttons();
  } else {
    defaultButtonValueClicked();
  }
  if (g_stars == 5) {
    checkStarsConnected();
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
  } else if (td.find(".bonus").length) {
    var bonus = td.find(".bonus");
    if (!bonus.data("used")) {
      bonus.data("used", true);
      var new_dice_ammount = bonus[0].innerHTML;
      var button1 = $(
        '<button class="btn btn-lg btn-secondary">' +
          new_dice_ammount +
          "</button>"
      );
      $("#cubes").append(button1);
      button1.on("click", buttonValueClicked);
    }
  }
}

function checkStarsConnected() {
  var start = stars_small[4];
  var direction = 0;
  var stars = [];
  var count = 0;
  checkStarsConnected2([start[0], start[1]], direction, stars, count);
}
function checkStarsConnected2(pos, direction, stars, count) {
  //console.log(pos, direction, count);

  if (count > 225) return;
  var td = getTd(pos[0], pos[1]);
  $(td).removeClass("start");
  if (td.innerHTML.includes("☆")) {
    if (
      !stars.find(function (star) {
        if (star[0] == pos[0] && star[1] == pos[1]) return true;
        return false;
      })
    ) {
      stars.push([pos[0], pos[1]]);
      if (stars.length == 5) {
        console.log("WIN!!");
        window.alert("WIN!");
        return;
      }
    }
  }

  var d = getMxMy(direction);
  var new_dir1 = direction + 1;
  new_dir1 %= 4;
  var d1 = getMxMy(new_dir1);
  var new_dir2 = direction - 1;
  if (new_dir2 < 0) new_dir2 += 4;
  var d2 = getMxMy(new_dir2);
  if (isOnPath(pos[0] + d1.mx, pos[1] + d1.my)) {
    direction = new_dir1;
    pos[0] += d1.mx;
    pos[1] += d1.my;
  } else if (isOnPath(pos[0] + d.mx, pos[1] + d.my)) {
    pos[0] += d.mx;
    pos[1] += d.my;
  } else if (isOnPath(pos[0] + d2.mx, pos[1] + d2.my)) {
    direction = new_dir2;
    pos[0] += d2.mx;
    pos[1] += d2.my;
  } else {
    direction++;
    direction %= 4;
  }
  var td = getTd(pos[0], pos[1]);
  $(td).addClass("start");

  count++;
  setTimeout(checkStarsConnected2, 10, pos, direction, stars, count);
}
function isOnPath(x, y) {
  var td = $(getTd(x, y));
  var bg_color = td.css("background-color");
  if (bg_color == "rgb(192, 192, 192)" || bg_color == "rgb(0, 128, 0)")
    return true;
  return false;
}
function getQuadrant(x, y) {
  if (x < 6 && y < 6) return 0;
  if (x > 8 && y < 6) return 1;
  if (x < 6 && y > 8) return 2;
  if (x > 8 && y > 8) return 3;
}
function getMxMy(direction) {
  var mx, my;
  if (direction == 0) {
    mx = 1;
    my = 0;
  }
  if (direction == 1) {
    mx = 0;
    my = -1;
  }
  if (direction == 2) {
    mx = -1;
    my = 0;
  }
  if (direction == 3) {
    mx = 0;
    my = 1;
  }
  return { mx: mx, my: my };
}
