import { OBJECT_HEIGHT, OBJECT_WIDTH } from "./constants/constant.js";

export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function drawImageOnTile(ctx, img, tileX, tileY, scale = 1) {
  const imgWidth = OBJECT_WIDTH * scale;
  const imgHeight = OBJECT_HEIGHT * scale;

  // center + ยืนบน tile
  const x = tileX - imgWidth / 2;
  const y = tileY - imgHeight + 35 * scale; // ปรับให้เท้าติดพื้น

  ctx.drawImage(img, x, y, imgWidth, imgHeight);
}
