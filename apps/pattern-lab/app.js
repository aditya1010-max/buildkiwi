import { generatePattern } from "@buildkiwi/pattern-engine";

const preview = document.querySelector("#preview");
const patternSelect = document.querySelector("#pattern");
const seedInput = document.querySelector("#seed");

const generateButton =
  document.querySelector("#generate");

const generateAnotherButton =
  document.querySelector("#generate-another");

const dimensions =
  document.querySelector("#dimensions");

const svgSize =
  document.querySelector("#svg-size");

const currentSeed =
  document.querySelector("#current-seed");

const WIDTH = 512;
const HEIGHT = 512;
const BORDER_RADIUS = 999;

function generate(seed = seedInput.value) {
  const pattern = patternSelect.value;

  const result = generatePattern({
    seed,
    pattern,
    width: WIDTH,
    height: HEIGHT,
    borderRadius: BORDER_RADIUS,
    palette: [],
  });

  preview.innerHTML = result.svg;

  dimensions.textContent =
    `${result.width} × ${result.height}`;

  svgSize.textContent =
    `${result.svg.length} characters`;

  currentSeed.textContent = seed;

  seedInput.value = seed;
}

function generateAnother() {
  const seed = createSeed();

  generate(seed);
}

function createSeed() {
  const randomPart =
    Math.random()
      .toString(36)
      .slice(2, 10);

  return `lab-${Date.now()}-${randomPart}`;
}

generateButton.addEventListener(
  "click",
  () => {
    generate();
  },
);

generateAnotherButton.addEventListener(
  "click",
  generateAnother,
);

patternSelect.addEventListener(
  "change",
  () => {
    generate();
  },
);

generate();
