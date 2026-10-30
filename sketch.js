let sulfur = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 4, 4, 7, 5, 5, 5, 0, 0],
  [0, 0, 4, 4, 4, 4, 5, 5, 0, 0],
  [0, 0, 6, 7, 4, 4, 4, 4, 0, 0],
  [0, 0, 4, 6, 7, 4, 7, 4, 0, 0],
  [0, 9, 10, 6, 7, 7, 4, 9, 10, 0],
  [0, 13, 12, 4, 6, 4, 4, 13, 12, 0],
  [0, 11, 0, 0, 2, 3, 0, 8, 11, 0],
  [0, 0, 0, 0, 0, 0, 0, 11, 0, 0]
];

let food = 100;
let energy = 100;
let health = 100;
let cash = 0;
let sleep = 100;
let startTime;
let dead = false;
let room = 1;
let resetButton;
let title;
let mcf;
let mc;
let sleepButton;
let sleeping = false;

let grass, living, bedroom, farm, cave, nportal, eportal, nether, end;
let eatImage, drinkImage;
let wButton, aButton, sButton, dButton;

function saveGame() {
  storeItem("food", food);
  storeItem("energy", energy);
  storeItem("health", health);
  storeItem("cash", cash);
  storeItem("sleep", sleep);
  storeItem("room", room);
  storeItem("dead", dead);
}

function loadGame() {
  if (getItem("food") != null) {
    food = getItem("food");
    energy = getItem("energy");
    health = getItem("health");
    cash = getItem("cash");
    sleep = getItem("sleep");
    room = getItem("room");
    dead = getItem("dead");
  }
}

function preload() {
  grass = loadImage("room.png");
  living = loadImage("livingroom.png");
  bedroom = loadImage("bedroom.png");
  farm = loadImage("farm.png");
  cave = loadImage("cave.png");
  nportal = loadImage("nportal.png");
  eportal = loadImage("eportal.png");
  nether = loadImage("nether.png");
  end = loadImage("end.png");

  mc = loadSound('mc.mp3');

  mcf = loadFont("mcf.ttf");

  eatImage = loadImage("eat.png");
  drinkImage = loadImage("drink.png");
}

function setup() {
  loadGame();

  mc.loop();

  createCanvas(1000, 1000);

  startTime = millis();

  textSize(24);
  textAlign(LEFT, TOP);

  wButton = createButton("W");
  wButton.position(70, 850);
  wButton.size(45, 45);
  wButton.mousePressed(up);

  aButton = createButton("A");
  aButton.position(20, 900);
  aButton.size(45, 45);
  aButton.mousePressed(left);

  sButton = createButton("S");
  sButton.position(70, 900);
  sButton.size(45, 45);
  sButton.mousePressed(down);

  dButton = createButton("D");
  dButton.position(120, 900);
  dButton.size(45, 45);
  dButton.mousePressed(right);

  sleepButton = createButton("Sleep");
  sleepButton.position(850, 870);
  sleepButton.size(80, 70);
  sleepButton.mousePressed(toggleSleep);
  sleepButton.hide();

  sleepButton.style("background-color", "#777777");
  sleepButton.style("color", "white");
  sleepButton.style("border", "5px round #222222");
  sleepButton.style("font-size", "18px");
  sleepButton.style("font-family", "mcf");
  sleepButton.style("text-align", "center");
  sleepButton.style("line-height", "75px");

  resetButton = createButton("Respawn");
  resetButton.position(255, 530);
  resetButton.size(500, 50);
  resetButton.mousePressed(respawn);

  resetButton.style("background-color", "#777777");
  resetButton.style("color", "white");
  resetButton.style("border", "4px round #222222");
  resetButton.style("font-size", "24px");
  resetButton.style("font-family", "mcf");

  title = createButton("Title Screen");
  title.position(255, 590);
  title.size(500, 50);
  title.mousePressed(title);

  title.style("background-color", "#777777");
  title.style("color", "white");
  title.style("border", "4px round #222222");
  title.style("font-size", "24px");
  title.style("font-family", "mcf");

  resetButton.hide();
  title.hide();

  buttons();
}

function toggleSleep() {
  if (room == 3 && dead == false) {
    sleeping = !sleeping;

    if (sleeping == true) {
      sleepButton.html("Wake");
    } else {
      sleepButton.html("Sleep");
    }
  }
}

