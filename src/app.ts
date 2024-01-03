import P5 from "p5";
import "p5/lib/addons/p5.dom";
import { Complex, complex, Integer, Real, Interval } from "./fields";

interface Viewport {
  width: Integer;
  height: Integer;
  origin: Complex;
  zoomPixelsPerUnit: Real;
  numIter: Integer;
}

type Fractal = (z: Complex, c: Complex) => Complex;

const createViewportCanvas = (p5: P5, viewport: Viewport): P5.Renderer => {
  const canvas = p5.createCanvas(viewport.width, viewport.height);
  canvas.parent("app");
  p5.background("white");
  return canvas;
};

interface Colour {
  r: Interval;
  g: Interval;
  b: Interval;
}
type ColourMap = Colour[];

const BLACK: Colour = { r: 0, g: 0, b: 0 };

const sampleColourMap = (
  viewport: Viewport,
  colourMap: ColourMap,
  x: Interval
): Colour => {
  const n = 1 / Math.log10(viewport.numIter);
  x = -Math.pow(1 - Math.pow(x, n), 1 / n) + 1;
  if (!isFinite(x)) {
    return colourMap[colourMap.length - 1];
  }

  const closestA = Math.max(
    Math.min(Math.floor(x * (colourMap.length - 1)), colourMap.length - 1),
    0
  );
  const closestB = Math.max(
    Math.min(Math.ceil(x * (colourMap.length - 1)), colourMap.length - 1),
    0
  );

  const colourA = colourMap[closestA];
  const colourB = colourMap[closestB];

  const t = (x * (colourMap.length - 1)) % 1;

  const r = colourA.r * (1 - t) + colourB.r * t;
  const g = colourA.g * (1 - t) + colourB.g * t;
  const b = colourA.b * (1 - t) + colourB.b * t;

  return { r, g, b };
};

const drawFractal = (
  p5: P5,
  viewport: Viewport,
  colourMap: ColourMap,
  fractal: Fractal
): void => {
  const MAX_ABS = 50;

  for (let x = 0; x < viewport.width; x++) {
    for (let y = 0; y < viewport.height; y++) {
      const c = complex.add(viewport.origin, [
        (x - viewport.width / 2) / viewport.zoomPixelsPerUnit,
        (y - viewport.height / 2) / viewport.zoomPixelsPerUnit,
      ]);

      let z: Complex = c;
      let n = 0;
      let diverged = false;
      for (; n < viewport.numIter; n++) {
        const newZ = fractal(z, c);
        if (complex.abs(newZ) > MAX_ABS) {
          diverged = true;
          break;
        }

        if (complex.eq(z, newZ)) {
          break;
        }
        z = newZ;
      }

      if (diverged) {
        const a = n + 2 - Math.log(Math.log(complex.abs(z))) / Math.log(2);
        const colour = sampleColourMap(
          viewport,
          colourMap,
          a / viewport.numIter
        );
        p5.set(x, y, p5.color(colour.r * 255, colour.g * 255, colour.b * 255));
      } else {
        p5.set(x, y, p5.color(0));
      }
    }
  }
  p5.updatePixels();
};

const sketch = (p5: P5) => {
  const viewport: Viewport = {
    width: 2560,
    height: 1440,
    origin: [0, 0],
    zoomPixelsPerUnit: 700,
    numIter: 1000,
  };

  const fractal: Fractal = (z, c) => complex.add(complex.mul(z, z), c);

  const colourMap: ColourMap = [
    { r: 1, g: 0.1, b: 0.1 },
    { r: 0, g: 0.1, b: 0.3 },
    { r: 1, g: 1, b: 1 },
    { r: 1, g: 0.5, b: 0.1 },
  ];

  p5.setup = () => {
    createViewportCanvas(p5, viewport);
  };

  p5.draw = () => {
    drawFractal(p5, viewport, colourMap, fractal);
    p5.noLoop();
  };
};

new P5(sketch);
