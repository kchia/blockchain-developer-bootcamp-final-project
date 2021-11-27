import Sketch from "react-p5";

export default function Elliptical({
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
  }

  function draw(p5) {
    p5.noStroke();
    for (let i = 0; i < ellipticalCount; i++) {
      p5.fill(
        v1 || p5.random(255),
        v2 || p5.random(255),
        v3 || p5.random(255),
        alpha || p5.random(255)
      );
      p5.ellipse(
        x || p5.random(p5.windowWidth),
        y || p5.random(p5.windowHeight),
        w || p5.random(100),
        h || p5.random(100)
      );
    }
  }

  return <Sketch setup={setup} draw={draw} />;
}
