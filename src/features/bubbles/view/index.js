import Sketch from "react-p5";

export default function Bubble() {
  function setup(p5, canvasParentRef) {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    p5.noStroke();
    for (let i = 0; i < 1000; i++) {
      p5.fill(p5.random(255), p5.random(255), p5.random(255), p5.random(255));
      p5.ellipse(
        p5.random(p5.windowWidth),
        p5.random(p5.windowHeight),
        p5.random(100)
      );
    }
    // p5.save("../../assets/images/bubbles.png");
  }

  return <Sketch setup={setup} />;
}
