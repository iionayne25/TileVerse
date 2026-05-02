export function drawPixelObject(ctx, object, x, y, scale = 1) {
  const pixel = object.pixelSize * scale;

  object.data.forEach((row, rowIndex) => {
    [...row].forEach((cell, colIndex) => {
      if (cell === "O") return;

      const color = object.palette[cell];
      if (!color) return;

      ctx.fillStyle = color;
      ctx.fillRect(x + colIndex * pixel, y + rowIndex * pixel, pixel, pixel);
    });
  });
}