function draw() {
  drawRoom();

  if (sleeping == true) {
    fill(0, 0, 0, 130);
    rect(0, 0, 1000, 1000);
  }

  drawSulfur();

  if (sleeping == true) {
    fill("white");
    textSize(25);
    text("Zzz...", 540, 330);
  }

  drawStats();
  buttons();

  if (room == 3 && dead == false) {
    sleepButton.show();
  } else {
    sleepButton.hide();
    sleeping = false;
    sleepButton.html("Sleep");
  }

  // Hotbar
  fill(0, 0, 0, 150);
  rect(230, 860, 600, 75);

  for (let i = 0; i < 9; i++) {
    fill(0, 0, 0, 100);
    rect(235 + i * 66, 865, 65, 65);
  }

  // Food/drink
  image(eatImage, 235, 868, 60, 60);
  image(drinkImage, 305, 868, 60, 60);

  noFill();
  stroke(255);
  strokeWeight(3);
  rect(432, 865, 65, 65);
  noStroke();

  if (frameCount % 60 == 0) {
    saveGame();
  }

  if (frameCount % 60 == 0 && dead == false) {
    food = food - random(0.8, 1.2);
    energy = energy - random(1.2, 1.6);

    // Sleep
    if (sleeping == true) {
      sleep = min(sleep + 2, 100);

      if (sleep >= 100) {
        sleeping = false;
        sleepButton.html("Sleep");
      }
    } else {
      sleep = max(sleep - 1, 0);
    }

    if (food <= 0 || energy <= 0) {
      health = health - 1;
    }

    if (food <= 0 && energy <= 0) {
      health = health - 1;
    }

    if (food >= 80 && energy >= 80 && health < 100) {
      health = health + 1;
    }

    if (sleep <= 0) {
      health = health - 1;
    }

    food = max(food, 0);
    energy = max(energy, 0);
    health = max(health, 0);
    sleep = max(sleep, 0);
  }

  if (health <= 0) {
    dead = true;
  }
}

function mousePressed() {
  if (mouseX > 235 && mouseX < 295 &&
      mouseY > 868 && mouseY < 928) {
    eat();
  }

  if (mouseX > 305 && mouseX < 365 &&
      mouseY > 868 && mouseY < 928) {
    drink();
  }
}

function drawRoom() {
  if (room == 1) {
    image(grass, 0, 0, width, height);
  } else if (room == 2) {
    image(living, 0, 0, width, height);
  } else if (room == 3) {
    image(bedroom, 0, 0, width, height);
  } else if (room == 4) {
    image(farm, 0, 0, width, height);
  } else if (room == 5) {
    image(cave, 0, 0, width, height);
  } else if (room == 6) {
    image(nportal, 0, 0, width, height);
  } else if (room == 7) {
    image(eportal, 0, 0, width, height);
  } else if (room == 8) {
    image(nether, 0, 0, width, height);
  } else if (room == 9) {
    image(end, 0, 0, width, height);
  }
}

function buttons() {
  styleButton(wButton, "up");
  styleButton(aButton, "left");
  styleButton(sButton, "down");
  styleButton(dButton, "right");
}

function styleButton(button, direction) {
  if (canMove(direction)) {
    button.style("background-color", "#886b2c");
    button.style("color", "black");
    button.style("cursor", "pointer");
    button.style("pointer-events", "auto");
  } else {
    button.style("background-color", "#412d09");
    button.style("color", "#000000");
    button.style("cursor", "not-allowed");
    button.style("pointer-events", "none");
  }

  button.style("border", "3px solid #ca9e26");
  button.style("font-size", "20px");
}

function canMove(direction) {
  if (direction == "left") {
    return room == 1 || room == 2 || room == 3 || room == 8 || room == 6 || room == 5 || room == 7;
  } else if (direction == "right") {
    return room == 1 || room == 2 || room == 4 || room == 5 || room == 9 || room == 7 || room == 6;
  } else if (direction == "up") {
    return room == 5;
  } else if (direction == "down") {
    return room == 1;
  }

  return false;
}

function keyPressed() {
  if (key == "a" || key == "A") {
    left();
  } else if (key == "d" || key == "D") {
    right();
  } else if (key == "w" || key == "W") {
    up();
  } else if (key == "s" || key == "S") {
    down();
  }

  if (key == "e" || key == "E") {
    eat();
  }

  if (key == "q" || key == "Q") {
    drink();
  }
}

function left() {
  if (room == 1) {
    room = 4;
  } else if (room == 2) {
    room = 1;
  } else if (room == 3) {
    room = 2;
  } else if (room == 8) {
    room = 6;
  } else if (room == 6) {
    room = 5;
  } else if (room == 5) {
    room = 7;
  } else if (room == 7) {
    room = 9;
  }
}

