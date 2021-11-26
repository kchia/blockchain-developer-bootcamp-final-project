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
}) {
  function setup(p5, canvasParentRef) {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.frameRate(frameRate);
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

  return <Sketch setup={setup} draw={draw} />;
}
