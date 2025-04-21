import { PixelResource, PixelTarget, Ant, Pixel } from "./classes.js";
import { squareToPoints, textToPoints } from "./utils.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



// --- Initialisation des objets --- //
const pixelResource = new PixelResource([
  { x: 100, y: 100 }, 
  { x: 101, y: 101 },
  { x: 102, y: 102 },
  // Ajoute plus de points ici pour le pixelResource si nécessaire
]);
console.log(pixelResource)

// const pixelTarget = new PixelTarget(squareToPoints(200,200, 100), ctx);
const pixelTarget = new PixelTarget(textToPoints("Jules RUMEAU", 500, 500), ctx);



const nbr_ants = 500;
// --- Création des fourmis --- //
const ants = [];
for (let i = 0; i < nbr_ants; i++) {
  ants.push(new Ant(pixelResource, pixelTarget, pixelResource));
}

// --- Animation --- //
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Met à jour les fourmis
  ants.forEach(ant => {
    ant.update();
    ant.draw(ctx);
  });

  // Affiche les pixels immobiles (immortels)
  pixelResource.draw(ctx);
  pixelTarget.draw(ctx);

  requestAnimationFrame(animate);
}

// Démarrer l'animation
animate();
