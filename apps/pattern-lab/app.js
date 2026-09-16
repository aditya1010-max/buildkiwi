import { generatePattern } from "@buildkiwi/pattern-engine";

const preview = document.querySelector("#preview");
const patternSelect = document.querySelector("#pattern");
const seedInput = document.querySelector("#seed");

const generateButton = document.querySelector("#generate");
const generateAnotherButton = document.querySelector("#generate-another");
const generateGalleryButton = document.querySelector("#generate-gallery");

const dimensions = document.querySelector("#dimensions");
const svgSize = document.querySelector("#svg-size");
const currentSeed = document.querySelector("#current-seed");

const gallery = document.querySelector("#gallery");
const galleryCount = document.querySelector("#gallery-count");

const WIDTH = 512;
const HEIGHT = 512;
const BORDER_RADIUS = 999;

const GALLERY_SIZE = 20;

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

  dimensions.textContent = `${result.width} × ${result.height}`;

  svgSize.textContent = `${result.svg.length} characters`;

  currentSeed.textContent = seed;

  seedInput.value = seed;
}

function generateAnother() {
  const seed = createSeed();

  generate(seed);
}

function generateGallery() {
  const pattern = patternSelect.value;

  gallery.innerHTML = "";

  const seeds = Array.from(
    { length: GALLERY_SIZE },
    (_, index) => `lab-gallery-${String(index + 1).padStart(3, "0")}`,
  );

  for (const seed of seeds) {
    const result = generatePattern({
      seed,
      pattern,
      width: WIDTH,
      height: HEIGHT,
      borderRadius: BORDER_RADIUS,
      palette: [],
    });

    const item = document.createElement("article");
    item.className = "gallery-item";

    const preview = document.createElement("div");
    preview.className = "gallery-item-preview";
    preview.innerHTML = result.svg;

    const meta = document.createElement("div");
    meta.className = "gallery-item-meta";

    const seedLabel = document.createElement("strong");
    seedLabel.textContent = seed;

    const sizeLabel = document.createElement("span");
    sizeLabel.textContent = `${result.svg.length} characters`;

    meta.append(seedLabel, sizeLabel);
    item.append(preview, meta);

    item.addEventListener("click", () => {
      generate(seed);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    gallery.appendChild(item);
  }

  galleryCount.textContent = `${seeds.length} seeds`;
}

function createSeed() {
  const bytes = new Uint8Array(16);

  crypto.getRandomValues(bytes);

  return `lab-${Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")}`;
}

generateButton.addEventListener("click", () => {
  generate();
});

generateAnotherButton.addEventListener("click", generateAnother);

generateGalleryButton.addEventListener("click", generateGallery);

patternSelect.addEventListener("change", () => {
  generate();
});

generate();
