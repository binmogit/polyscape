// Simplified creature stats - HP only
export function Stats(statsConfig = {}, creatureType = 'generic') {
    // Default HP ranges by creature type
    const HP_DEFAULTS = {
        generic: { min: 50, max: 100 },
        slime: { min: 30, max: 60 },
        goblin: { min: 40, max: 80 },
        dragon: { min: 200, max: 400 }
    };

    const hpRange = HP_DEFAULTS[creatureType] || HP_DEFAULTS.generic;

    // Generate random HP or use provided value
    const maxHp = statsConfig.hp || statsConfig.maxHp ||
        (hpRange.min + Math.floor(Math.random() * (hpRange.max - hpRange.min + 1)));

    let currentHp = maxHp;

    return {
        get hp() { return currentHp; },
        get maxHp() { return maxHp; },
        get healthPercent() { return Math.round((currentHp / maxHp) * 100); },
        get isAlive() { return currentHp > 0; },
        get isCritical() { return currentHp < maxHp * 0.2; },

        // Health modification
        modifyHealth(amount) {
            currentHp = Math.max(0, Math.min(maxHp, currentHp + amount));
            return currentHp;
        },

        // Condition based on HP only
        getCondition() {
            const hp = this.healthPercent;
            if (hp <= 0) return 'Dead';
            if (hp < 20) return 'Critical';
            if (hp < 50) return 'Poor';
            if (hp < 80) return 'Fair';
            return 'Good';
        },

        // Simplified rendering properties based on HP
        getRenderData() {
            const healthFactor = currentHp / maxHp;
            return {
                width: 64,  // Fixed size for now
                height: 40,
                colorIntensity: Math.max(0.3, healthFactor), // Dimmer when low HP
                strokeWidth: 2,
                animSpeed: 20 + (10 * (1 - healthFactor)), // Slower when hurt
                bounceAmp: 2 * healthFactor, // Less bounce when hurt
                isActive: currentHp > 0
            };
        },

        // Save/load
        serialize() {
            return { hp: currentHp, maxHp };
        },

        deserialize(data) {
            if (data.hp !== undefined) currentHp = data.hp;
            if (data.maxHp !== undefined) maxHp = data.maxHp;
        }
    };
}