import { Application } from 'pixi.js';
import { createTitleScene } from './ui/scenes/TitleScene.js';

// Game constants
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Initialize PIXI Application with fixed size
const app = new Application();

async function initializeApp() {
    await app.init({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: 0x1099bb,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });

    // Add canvas to DOM
    document.getElementById('pixi-container').appendChild(app.canvas);

    // Start with title scene
    const titleScene = createTitleScene(app);
    app.stage.addChild(titleScene);

    console.log(`Game initialized at ${GAME_WIDTH}x${GAME_HEIGHT}`);
}

// Start the game
initializeApp().catch(console.error);

export { app };