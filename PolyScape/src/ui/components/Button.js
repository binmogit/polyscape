import { Container, Graphics } from 'pixi.js';
import { TextRenderer } from '../../systems/rendering/TextRenderer.js';
import { TextLabel } from './TextLabel.js';

export function Button(onClick, width = 200, height = 60) {
    const button = new Container();
    const labelText = 'START';
    const letterSize = 40;
    const letterSpacing = 0;

    const labelContainer = TextLabel(labelText, letterSize, letterSpacing);

    // Center it
    labelContainer.x = (width - labelContainer.width) / 2;
    labelContainer.y = (height - letterSize) / 2;
    button.addChild(labelContainer);
    // Center the label container inside the button
    labelContainer.x = (width - labelContainer.width) / 2;
    labelContainer.y = (height - letterSize) / 2;

    button.addChild(labelContainer);

    // Interaction setup
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.on('pointertap', onClick);

    return button;
}
