import Sketch from "react-p5";

export default function EllipticalView({
  drawRecursively = false,
  ellipticalCount = 1000,
  canvasWidth = 500,
  canvasHeight = 500,
  frameRate = 2,
  v1,
  v2,
  v3,
  alpha,
  x,
  y,
  w,
  h,
}) {
  function setup(p5, canvasParentRef) {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.frameRate(frameRate);
    if (!drawRecursively) {
      p5.noStroke();
      for (let i = 0; i < ellipticalCount; i++) {
        p5.fill(v1, v2, v3, alpha);
        p5.ellipse(x, y, w, h);
      }
    }
  }

  function draw(p5) {
    p5.noStroke();
    for (let i = 0; i < ellipticalCount; i++) {
      p5.fill(p5.random(255), p5.random(255), p5.random(255), p5.random(255));
      p5.ellipse(
        p5.random(p5.windowWidth),
        p5.random(p5.windowHeight),
        p5.random(100),
        p5.random(100)
      );
    }
  }

  return drawRecursively ? (
    <Sketch setup={setup} draw={draw} />
  ) : (
    <Sketch setup={setup} />
  );
}
