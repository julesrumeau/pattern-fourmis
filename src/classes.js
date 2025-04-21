
  
  // #region Pixel
  export class Pixel {
    constructor(x, y, filled = false, ttl = 1000, size = 2, color = 'white') {
      this.x = x;
      this.y = y;
      this.filled = filled; // Indique si ce pixel est visible (présent sur la grille)
      this.ttl = ttl;
      this.maxTTL = ttl;
      this.size = size;
      this.color = color;
    }
  
    // Mise à jour (utile si besoin d'une durée de vie)
    update() {
    if (!this.filled) return false;
    this.ttl--;
    if (this.ttl <= 0) {
      this.filled = false;  // Le pixel devient "mort" lorsqu'il atteint 0
    }
    return this.filled; // Retourne si le pixel est toujours actif
  }
  
    // Dessiner seulement si le pixel est actif
    draw(ctx) {
      if (this.filled) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }
  }

// #region PixelResource
export class PixelResource {
  constructor(positions = []) {
    this.pixels = positions.map(pos => new Pixel(pos.x, pos.y, true));
  }

  update() {
    // Nettoyer les pixels "morts"
    this.pixels = this.pixels.filter(pixel => !pixel.update());
  }

  draw(ctx) {
    this.pixels.forEach(pixel => pixel.draw(ctx));
  }

  getRandomPixel() {
    const available = this.pixels.filter(p => p.filled);
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  removePixel(x, y) {
    const pixel = this.pixels.find(p => p.x === x && p.y === y);
    if (pixel) pixel.filled = false;
  }
}

  



// #region PixelTarget
export class PixelTarget {
  constructor(positions = [], ctx) {
    this.pixels = positions.map(pos => new Pixel(pos.x, pos.y, false));
    this.ctx = ctx;
  }

  add(pixel) {
    const target = this.pixels.find(p => p.x === pixel.x && p.y === pixel.y);
    if (target && !target.filled) {
      target.filled = true;
      target.color = pixel.color;
      target.ttl = pixel.maxTTL;
    }
  }
  

  draw(ctx) {
    this.pixels.forEach(pixel => pixel.draw(ctx));
    this.pixels.forEach(pixel => pixel.update());
  }

  getRandomEmptyPixel() {
    const empty = this.pixels.filter(p => !p.filled);
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
  }

  remove(x, y) {
    const pixel = this.pixels.find(p => p.x === x && p.y === y);
    if (pixel) pixel.filled = false;
  }
}

 
 // #region Ant
export class Ant {
  constructor(pixelResource, pixelTarget) {
    this.pixelResource = pixelResource;
    this.pixelTarget = pixelTarget;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.target = this.pixelResource.getRandomPixel();
    this.carryingPixel = null;
  }

  update() {
    if (!this.target) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1) {
      if (!this.carryingPixel) {
        // Prend un pixel source
        this.carryingPixel = this.target;
        // this.pixelResource.removePixel(this.target.x, this.target.y);
        this.target = this.pixelTarget.getRandomEmptyPixel();
      } else {
        // Dépose dans la cible
        this.pixelTarget.add(this.target);
        this.carryingPixel = null;
        this.target = this.pixelResource.getRandomPixel();
      }
    } else {
      this.x += (dx / dist) * 2;
      this.y += (dy / dist) * 2;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.carryingPixel ? 'yellow' : 'gray';
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}
