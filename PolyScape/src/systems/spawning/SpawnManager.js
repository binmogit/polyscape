import { GAME_WIDTH, GAME_HEIGHT } from '../../utils/Constants.js';

export class SpawnManager {
    constructor(app, container) {
        this.app = app;
        this.container = container;
        this.entities = [];
        this.spawnAttempts = 10; // Max attempts to find non-overlapping position
        this.creatureFactories = new Map(); // Registry of creature creation functions
    }

    /**
     * Register a creature factory function
     * @param {string} type - Creature type identifier
     * @param {Function} factory - Function that creates and returns the creature
     */
    registerCreatureFactory(type, factory) {
        this.creatureFactories.set(type, factory);
    }

    /**
     * Check if a position overlaps with existing entities
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate  
     * @param {number} radius - Collision radius
     * @returns {boolean} - True if position is clear
     */
    isPositionClear(x, y, radius = 50) {
        for (const entity of this.entities) {
            if (!entity.sprite || !entity.sprite.parent) continue;

            const dx = entity.sprite.x - x;
            const dy = entity.sprite.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if entities are too close (using combined radii)
            const entityRadius = entity.collisionRadius || 50;
            if (distance < radius + entityRadius) {
                return false;
            }
        }
        return true;
    }

    /**
     * Find a safe spawn position that doesn't overlap with existing entities
     * @param {Object} bounds - Spawn boundaries {minX, maxX, minY, maxY}
     * @param {number} radius - Collision radius for the new entity
     * @returns {Object|null} - {x, y} coordinates or null if no position found
     */
    findSafeSpawnPosition(bounds = {}, radius = 50) {
        const {
            minX = 0,
            maxX = GAME_WIDTH,
            minY = 0,
            maxY = GAME_HEIGHT
        } = bounds;

        for (let attempt = 0; attempt < this.spawnAttempts; attempt++) {
            const x = Math.random() * (maxX - minX - radius * 2) + minX + radius;
            const y = Math.random() * (maxY - minY - radius * 2) + minY + radius;

            if (this.isPositionClear(x, y, radius)) {
                return { x, y };
            }
        }
        return null; // No safe position found
    }

    /**
     * Spawn a creature using a registered factory
     * @param {string} creatureType - Type of creature to spawn
     * @param {Object} options - Spawn options
     * @returns {Object|null} - The spawned creature or null if spawn failed
     */
    spawn(creatureType, options = {}) {
        const factory = this.creatureFactories.get(creatureType);
        if (!factory) {
            console.warn(`No factory registered for creature type: ${creatureType}`);
            return null;
        }

        const {
            bounds = {},
            radius = 50,
            autoAdd = true,
            ...creatureOptions
        } = options;

        // Find safe spawn position
        const position = this.findSafeSpawnPosition(bounds, radius);
        if (!position) {
            console.warn(`Could not find safe spawn position for ${creatureType}`);
            return null;
        }

        // Create creature using factory
        const creature = factory(this.app, position.x, position.y, creatureOptions);
        if (!creature) {
            console.warn(`Factory failed to create ${creatureType}`);
            return null;
        }

        // Set collision radius for future collision checks
        creature.collisionRadius = radius;

        // Auto-add to container and tracking if requested
        if (autoAdd) {
            this.addEntity(creature);
        }

        return creature;
    }

    /**
     * Add an existing entity to the spawn manager's tracking
     * @param {Object} entity - The entity to track
     */
    addEntity(entity) {
        if (entity.sprite && !entity.sprite.parent) {
            this.container.addChild(entity.sprite);
        }

        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
    }

    /**
     * Remove an entity from tracking and destroy it
     * @param {Object} entity - The entity to remove
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }

        if (entity.destroy) {
            entity.destroy();
        }
    }

    /**
     * Set up automatic behavior for a creature (like auto-damage)
     * @param {Object} creature - The creature to set up
     * @param {Object} behaviorOptions - Behavior configuration
     */
    setupBehavior(creature, behaviorOptions = {}) {
        const {
            autoDamage = false,
            damageInterval = 2000,
            damageRange = [1, 3],
            onDeath = null,
            autoRespawn = false,
            respawnDelay = 1000,
            respawnOptions = {}
        } = behaviorOptions;

        if (autoDamage && creature.takeDamage) {
            const interval = setInterval(() => {
                if (!creature.stats || !creature.sprite || !creature.sprite.parent) {
                    clearInterval(interval);
                    return;
                }

                // Deal random damage
                const damage = Math.floor(Math.random() * (damageRange[1] - damageRange[0] + 1)) + damageRange[0];
                creature.takeDamage(damage);

                // Handle death
                if (!creature.isAlive) {
                    clearInterval(interval);

                    const handleDeath = () => {
                        this.removeEntity(creature);

                        if (onDeath) onDeath(creature);

                        if (autoRespawn) {
                            setTimeout(() => {
                                // Get creature type from creature's constructor name or a type property
                                const creatureType = creature.constructor.name.toLowerCase().replace(/^green/, '');
                                this.spawn(creatureType, respawnOptions);
                            }, respawnDelay);
                        }
                    };

                    if (creature.die) {
                        creature.die(handleDeath);
                    } else {
                        handleDeath();
                    }
                }
            }, damageInterval);
        }
    }

    /**
     * Clean up dead or invalid entities
     */
    cleanup() {
        this.entities = this.entities.filter(entity => {
            if (!entity.sprite || !entity.sprite.parent) {
                if (entity.destroy) entity.destroy();
                return false;
            }
            return true;
        });
    }

    /**
     * Get count of active entities by type
     * @param {string} type - Optional type filter
     * @returns {number} - Number of active entities
     */
    getEntityCount(type = null) {
        if (!type) return this.entities.length;

        return this.entities.filter(entity => {
            const entityType = entity.constructor.name.toLowerCase();
            return entityType.includes(type.toLowerCase());
        }).length;
    }

    /**
     * Get all entities of a specific type
     * @param {string} type - Type to filter by
     * @returns {Array} - Array of entities of the specified type
     */
    getEntitiesByType(type) {
        return this.entities.filter(entity => {
            const entityType = entity.constructor.name.toLowerCase();
            return entityType.includes(type.toLowerCase());
        });
    }

    /**
     * Destroy all entities and clean up
     */
    destroy() {
        this.entities.forEach(entity => {
            if (entity.destroy) entity.destroy();
        });
        this.entities = [];
        this.creatureFactories.clear();
    }
}