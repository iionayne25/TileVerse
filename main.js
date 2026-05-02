import { drawGrassTile } from "./components/tile/grass.js";
import { drawSoilTile } from "./components/tile/soil.js";
import { drawWaterTile } from "./components/tile/water.js";
import { CANVAS_WIDTH, TILE_SIZE } from "./constants/constant.js";
import { drawImageOnTile } from "./utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ponyoImg = new Image();
ponyoImg.src = "../assets/ponyo.png";

const dinoImg = new Image();
dinoImg.src = "../assets/dino.png";

let loadedImages = 0;

const css = getComputedStyle(document.documentElement);

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

let selectedTile = "grass";
let selectedObject = "ponyo";

const tileDrawers = {
  grass: drawGrassTile,
  water: drawWaterTile,
  soil: drawSoilTile,
};

const objectImages = {
  ponyo: ponyoImg,
  dino: dinoImg,
};

document.querySelectorAll(".option-container [data-tile]").forEach((option) => {
  option.addEventListener("click", () => {
    selectedTile = option.dataset.tile;

    document
      .querySelectorAll(".option-container [data-tile]")
      .forEach((el) => el.classList.remove("active"));

    option.classList.add("active");

    render();
  });
});

document.querySelectorAll(".object-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedObject = option.dataset.object;

    document
      .querySelectorAll(".object-option")
      .forEach((el) => el.classList.remove("active"));

    option.classList.add("active");

    render();
  });
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function renderGrid(
  originX,
  originY,
  scale,
  inputWidth,
  inputHeight,
  tileType,
) {
  const w = TILE_SIZE.GRASS.EDGE_WIDTH * scale;
  const h = TILE_SIZE.GRASS.EDGE_HEIGHT * scale;

  const drawTile = tileDrawers[selectedTile];
  const selectedImg = objectImages[selectedObject];

  for (let row = 0; row < inputHeight; row++) {
    for (let col = 0; col < inputWidth; col++) {
      const x = originX + (col - row) * (w / 2);
      const y = originY + (col + row) * (h / 2);

      drawTile(ctx, x, y, scale);
      console.log(selectedObject);

      if (selectedObject == "dino") {
        drawImageOnTile(ctx, selectedImg, x, y + 10 * scale, scale * 0.8);
      } else {
        drawImageOnTile(ctx, selectedImg, x, y + 10 * scale, scale);
      }
    }
  }
}

function getInputSize() {
  const width = Number(widthInput.value || 0);
  const height = Number(heightInput.value || 0);

  return { width, height };
}

function getFitScale(mapWidth, mapHeight, canvasWidth, canvasHeight) {
  const tileW = TILE_SIZE.GRASS.EDGE_WIDTH;
  const tileH = TILE_SIZE.GRASS.EDGE_HEIGHT;

  const mapPixelWidth = (mapWidth + mapHeight) * (tileW / 2);
  const mapPixelHeight = (mapWidth + mapHeight) * (tileH / 2);

  const padding = 80;

  const scaleX = (canvasWidth - padding) / mapPixelWidth;
  const scaleY = (canvasHeight - padding) / mapPixelHeight;

  return Math.min(scaleX, scaleY, 1);
}

function render() {
  const { width, height } = getInputSize();

  if (width <= 0 || height <= 0) return;

  const rect = canvas.getBoundingClientRect();

  ctx.clearRect(0, 0, rect.width, rect.height);

  const scale = getFitScale(width, height, rect.width, rect.height);

  const tileW = TILE_SIZE.GRASS.EDGE_WIDTH * scale;
  const tileH = TILE_SIZE.GRASS.EDGE_HEIGHT * scale;

  // center map
  const mapPixelWidth = (width + height) * (tileW / 2);

  const x = rect.width / 2;
  const y = 80;

  renderGrid(x, y, scale, width, height);
}

function handleInputChange() {
  render();
}

function drawTileOptions() {
  document.querySelectorAll(".tile-option").forEach((option) => {
    const optionCtx = option.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const rect = option.getBoundingClientRect();

    option.width = rect.width * dpr;
    option.height = rect.height * dpr;

    optionCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    optionCtx.clearRect(0, 0, rect.width, rect.height);

    const tileType = option.dataset.tile;
    const drawTile = tileDrawers[tileType];

    drawTile(optionCtx, rect.width / 2, 20, 0.45);
  });
}

function drawObjectOptions() {
  document.querySelectorAll(".object-option").forEach((option) => {
    const optionCtx = option.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = option.getBoundingClientRect();

    option.width = rect.width * dpr;
    option.height = rect.height * dpr;

    optionCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    optionCtx.clearRect(0, 0, rect.width, rect.height);

    const objectType = option.dataset.object;
    const img = objectImages[objectType];

    if (img.complete) {
      optionCtx.drawImage(img, 14, 12, 55, 60);
    }
  });
}

function handleImageLoad() {
  loadedImages++;

  if (loadedImages === 2) {
    resizeCanvas();
    drawTileOptions();
    drawObjectOptions();
    render();
  }
}

ponyoImg.onload = handleImageLoad;
dinoImg.onload = handleImageLoad;

widthInput.addEventListener("input", handleInputChange);
heightInput.addEventListener("input", handleInputChange);

resizeCanvas();
drawTileOptions();
drawObjectOptions();
render();

const observer = new ResizeObserver(() => {
  resizeCanvas();
  drawTileOptions();
  drawObjectOptions();
  render();
});

observer.observe(canvas);
