import { Graphics, Container } from 'pixi.js';

export function HealthBar(width = 80, height = 6) {
    const container = new Container();

    // Background (dark gray)
    const background = new Graphics();
    background.rect(0, 0, width, height);
    background.fill(0x333333);
    container.addChild(background);

    // Health fill (green)
    const healthFill = new Graphics();
    container.addChild(healthFill);

    return {
        container,
        update: (currentHp, maxHp) => {
            healthFill.clear();
            if (maxHp > 0) {
                const percentage = Math.max(0, Math.min(1, currentHp / maxHp));
                const fillWidth = width * percentage;
                healthFill.rect(0, 0, fillWidth, height);
                healthFill.fill(0x00ff00); // Green
            }
        },
        positionAbove: (sprite) => {
            container.x = sprite.x - width / 2;
            container.y = sprite.y - 20;
        }
    };
}