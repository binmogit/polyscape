import paper from 'paper';
import { Sprite, Texture } from 'pixi.js';

export function TextRenderer(letter, canvasSize = 100) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = canvasSize;

    const scope = new paper.PaperScope();
    scope.setup(canvas);

    const { Path, Point, Segment } = scope;

    const margin = canvasSize * 0.1; // 10% margin on each side
    const drawSize = canvasSize - margin * 2;

    const left = margin;
    const top = margin;
    const right = margin + drawSize;
    const bottom = margin + drawSize;
    const centerX = margin + drawSize / 2;
    const centerY = margin + drawSize / 2;

    if (letter === 'A') {
        var p1 = new Point(left, bottom);
        var p2 = new Point(centerX, top);
        var p3 = new Point(right, bottom);
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(p1);
        path.add(p2);
        path.add(p3);
        var p4 = p1.add(p2).divide(2);
        var p5 = p2.add(p3).divide(2);
        var path2 = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path2.add(p4);
        path2.add(p5);
    }

    if (letter === 'C') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(right, top + drawSize * 0.25))
        path.add(new Segment(
            new Point(left + drawSize * 0.75, top),
            new Point(drawSize * 0.25, 0),
            new Point(-drawSize * 0.25, 0)));
        path.add(new Point(left + drawSize * 0.25, top))
        path.add(new Segment(
            new Point(left, top + drawSize * 0.25),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path.add(new Point(left, top + drawSize * 0.75))
        path.add(new Segment(
            new Point(left + drawSize * 0.25, bottom),
            new Point(-drawSize * 0.25, 0),
            new Point(drawSize * 0.25, 0)));
        path.add(new Point(left + drawSize * 0.75, bottom))
        path.add(new Segment(
            new Point(right, top + drawSize * 0.75),
            new Point(0, drawSize * 0.25),
            new Point(0, -drawSize * 0.25)));

    }

    if (letter === 'E') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        var path2 = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(right, top))
        path.add(new Point(left, top))
        path.add(new Point(left, bottom))
        path.add(new Point(left, bottom))
        path.add(new Point(right, bottom))
        path2.add(new Point(left, centerY))
        path2.add(new Point(left + drawSize * 0.75, centerY))
    }
    if (letter === 'O') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(left, top + drawSize * 0.75))
        path.add(new Point(left, top + drawSize * 0.25))
        path.add(new Segment(
            new Point(left + drawSize * 0.25, top),
            new Point(-drawSize * 0.25, 0),
            new Point(drawSize * 0.25, 0)));
        path.add(new Point(left + drawSize * 0.75, top))
        path.add(new Segment(
            new Point(right, top + drawSize * 0.25),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path.add(new Point(right, top + drawSize * 0.75))
        path.add(new Segment(
            new Point(left + drawSize * 0.75, bottom),
            new Point(drawSize * 0.25, 0),
            new Point(-drawSize * 0.25, 0)));
        path.add(new Point(left + drawSize * 0.25, bottom))
        path.add(new Segment(
            new Point(left, top + drawSize * 0.75),
            new Point(0, drawSize * 0.25),
            new Point(0, -drawSize * 0.25)));

    }
    if (letter === 'P') {
        const path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(left, bottom));
        path.add(new Point(left, top));
        path.add(new Point(left + drawSize * 0.75, top));
        path.add(new Segment(
            new Point(right, top + drawSize * 0.25),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path.add(new Point(left + drawSize * 0.75, centerY));
        path.add(new Point(left, centerY));
    }
    if (letter === 'R') {
        const path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        const path2 = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(left, bottom));
        path.add(new Point(left, top));
        path.add(new Point(left + drawSize * 0.75, top));
        path.add(new Segment(
            new Point(right, top + drawSize * 0.25),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path.add(new Point(left + drawSize * 0.75, centerY));
        path.add(new Point(left, centerY));
        path2.add(new Point(left + drawSize * 0.75, centerY));
        path2.add(new Segment(
            new Point(right, top + drawSize * 0.75),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path2.add(new Point(right, bottom))
    }
    if (letter === 'S') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(right, top + drawSize * 0.25))
        path.add(new Segment(
            new Point(left + drawSize * 0.75, top),
            new Point(drawSize * 0.25, 0),
            new Point(-drawSize * 0.25, 0)));
        path.add(new Point(left + drawSize * 0.25, top))
        path.add(new Segment(
            new Point(left, top + drawSize * 0.25),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path.add(new Point(left + drawSize * 0.25, centerY))
        path.add(new Point(left + drawSize * 0.75, centerY))
        path.add(new Segment(
            new Point(right, top + drawSize * 0.75),
            new Point(0, -drawSize * 0.25),
            new Point(0, drawSize * 0.25)));
        path.add(new Point(left + drawSize * 0.75, bottom))
        path.add(new Point(left + drawSize * 0.25, bottom))
        path.add(new Segment(
            new Point(left, top + drawSize * 0.75),
            new Point(0, drawSize * 0.25),
            new Point(0, -drawSize * 0.25)));
    }
    if (letter === 'T') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        var path2 = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(left, top))
        path.add(new Point(right, top))
        path2.add(new Point(centerX, top))
        path2.add(new Point(centerX, bottom))

    }

    if (letter === 'L') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(left, top))
        path.add(new Point(left, bottom))
        path.add(new Point(right, bottom))

    }

    if (letter === 'Y') {
        var path = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        var path2 = new Path({
            strokeColor: 'white',
            strokeWidth: 2
        });
        path.add(new Point(left, top))
        path.add(new Point(centerX, centerY))
        path.add(new Point(right, top))
        path2.add(new Point(centerX, bottom))
        path2.add(new Point(centerX, centerY))
    }
    // Flush drawing to canvas
    scope.view.update();

    // Convert to Pixi texture
    const texture = Texture.from(canvas);
    const sprite = new Sprite(texture);

    return sprite;
}