function right() {
  if (room == 1) {
    room = 2;
  } else if (room == 2) {
    room = 3;
  } else if (room == 4) {
    room = 1;
  } else if (room == 9) {
    room = 7;
  } else if (room == 7) {
    room = 5;
  } else if (room == 5) {
    room = 6;
  } else if (room == 6) {
    room = 8;
  }
}

function up() {
  if (room == 5) {
    room = 1;
  }
}

function down() {
  if (room == 1) {
    room = 5;
  }
}

function eat() {
  if (dead == false) {
    food = min(food + 7, 100);
  }
}

function drink() {
  if (dead == false) {
    energy = min(energy + 7, 100);
  }
}

function sleeps() {
  if (dead == false) {
    sleep = min(sleep + 7, 100);
  }
}

function drawSulfur() {
  noStroke();

  let xPos = 425;
  let yPos = 400;

  for (let y = 0; y < sulfur.length; y++) {
    for (let x = 0; x < sulfur[y].length; x++) {

      if (sulfur[y][x] == 0) {
        fill(230, 217, 119, 200);
      } else if (sulfur[y][x] == 1) {
        fill("#805300");
      } else if (sulfur[y][x] == 2) {
        fill("#5e3d00");
      } else if (sulfur[y][x] == 3) {
        fill("#402900");
      } else if (sulfur[y][x] == 4) {
        fill(230, 217, 119);
      } else if (sulfur[y][x] == 5) {
        fill(242, 228, 119);
      } else if (sulfur[y][x] == 6) {
        fill(214, 199, 81);
      } else if (sulfur[y][x] == 7) {
        fill(227, 211, 93);
      } else if (sulfur[y][x] == 8) {
        if (food < 60) {
          fill("#04a0c7");
        } else {
          fill(230, 217, 119, 200);
        }
      } else if (sulfur[y][x] == 9) {
        if (sleeping == true || energy < 50 || sleep < 50) {
          fill("#ada351");
        } else {
          fill("#805300");
        }
      } else if (sulfur[y][x] == 10) {
        if (sleeping == true || energy < 50 || sleep < 50) {
          fill("#ada351");
        } else {
          fill("#5e3d00");
        }
      } else if (sulfur[y][x] == 11) {
        if (food < 20) {
          fill("#04a0c7");
        } else {
          fill(230, 217, 119, 200);
        }
      } else if (sulfur[y][x] == 12) {
        if (sleeping == true || energy < 20 || sleep < 20) {
          fill("#8d8441");
        } else {
          fill("#402900");
        }
      } else if (sulfur[y][x] == 13) {
        if (sleeping == true || energy < 20 || sleep < 20) {
          fill("#8d8441");
        } else {
          fill("#5e3d00");
        }
      }

      square(xPos + x * 15, yPos + y * 15, 15);
    }
  }
}

function drawStats() {
  push();

  textFont("Arial");
  textSize(24);
  textAlign(LEFT, TOP);

  let time = floor((millis() - startTime) / 1000);

  fill("white");

  text("Full: " + nf(food, 1, 1), 850, 10);
  fill("gray");
  rect(850, 40, 140, 15);
  fill("orange");
  rect(850, 40, food * 1.4, 15);

  fill("white");
  text("Energy: " + nf(energy, 1, 1), 850, 65);
  fill("gray");
  rect(850, 95, 140, 15);
  fill("cyan");
  rect(850, 95, energy * 1.4, 15);

  fill("white");
  text("Health: " + health, 850, 175);
  fill("gray");
  rect(850, 205, 140, 15);
  fill("red");
  rect(850, 205, health * 1.4, 15);

  fill("white");
  text("Sleep: " + sleep, 850, 120);
  fill("gray");
  rect(850, 150, 140, 15);
  fill("blue");
  rect(850, 150, sleep * 1.4, 15);

  if (dead == true) {
    fill(160, 0, 0, 100);
    rect(0, 0, 1000, 1000);

    fill("white");
    textAlign(CENTER);
    textSize(50);
    text("You Died!", 500, 350);

    textSize(20);
    text("Sulfur starved to death", 500, 420);
    textSize(20);
    text("score: ", 480, 445);
    fill("yellow");
    textSize(18);
    text("12", 520, 448.3);

    resetButton.show();
    title.show();
  } else {
    resetButton.hide();
    title.hide();
  }

  pop();
}

function respawn() {
  food = 100;
  energy = 100;
  health = 100;
  cash = 0;
  sleep = 100;

  dead = false;
  room = 1;
  sleeping = false;
  sleepButton.html("Sleep");

  startTime = millis();

  textSize(24);
  textAlign(LEFT, TOP);

  saveGame();
}