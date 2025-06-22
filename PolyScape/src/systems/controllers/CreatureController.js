// CreatureControllers.js - Generic movement controllers for any creature

// Base controller class that all controllers extend
export class BaseController {
    constructor(creature) {
        this.creature = creature;
        this.isActive = true;
    }

    // Override this in subclasses
    update(deltaTime) {
        // Base implementation does nothing
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    destroy() {
        this.isActive = false;
    }
}

// Player controller - responds to keyboard input
export class PlayerController extends BaseController {
    constructor(creature, options = {}) {
        super(creature);

        this.speed = options.speed || 1.0;
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        // Key bindings
        this.keyBindings = {
            ArrowLeft: 'left',
            ArrowRight: 'right',
            ArrowUp: 'up',
            ArrowDown: 'down',
            KeyA: 'left',
            KeyD: 'right',
            KeyW: 'up',
            KeyS: 'down'
        };

        // Bind keyboard events
        this.boundKeyDown = this.onKeyDown.bind(this);
        this.boundKeyUp = this.onKeyUp.bind(this);

        document.addEventListener('keydown', this.boundKeyDown);
        document.addEventListener('keyup', this.boundKeyUp);
    }

    onKeyDown(event) {
        const action = this.keyBindings[event.code];
        if (action && this.keys.hasOwnProperty(action)) {
            this.keys[action] = true;
            event.preventDefault();
        }
    }

    onKeyUp(event) {
        const action = this.keyBindings[event.code];
        if (action && this.keys.hasOwnProperty(action)) {
            this.keys[action] = false;
            event.preventDefault();
        }
    }

    update(deltaTime = 1) {
        if (!this.isActive || !this.creature.isAlive) return;

        // Calculate movement based on energy/health
        const factors = this.creature.stats.getFactors();
        const actualSpeed = this.speed * factors.energy * factors.health * deltaTime;

        // Apply movement
        if (this.keys.left) {
            this.creature.sprite.x -= actualSpeed;
        }
        if (this.keys.right) {
            this.creature.sprite.x += actualSpeed;
        }
        if (this.keys.up) {
            this.creature.sprite.y -= actualSpeed;
        }
        if (this.keys.down) {
            this.creature.sprite.y += actualSpeed;
        }

        // Optional: Keep creature on screen
        this.creature.sprite.x = Math.max(50, Math.min(750, this.creature.sprite.x));
        this.creature.sprite.y = Math.max(100, Math.min(500, this.creature.sprite.y));
    }

    destroy() {
        super.destroy();
        // Clean up event listeners
        document.removeEventListener('keydown', this.boundKeyDown);
        document.removeEventListener('keyup', this.boundKeyUp);
    }
}

// AI input emulator - simulates player inputs for computer control
export class AIController extends BaseController {
    constructor(creature, options = {}) {
        super(creature);

        this.speed = options.speed || 0.5;
        this.boundaries = options.boundaries || { left: 50, right: 750, top: 100, bottom: 500 };

        // AI behavior settings
        this.behaviorType = options.behaviorType || 'wander'; // 'wander', 'patrol', 'follow'
        this.changeDirectionChance = options.changeDirectionChance || 0.005;
        this.pauseChance = options.pauseChance || 0.01;
        this.pauseDuration = 0;
        this.maxPauseDuration = options.maxPauseDuration || 120;

        // Current AI inputs (same as player inputs)
        this.inputs = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        // AI state
        this.direction = Math.random() > 0.5 ? 1 : -1; // 1 = right, -1 = left
        this.target = null;

        this.initializeBehavior();
    }

    initializeBehavior() {
        switch (this.behaviorType) {
            case 'patrol':
                // Simple left-right patrol
                break;
            case 'wander':
                this.setRandomTarget();
                break;
            case 'follow':
                // Would need a target to follow
                break;
        }
    }

    setRandomTarget() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;

        this.target = {
            x: this.creature.sprite.x + Math.cos(angle) * distance,
            y: this.creature.sprite.y + Math.sin(angle) * distance
        };

        // Keep target within boundaries
        this.target.x = Math.max(this.boundaries.left, Math.min(this.boundaries.right, this.target.x));
        this.target.y = Math.max(this.boundaries.top, Math.min(this.boundaries.bottom, this.target.y));
    }

    updateAIInputs() {
        // Reset inputs
        this.inputs = { left: false, right: false, up: false, down: false };

        // Handle pausing
        if (this.pauseDuration > 0) {
            this.pauseDuration--;
            return;
        }

        // Random pause
        if (Math.random() < this.pauseChance) {
            this.pauseDuration = Math.random() * this.maxPauseDuration;
            return;
        }

        if (this.behaviorType === 'patrol') {
            this.updatePatrolInputs();
        } else if (this.behaviorType === 'wander') {
            this.updateWanderInputs();
        }
    }

