import { Sprite, Texture, Ticker } from 'pixi.js';
import paper from 'paper';
import { Stats } from '../base/Stats.js';
import { HealthBar } from '../../ui/components/StatusBars.js';

export class Slime {
    constructor(app, x, y, statsConfig = {}, showHealthBar = false) {
        this.app = app;
        this.stats = Stats(statsConfig, 'slime');
        this.showHealthBar = showHealthBar;

        // Animation state
        this.t = 0;
        this.animMode = 'idle';
        this.dyingComplete = false;
        this.onDieComplete = null;

        // Initialize slime and health bar
        this._initializeSlime(x, y);
        if (this.showHealthBar) {
            this._initializeHealthBar();
        }
        this._startAnimation();
    }

    // Getters for backward compatibility
    get hp() { return this.stats.hp; }
    get isAlive() { return this.stats.isAlive; }
    get status() {
        return {
            ...this.stats.serialize(),
            condition: this.stats.getCondition()
        };
    }

    // Public methods
    takeDamage(damage) {
        const newHp = this.stats.modifyHealth(-damage);
        this._updateHealthBar();
        if (newHp <= 0 && this.animMode !== 'dying') {
            this.die();
        }
        return newHp;
    }

    heal(amount) {
        const result = this.stats.modifyHealth(amount);
        this._updateHealthBar();
        return result;
    }

    die(callback) {
        this.animMode = 'dying';
        this.onDieComplete = callback;
    }

    destroy() {
        Ticker.shared.remove(this._update);
        if (this.sprite.parent) {
            this.app.stage.removeChild(this.sprite);
        }
        if (this.healthBar && this.healthBar.container.parent) {
            this.app.stage.removeChild(this.healthBar.container);
        }
    }

    // Private initialization methods
    _initializeSlime(x, y) {
        const renderData = this.stats.getRenderData();
        const { canvas, slime, topSegment, scope } = this._createSlimeShape(renderData);

        this.renderData = renderData;
        this.canvas = canvas;
        this.slime = slime;
        this.topSegment = topSegment;
        this.scope = scope;

        // Create PIXI sprite
        this.texture = Texture.from(canvas);
        this.sprite = new Sprite(this.texture);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.x = x;
        this.sprite.y = y;

        this.app.stage.addChild(this.sprite);
    }

    _initializeHealthBar() {
        this.healthBar = HealthBar(60, 4);
        this.app.stage.addChild(this.healthBar.container);
        this._updateHealthBar();
    }

    _updateHealthBar() {
        if (this.healthBar && this.sprite.parent) {
            this.healthBar.positionAbove(this.sprite);
            this.healthBar.update(this.stats.hp, this.stats.maxHp);
        }
    }

    _startAnimation() {
        this._update = this._update.bind(this);
        Ticker.shared.add(this._update);
    }

    // Private animation methods
    _update() {
        if (!this.sprite.parent) return;

        this.t++;

        // Update render data based on current HP
        this.renderData = this.stats.getRenderData();

        if (this.animMode === 'idle') {
            this._animateIdle();
        } else if (this.animMode === 'dying') {
            if (this._animateDying() && !this.dyingComplete) {
                this.dyingComplete = true;
                if (this.onDieComplete) this.onDieComplete();
            }
        }

        // Update health bar position
        this._updateHealthBar();

        // Update visuals
        this.slime.segments[1] = this.topSegment;
        this.scope.view.update();
        this.texture.source.update();
    }

    _createSlimeShape(renderData) {
        const canvas = document.createElement('canvas');
        canvas.width = renderData.width;
        canvas.height = renderData.height;

        const scope = new paper.PaperScope();
        scope.setup(canvas);

        const { Path, Point, Segment } = scope;
        const left = new Point(0, renderData.height);
        const right = new Point(renderData.width, renderData.height);
        const top = new Point(renderData.width / 2, renderData.height / 2);
        const handleIn = new Point(-renderData.width / 2, 0);
        const handleOut = new Point(renderData.width / 2, 0);

        const topSegment = new Segment(top.clone(), handleIn.clone(), handleOut.clone());
        const slime = new Path({
            fillColor: new paper.Color(0, renderData.colorIntensity, 0, 0.25),
            strokeColor: new paper.Color(0, renderData.colorIntensity, 0),
            strokeWidth: renderData.strokeWidth
        });

        slime.add(left);
        slime.add(topSegment);
        slime.add(right);
        slime.closePath();
        scope.view.update();

        return { canvas, slime, topSegment, scope };
    }

    _animateIdle() {
        // Animation now based on HP only
        const bounce = Math.sin(this.t / this.renderData.animSpeed) * this.renderData.bounceAmp;
        this.topSegment.point.y = this.renderData.height / 2 + bounce;
    }

    _animateDying() {
        const targetY = this.renderData.height;
        if (this.topSegment.point.y < targetY) {
            this.topSegment.point.y += 2;
            this.topSegment.handleIn.y *= 0.8;
            this.topSegment.handleOut.y *= 0.8;
            return false;
        }
        return true;
    }
}