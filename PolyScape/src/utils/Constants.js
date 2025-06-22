// Game configuration constants
export const GAME_CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    BACKGROUND_COLOR: 0x1099bb,
    TARGET_FPS: 60
};

// UI constants
export const UI_CONFIG = {
    HEALTH_BAR_WIDTH: 60,
    HEALTH_BAR_HEIGHT: 4,
    BUTTON_WIDTH: 200,
    BUTTON_HEIGHT: 50,
    MARGIN: 20
};

// Creature constants
export const CREATURE_CONFIG = {
    SLIME_MIN_HP: 30,
    SLIME_MAX_HP: 60,
    DEFAULT_SIZE: 64,
    DEFAULT_HEIGHT: 40
};

// Export individual values for convenience
export const { WIDTH: GAME_WIDTH, HEIGHT: GAME_HEIGHT } = GAME_CONFIG;