    updatePatrolInputs() {
        // Simple patrol behavior
        if (this.creature.sprite.x <= this.boundaries.left) {
            this.direction = 1;
        } else if (this.creature.sprite.x >= this.boundaries.right) {
            this.direction = -1;
        }

        // Random direction change
        if (Math.random() < this.changeDirectionChance) {
            this.direction *= -1;
        }

        // Set input based on direction
        if (this.direction > 0) {
            this.inputs.right = true;
        } else {
            this.inputs.left = true;
        }
    }

    updateWanderInputs() {
        if (!this.target) {
            this.setRandomTarget();
            return;
        }

        const dx = this.target.x - this.creature.sprite.x;
        const dy = this.target.y - this.creature.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close to target, pick a new one
        if (distance < 10) {
            this.setRandomTarget();
            return;
        }

        // Set inputs to move toward target
        if (Math.abs(dx) > 5) {
            if (dx > 0) this.inputs.right = true;
            else this.inputs.left = true;
        }

        if (Math.abs(dy) > 5) {
            if (dy > 0) this.inputs.down = true;
            else this.inputs.up = true;
        }
    }

    update(deltaTime = 1) {
        if (!this.isActive || !this.creature.isAlive) return;

        // Update AI decision making
        this.updateAIInputs();

        // Apply movement using the same logic as player controller
        const factors = this.creature.stats.getFactors();
        const actualSpeed = this.speed * factors.energy * factors.health * deltaTime;

        if (this.inputs.left) {
            this.creature.sprite.x -= actualSpeed;
        }
        if (this.inputs.right) {
            this.creature.sprite.x += actualSpeed;
        }
        if (this.inputs.up) {
            this.creature.sprite.y -= actualSpeed;
        }
        if (this.inputs.down) {
            this.creature.sprite.y += actualSpeed;
        }

        // Keep creature within boundaries
        this.creature.sprite.x = Math.max(this.boundaries.left, Math.min(this.boundaries.right, this.creature.sprite.x));
        this.creature.sprite.y = Math.max(this.boundaries.top, Math.min(this.boundaries.bottom, this.creature.sprite.y));
    }

    // Utility methods for AI behavior
    setBehavior(behaviorType) {
        this.behaviorType = behaviorType;
        this.initializeBehavior();
    }

    setTarget(x, y) {
        this.target = { x, y };
    }

    setBoundaries(boundaries) {
        this.boundaries = { ...this.boundaries, ...boundaries };
    }
}

// Controller manager to handle multiple creatures
export class ControllerManager {
    constructor() {
        this.controllers = new Map();
    }

    // Add a controller for a creature
    addController(creature, controller) {
        // Remove existing controller if any
        this.removeController(creature);

        this.controllers.set(creature, controller);
    }

    // Remove controller for a creature
    removeController(creature) {
        const existingController = this.controllers.get(creature);
        if (existingController) {
            existingController.destroy();
            this.controllers.delete(creature);
        }
    }

    // Update all controllers
    update(deltaTime = 1) {
        for (const [creature, controller] of this.controllers) {
            if (creature.isAlive) {
                controller.update(deltaTime);
            } else {
                // Clean up dead creatures
                this.removeController(creature);
            }
        }
    }

    // Get controller for a creature
    getController(creature) {
        return this.controllers.get(creature);
    }

    // Switch controller type for a creature
    switchController(creature, newController) {
        this.addController(creature, newController);
    }

    // Clean up all controllers
    destroy() {
        for (const controller of this.controllers.values()) {
            controller.destroy();
        }
        this.controllers.clear();
    }
}

/*
Usage Examples:

// Basic setup
import { PlayerController, AIController, ControllerManager } from './CreatureControllers.js';
import { createGreenSlime } from './GreenSlime.js';

const controllerManager = new ControllerManager();

// Create AI-controlled creature
const aiCreature = createGreenSlime(app, 200, 300);
const aiController = new AIController(aiCreature, {
    speed: 0.8,
    behaviorType: 'patrol',
    boundaries: { left: 50, right: 750 }
});
controllerManager.addController(aiCreature, aiController);

// Create player-controlled creature
const playerCreature = createGreenSlime(app, 400, 300);
const playerController = new PlayerController(playerCreature, { speed: 1.5 });
controllerManager.addController(playerCreature, playerController);

// In your game loop:
function gameLoop() {
    controllerManager.update(); // Updates all controllers
    // ... rest of game logic
}

// Switch from AI to player control:
const newPlayerController = new PlayerController(aiCreature);
controllerManager.switchController(aiCreature, newPlayerController);
*/