// Separated defaults and presets for cleaner organization
export const CREATURE_DEFAULTS = {
    slime: {
        size: { min: 5, max: 10 },
        hp: { min: 50, max: 100 },
        strength: { min: 3, max: 10 },
        agility: { min: 3, max: 10 },
        intelligence: { min: 2, max: 8 },
        vitality: { min: 4, max: 10 },
        metabolism: { min: 3, max: 7 }
    },
    generic: {
        size: { min: 5, max: 10 },
        hp: { min: 50, max: 100 },
        strength: { min: 3, max: 10 },
        agility: { min: 3, max: 10 },
        intelligence: { min: 2, max: 8 },
        vitality: { min: 4, max: 10 },
        metabolism: { min: 3, max: 7 }
    }
};

export const CREATURE_PRESETS = {
    slime: {
        tiny: { size: 5, agility: 8, intelligence: 3 },
        normal: { size: 7, vitality: 6 },
        large: { size: 9, strength: 8, vitality: 8 },
        smart: { size: 6, intelligence: 8, vitality: 7 },
        tank: { size: 10, strength: 10, hp: 100, agility: 3 }
    }
};