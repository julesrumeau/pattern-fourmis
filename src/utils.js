export function textToPoints(text, centerX, centerY) {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
  
    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, 0, 100);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = [];
  
    for (let y = 0; y < imageData.height; y += 4) {
      for (let x = 0; x < imageData.width; x += 4) {
        const index = (y * imageData.width + x) * 4;
        const alpha = imageData.data[index + 3];
        if (alpha > 128) {
          points.push({
            x: x + centerX - canvas.width / 2,
            y: y + centerY - 100,
          });
        }
      }
    }
  
    return points;
  }
  
  export function squareToPoints(x, y, size) {
    const points = [];
    for (let i = 0; i < size; i += 2) {
      for (let j = 0; j < size; j += 2) {
        points.push({ x: x + i, y: y + j });
      }
    }
    return points;
  }
  