
window.onload = () => {


  // VARIABLES
  const tau = Math.PI * 2;
  const W = H = 500;
  const c = document.getElementById('hidden_canvas');
  const c0 = c.getContext('2d');
  const c1 = document.getElementById("target_canvas").getContext('2d');
  const img = document.getElementById("img");
  let points = [];
  let imageData;

  // Draw data from img onto hidden canvas then import that data into variable; then, remove hidden canvas
  async function draw_image() { c0.drawImage(img, 0, 0, W, H); }
  draw_image().then(imageData = c0.getImageData(0, 0, W, H));
  c.remove();

  const getPoint = () => {

    const pos = {
      x: Math.floor(Math.random() * W),
      y: Math.floor(Math.random() * H)
    }
    const pixelIndex = (pos.x + pos.y * imageData.width) * 4;
    const color = {
      r: imageData.data[pixelIndex],
      g: imageData.data[pixelIndex + 1],
      b: imageData.data[pixelIndex + 2],
    }
    const lightness = (color.r + color.g + color.b) / (3 * 255);
    const decay = 1 - Math.min(0.3, (lightness * .3));
    const life = 1;
    const r = 1.5;

    return {
      pos,
      color,
      life,
      decay,
      r,
    };

  };

  const loop = () => {

    points.forEach((point) => {
      // Update point's radius & life
      point.r += 0.1;
      if (point.r > 10) points.splice(points.indexOf(point), 1);
      point.life *= point.decay;
      // Draw point
      c1.fillStyle = `rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, 0.1)`;
      c1.beginPath();
      c1.arc(point.pos.x - (point.r / 2), point.pos.y - (point.r / 2), point.r, 0, tau);
      c1.closePath();
      c1.fill();
    });

    for (let i = 0; i < 10; i++) {
      points.push(getPoint(W, H));
      points.push(getPoint(W, H));
      points.push(getPoint(W, H));
    }

    // Remove points
    points = points.filter(p => p.life > 0.01);

    requestAnimationFrame(loop)
  };

  loop();

}
