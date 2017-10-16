"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Weapon_1 = require("./Weapon");
function default_1(game) {
    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(Constants_1.default.PLAYER_START_X, Constants_1.default.PLAYER_START_Y, 'player');
    sprite.anchor.setTo(0.5);
    sprite.angle = Constants_1.default.PLAYER_START_ANGLE;
    this.sprite = sprite;
    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    this.body = sprite.body;
    // Boom sound for thrusting
    var boomSound = game.add.audio('boom');
    boomSound.volume = 0.05;
    // Keep track of velocity which increases with thrustFrequency
    var thrustFrequency = 0;
    var velocityBonus = 0;
    var shotsMade = 0;
    // Possible states: 'ready', 'spinning', 'charging', 'aiming'
    var state = 'ready';
    // This value is tweened, therefore object notation needed
    var spin = { force: 0 };
    // Add aim sight animation to rocket
    var aimSight = game.add.sprite(-4, 40, 'lineAtlas');
    aimSight.alpha = Constants_1.default.INVISIBLE;
    aimSight.anchor.setTo(1);
    aimSight.scale.x *= -1;
    aimSight.scale.y *= -1;
    aimSight.animations.add('aim', Phaser.Animation.generateFrameNames('dotted_line', 0, 13, '.png', 4), 60, true, true).play();
    sprite.addChild(aimSight);
    // Responsible for bullet spawns their angle/velocity and kill properties
    var weapon = new Weapon_1.default(sprite, game);
    // ---- FUNCTIONS ----
    // Given the frequency, increase the the camera shake with higher frequency
    var trackFrequency = function () {
        // Increase
        if (thrustFrequency > Constants_1.default.SPEED_UP_FREQUENCY)
            velocityBonus++;
        else if (velocityBonus / 2 > 1)
            velocityBonus /= 2;
        else
            velocityBonus = 0;
        thrustFrequency = 0;
        // Go intro "instability mode" i.e. camera shakes due to high velocity
        if (velocityBonus > Constants_1.default.INSTABILITY_THRESHOLD)
            game.camera.shake(0.002 * velocityBonus, Constants_1.default.SHAKE_DURATION, false);
    };
    // Keep track of thrust frequency and adjust "instability mode" accordingly
    game.time.events.repeat(Constants_1.default.UPDATE_INTERVAL, Number.POSITIVE_INFINITY, trackFrequency, this);
    // TODO: Put into Engine
    // Do animation, camera and sound effects
    var fireEngine = function (explosionSize, distanceFromShip) {
        var position = calculateRearPosition(distanceFromShip);
        var explosion = game.add.sprite(position.x, position.y, 'explosionAtlas');
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(explosionSize, explosionSize);
        explosion.animations.add('explode', Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1), 60, false, true).play();
        // game.global.enemies.group.forEach(function(enemy) { // TODO: WTF?
        //     if(checkOverlap(enemy, explosion)) {
        //         console.log("HEUREKA");
        //     }
        // });
        boomSound.play();
        game.camera.shake(0.01, 100, false);
    };
    function checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return false;
        // return Phaser.Rectangle.intersects(boundsA, boundsB);
    }
    // Apply the physics
    this.thrust = function () {
        fireEngine(Constants_1.default.SMALL_EXPLOSION, Constants_1.default.SMALL_EXPLOSION_DISTANCE);
        if (state === 'ready' || state === 'spinning') {
            thrustFrequency++;
            sprite.body.setZeroVelocity();
            var acceleration = Constants_1.default.THRUST_FORCE + Constants_1.default.THRUST_FORCE * 0.1 * (Math.pow(velocityBonus, 2));
            sprite.body.thrust(acceleration);
        }
        else if (state === 'aiming') {
            shotsMade++;
            weapon.fire();
            sprite.body.thrust(Constants_1.default.RECOIL_FORCE);
            if (shotsMade < Constants_1.default.MAGAZINE_SIZE) {
                game.time.events.add(Constants_1.default.RECOVER_TIME, function () {
                    game.add.tween(sprite.body.velocity).to({ x: 0, y: 0 }, 100, Phaser.Easing.Cubic.Out, true); // TODO: Constant
                }, this);
            }
            else {
                sprite.body.thrust(Constants_1.default.RECOIL_FORCE * 2);
                aimSight.alpha = Constants_1.default.INVISIBLE;
                shotsMade = 0;
                state = 'ready';
            }
        }
    };
    // This has to be called in the game loop for each frame
    this.update = function () {
        if (state === 'ready')
            sprite.body.thrust(Constants_1.default.MINIMUM_SPEED);
        if (state === 'spinning')
            sprite.body.rotateLeft(spin.force);
    };
    var gainControl = function (duration) {
        var tween = game.add.tween(spin);
        tween.to({ force: 0 }, duration, Phaser.Easing.Quintic.Out, true);
        tween.onComplete.add(function () {
            state = 'ready';
        });
    };
    var loseControl = function (_, duration) {
        if (state === 'ready') {
            state = 'spinning';
            spin.force = Constants_1.default.SPIN_AMOUNT;
            game.time.events.add(duration, gainControl, undefined, duration);
        }
    };
    this.loseControl = loseControl;
    this.isSpinning = function () {
        return state === 'spinning';
    };
    // These coordinates are used for spawning explosion animations,
    // Given how the rocket ship is angled, calculate the coordinates
    var calculateRearPosition = function (radius) {
        var xAngle = Math.cos(sprite.rotation - Phaser.Math.HALF_PI);
        var yAngle = Math.sin(sprite.rotation - Phaser.Math.HALF_PI);
        return {
            x: sprite.x + xAngle * radius,
            y: sprite.y + yAngle * radius
        };
    };
    this.superThrust = function () {
        if (state === 'ready') {
            state = 'charging';
            // TODO: Particles
            // Come to a stop
            game.add.tween(sprite.body.velocity).to({ x: 0, y: 0 }, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant
            sprite.loadTexture('playerFire');
            // Same as thrust() but bigger
            var launch = function () {
                fireEngine(Constants_1.default.BIG_EXPLOSION, Constants_1.default.BIG_EXPLOSION_DISTANCE);
                sprite.body.setZeroVelocity();
                sprite.body.thrust(Constants_1.default.THRUST_FORCE * 5);
                sprite.loadTexture('player');
                state = 'ready';
                loseControl(null, Constants_1.default.SUPER_THRUST_STUN_DURATION);
            };
            // When fully braked launch away
            game.time.events.add(1000, launch, this);
        }
    };
    this.snipe = function () {
        if (state === 'ready') {
            state = 'aiming';
            // Come to a stop
            game.add.tween(sprite.body.velocity).to({ x: 0, y: 0 }, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant
            // Aim
            game.add.tween(aimSight).to({ alpha: Constants_1.default.VISIBLE }, 500, 'Linear', true);
            // Shooting is done via space button (and thus handled in this.thrust())
        }
    };
    this.destroy = function () {
        sprite.destroy();
        boomSound.destroy();
    };
}
exports.default = default_1;
;
