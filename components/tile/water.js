import { TILE_SIZE, DRIP_SIZE } from "../../constants/constant.js";

const css = getComputedStyle(document.documentElement);
const getVar = (name) => css.getPropertyValue(name).trim();

const WATER_BLOCK = {
  TOP: getVar("--water-top"),
  DRIP: getVar("--water-drip"),
  LEFT_EDGE: getVar("--water-left-edge"),
  LEFT_BASE: getVar("--water-left-base"),
  RIGHT_EDGE: getVar("--water-right-edge"),
  RIGHT_BASE: getVar("--water-right-base"),
};

function drawTop(ctx, x, y, w, h, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x - w / 2, y + h / 2);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

function drawSingleDrip(ctx, cx, topY, width, height) {
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

function drawDrip(ctx, x, y, w, h, scale) {
  const baseY = y + h / 2;

  ctx.fillStyle = WATER_BLOCK.DRIP;

  // drip left
  drawSingleDrip(
    ctx,
    x - DRIP_SIZE.LEFT_DRIP.CX * scale,
    baseY + DRIP_SIZE.LEFT_DRIP.TOP_Y * scale,
    DRIP_SIZE.LEFT_DRIP.WIDTH * scale,
    DRIP_SIZE.LEFT_DRIP.HEIGHT * scale,
  );

  // drip right - long
  drawSingleDrip(
    ctx,
    x + DRIP_SIZE.RIGHT_DRIP_LONG.CX * scale,
    baseY + DRIP_SIZE.RIGHT_DRIP_LONG.TOP_Y * scale,
    DRIP_SIZE.RIGHT_DRIP_LONG.WIDTH * scale,
    DRIP_SIZE.RIGHT_DRIP_LONG.HEIGHT * scale,
  );

  // drip right - short
  drawSingleDrip(
    ctx,
    x + DRIP_SIZE.RIGHT_DRIP_SHORT.CX * scale,
    baseY + DRIP_SIZE.RIGHT_DRIP_SHORT.TOP_Y * scale,
    DRIP_SIZE.RIGHT_DRIP_SHORT.WIDTH * scale,
    DRIP_SIZE.RIGHT_DRIP_SHORT.HEIGHT * scale,
  );
}

function drawSide(ctx, x, y, w, h, d) {
  ctx.beginPath();
  const layerHeight = d / 3;

  // left top
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h / 2);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x - w / 2, y + h / 2 + layerHeight);
  ctx.closePath();
  ctx.fillStyle = WATER_BLOCK.LEFT_EDGE;
  ctx.fill();

  //left base
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h / 2 + layerHeight);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x, y + h + d);
  ctx.lineTo(x - w / 2, y + h / 2 + d);
  ctx.closePath();
  ctx.fillStyle = WATER_BLOCK.LEFT_BASE;
  ctx.fill();

  // right
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 2);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x + w / 2, y + h / 2 + layerHeight);
  ctx.closePath();
  ctx.fillStyle = WATER_BLOCK.RIGHT_EDGE;
  ctx.fill();

  //right base
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 2 + layerHeight);
  ctx.lineTo(x, y + h + layerHeight);
  ctx.lineTo(x, y + h + d);
  ctx.lineTo(x + w / 2, y + h / 2 + d);
  ctx.closePath();
  ctx.fillStyle = WATER_BLOCK.RIGHT_BASE;
  ctx.fill();
}

export function drawWaterTile(ctx, x, y, scale) {
  const edgeTopWidth = TILE_SIZE.WATER.EDGE_WIDTH * scale;
  const h = TILE_SIZE.WATER.EDGE_HEIGHT * scale;
  const d = TILE_SIZE.WATER.DEPTH * scale;
  const topWidth = TILE_SIZE.WATER.TOP_WIDTH * scale;
  const topHeight = TILE_SIZE.WATER.TOP_HEIGHT * scale;

  const centerY = y + h / 2;
  const newY = centerY - topHeight / 2;

  drawSide(ctx, x, y, edgeTopWidth, h, d);
  drawTop(ctx, x, y, edgeTopWidth, h, WATER_BLOCK.DRIP);
  drawTop(ctx, x, newY, topWidth, topHeight, WATER_BLOCK.TOP);
  drawDrip(ctx, x, y, edgeTopWidth, h, scale);
}
