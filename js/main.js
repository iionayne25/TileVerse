import { TILE_SIZE, DRIP_SIZE, CANVAS_WIDTH } from "../constants/constant.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const css = getComputedStyle(document.documentElement);

const getVar = (name) => css.getPropertyValue(name).trim();

const GRASS_BLOCK = {
  TOP: getVar("--grass-top"),
  DRIP: getVar("--grass-drip"),
  LEFT_EDGE: getVar("--grass-left-edge"),
  LEFT_BASE: getVar("--grass-left-base"),
  RIGHT_EDGE: getVar("--grass-right-edge"),
  RIGHT_BASE: getVar("--grass-right-base"),
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawTop(x, y, w, h, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x - w / 2, y + h / 2);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

function drawSingleDrip(cx, topY, width, height) {
  const radius = width / 2;

  ctx.beginPath();

  // คอ (แท่ง)
  ctx.moveTo(cx - radius, topY);
  ctx.lineTo(cx + radius, topY);
  ctx.lineTo(cx + radius, topY + height - radius);

  // ปลายมน
  ctx.arc(cx, topY + height - radius, radius, 0, Math.PI, false);

  // ปิดกลับ
  ctx.lineTo(cx - radius, topY);

  ctx.closePath();
  ctx.fill();
}

function drawDrip(x, y, w, h, scale) {
  const baseY = y + h / 2;

  ctx.fillStyle = GRASS_BLOCK.DRIP;

  // drip left
  drawSingleDrip(
    x - DRIP_SIZE.LEFT_DRIP.CX * scale,
    baseY + DRIP_SIZE.LEFT_DRIP.TOP_Y * scale,
    DRIP_SIZE.LEFT_DRIP.WIDTH * scale,
    DRIP_SIZE.LEFT_DRIP.HEIGHT * scale,
  );

  // drip right - long
  drawSingleDrip(
    x + DRIP_SIZE.RIGHT_DRIP_LONG.CX * scale,
    baseY + DRIP_SIZE.RIGHT_DRIP_LONG.TOP_Y * scale,
    DRIP_SIZE.RIGHT_DRIP_LONG.WIDTH * scale,
    DRIP_SIZE.RIGHT_DRIP_LONG.HEIGHT * scale,
  );

  // drip right - short
  drawSingleDrip(
    x + DRIP_SIZE.RIGHT_DRIP_SHORT.CX * scale,
    baseY + DRIP_SIZE.RIGHT_DRIP_SHORT.TOP_Y * scale,
    DRIP_SIZE.RIGHT_DRIP_SHORT.WIDTH * scale,
    DRIP_SIZE.RIGHT_DRIP_SHORT.HEIGHT * scale,
  );
}

function drawSide(x, y, w, h, d) {
  ctx.beginPath();
  const layerHeight = d / 3;

  // left top
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h / 2);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x - w / 2, y + h / 2 + layerHeight);
  ctx.closePath();
  ctx.fillStyle = GRASS_BLOCK.LEFT_EDGE;
  ctx.fill();

  //left base
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h / 2 + layerHeight);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x, y + h + d);
  ctx.lineTo(x - w / 2, y + h / 2 + d);
  ctx.closePath();
  ctx.fillStyle = GRASS_BLOCK.LEFT_BASE;
  ctx.fill();

  // right
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 2);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x + w / 2, y + h / 2 + layerHeight);
  ctx.closePath();
  ctx.fillStyle = GRASS_BLOCK.RIGHT_EDGE;
  ctx.fill();

  //right base
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 2 + layerHeight);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x, y + h + d);
  ctx.lineTo(x + w / 2, y + h / 2 + d);
  ctx.closePath();
  ctx.fillStyle = GRASS_BLOCK.RIGHT_BASE;
  ctx.fill();
}

function drawGrassTile(x, y, scale) {
  const edgeTopWidth = TILE_SIZE.GRASS.EDGE_WIDTH * scale;
  const h = TILE_SIZE.GRASS.EDGE_HEIGHT * scale;
  const d = TILE_SIZE.GRASS.DEPTH * scale;
  const topWidth = TILE_SIZE.GRASS.TOP_WIDTH * scale;
  const topHeight = TILE_SIZE.GRASS.TOP_HEIGHT * scale;

  const centerY = y + h / 2;
  const newY = centerY - topHeight / 2;

  drawSide(x, y, edgeTopWidth, h, d);
  drawTop(x, y, edgeTopWidth, h, GRASS_BLOCK.DRIP);
  drawTop(x, newY, topWidth, topHeight, GRASS_BLOCK.TOP);
  drawDrip(x, y, edgeTopWidth, h, scale);
}

function render() {
  const rect = canvas.getBoundingClientRect();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = rect.width / CANVAS_WIDTH;

  //center
  const x = rect.width / 2;
  const y = rect.height / 2;

  drawGrassTile(x, y, scale);
}

resizeCanvas();
render();

const observer = new ResizeObserver(() => {
  resizeCanvas();
  render();
});

observer.observe(canvas);
