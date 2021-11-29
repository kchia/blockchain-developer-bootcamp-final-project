import Sketch from "react-p5";
import styles from "./view.module.css";
export default function EllipticalView({
  drawRecursively = false,
  ellipticalCount = 1000,
  canvasWidth = 500,
  canvasHeight = 500,
  frameRate = 2,
  elliptical: { name, description, v1, v2, v3, alpha, x, y, w, h } = {},
}) {
  function setup(p5, canvasParentRef) {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.frameRate(frameRate);
    if (!drawRecursively) {
      p5.noStroke();
      for (let i = 0; i < ellipticalCount; i++) {
        p5.fill(
          generateRandomNumber(v1, p5.random(255)),
          generateRandomNumber(v2, p5.random(255)),
          generateRandomNumber(v3, p5.random(255)),
          generateRandomNumber(alpha, p5.random(255))
        );
        p5.ellipse(
          generateRandomNumber(x, p5.random(p5.windowWidth), p5.windowWidth),
          generateRandomNumber(y, p5.random(p5.windowHeight), p5.windowHeight),
          generateRandomNumber(w, p5.random(100), 100),
          generateRandomNumber(h, p5.random(100), 100)
        );
      }

      // p5.save(`${name}.png`);
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

  function generateRandomNumber(
    contractRandomNumber,
    p5RandomNumber,
    range = 255
  ) {
    return (contractRandomNumber * p5RandomNumber) % range;
  }

  return drawRecursively ? (
    <Sketch setup={setup} draw={draw} />
  ) : (
    <div className={styles.container}>
      <h2>{name} =></h2>
      <p>{description}</p>
      <Sketch setup={setup} />
    </div>
  );
}
