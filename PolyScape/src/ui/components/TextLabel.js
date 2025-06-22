import { Container } from 'pixi.js';
import { TextRenderer } from '../../systems/rendering/TextRenderer.js';

export function TextLabel(text, letterSize, spacing = 0) {
    const container = new Container();

    text.split('').forEach((char, i) => {
        const letter = TextRenderer(char, letterSize);
        letter.x = i * (letterSize + spacing);
        container.addChild(letter);
    });

    return container;
}
