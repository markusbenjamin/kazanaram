let img;
let paths = [];
let maxPaths = 20000;
let r = 2; // Fixed radius
let da = 1; // Angle increment in degrees

function preload() {
  img = loadImage('paths.png'); // Load your image
}

function setup() {
  createCanvas(img.width, img.height);
}

function draw() {
  background(255)
  stroke(0, 25)
  strokeWeight(1)
  paths.forEach(path => path.display());

  for (var i = 0; i < 20; i++) {
    if (paths.length < maxPaths) {
      if (paths.length === 0 || paths[paths.length - 1].isComplete) {
        paths.push(new Path());
      } else {
        for (var i = 0; i < 50; i++) {
        paths[paths.length - 1].update();
        }
      }
    }
  }

  paths = paths.filter(path => path.isComplete ? path.points.length >= 5 : true);

  //if (mouseX >= 0 && mouseX < img.width && mouseY >= 0 && mouseY < img.height) {
  //  let pixelColor = img.get(mouseX, mouseY);
  //  let pixelBrightness = brightness(pixelColor);
  //  fill(255);
  //  stroke(0);
  //  rect(mouseX + 10, mouseY + 10, 50, 20);
  //  fill(0);
  //  text("B: " + nf(pixelBrightness, 1, 2), mouseX + 15, mouseY + 25);
  //}
}

class Path {
  constructor() {
    let startPos;
    do {
      startPos = createVector(width * 0.1 + random(-50, 50), height * 0.875 + random(-50, 50));
      startPos = createVector(random(0, width * 0.75), random(0, height));
    } while (brightness(img.get(startPos.x, startPos.y)) >= 80); // Continue searching until a non-white start point is found

    this.points = [startPos];
    this.isComplete = false;
  }

  update() {
    if (!this.isComplete) {
      let nextPos = this.findNextPosition(this.points[this.points.length - 1]);
      if (nextPos) {
        this.points.push(nextPos);
      } else {
        this.isComplete = true;
      }
    }
  }

  display() {
    noFill();
    beginShape();
    if (this.points.length > 1) {
      // Add the first point twice for curve continuity
      curveVertex(this.points[0].x, this.points[0].y);

      // Add all points as curve vertices
      this.points.forEach(p => curveVertex(p.x, p.y));

      // Add the last point twice for curve continuity
      curveVertex(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
    }
    endShape();
  }

  findNextPosition(pos) {
    let angles = [];
    // Only consider angles that will increase the x coordinate
    for (let angle = -100; angle <= 100; angle += da) {
      let x = pos.x + r * cos(radians(angle));
      let y = pos.y + r * sin(radians(angle));
      if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
        let br = brightness(img.get(x, y));
        if (br < 95) {
          angles.push({ angle, brightness: br });
        }
      }
    }

    angles.sort((a, b) => a.brightness - b.brightness);

    for (let i = 0; i < angles.length; i++) {
      if (random(1) < 1 / angles[i].brightness) {
        return createVector(pos.x + r * cos(radians(angles[i].angle)), pos.y + r * sin(radians(angles[i].angle)));
      }
    }

    return null;
  }
}
