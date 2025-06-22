import { Container } from 'pixi.js';
import { Ticker } from 'pixi.js';
import { TextRenderer } from '../../systems/rendering/TextRenderer.js';
import { Button } from '../components/Button.js';
import { TextLabel } from '../components/TextLabel.js';
import { Slime } from '../../entities/creatures/Slime.js';
import { SpawnManager } from '../../systems/spawning/SpawnManager.js';
import { createCharacterScene } from './CharacterScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../utils/Constants.js';

export function createTitleScene(app) {
    const container = new Container();

    //Title
    const letters = ['P', 'O', 'L', 'Y', 'S', 'C', 'A', 'P', 'E'];
    const labelText = letters.join('');
    const letterSize = GAME_WIDTH / letters.length;
    const letterSpacing = 0;

    const label = TextLabel(labelText, letterSize, letterSpacing);
    container.addChild(label);

    //Start Button
    const startButton = Button(() => {
        spawnManager.destroy(); // Clean up spawn manager
        app.stage.removeChild(container);
        const nextScene = createCharacterScene(app);
        app.stage.addChild(nextScene);
    });

    startButton.x = GAME_WIDTH / 2 - 100;
    startButton.y = GAME_HEIGHT - 100;
    container.addChild(startButton);

    // Initialize spawn manager
    const spawnManager = new SpawnManager(app, container);

    // Register creature factories
    spawnManager.registerCreatureFactory('slime', (app, x, y, options) => {
        return new Slime(app, x, y, options.stats || {}, options.showHealthBar || false);
    });

    // Slime spawning function
    function spawnSlime() {
        const slime = spawnManager.spawn('slime', {
            bounds: {
                minY: GAME_HEIGHT / 2, // Spawn in lower half of screen
                maxY: GAME_HEIGHT - 150 // Leave room for start button
            },
            radius: 50,
            showHealthBar: true
        });

        if (slime) {
            // Set up behavior for this slime
            spawnManager.setupBehavior(slime, {
                autoDamage: true,
                damageInterval: 2000,
                damageRange: [1, 3],
                onDeath: () => {
                    // Spawn new slime after a short delay if we have fewer than 3
                    setTimeout(() => {
                        if (spawnManager.getEntityCount('slime') < 3 && container.parent) {
                            spawnSlime();
                        }
                    }, 1000);
                }
            });
        } else {
            // If spawn failed, try again after a delay
            setTimeout(() => {
                if (container.parent) spawnSlime();
            }, 2000);
        }
    }

    // Spawn initial slimes with delays to avoid clustering
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            if (container.parent) { // Only spawn if scene is still active
                spawnSlime();
            }
        }, i * 1000);
    }

    // Periodic cleanup of dead entities
    const cleanupInterval = setInterval(() => {
        if (!container.parent) {
            clearInterval(cleanupInterval);
            return;
        }
        spawnManager.cleanup();
    }, 5000);

    return container;
}