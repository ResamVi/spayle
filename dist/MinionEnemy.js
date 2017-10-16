"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
function default_1(game, mother) {
    // This object keeps track and exposes the sprite
    var xOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    var yOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    var sprite = game.add.sprite(mother.x + xOffset, mother.y + yOffset, 'enemy_many');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;
    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;
    // Possible states: 'READY', 'ATTACKING', 'RETURNING', 'FOLLOWING'
    var state = 'READY';
    this.update = function (player, motherAngle) {
        // Decisions
        if (state === 'READY' && playerInRange(player.sprite)) {
            state = 'ATTACKING';
            attack(player);
        }
        else if (state === 'READY' && !closeToMother()) {
            state = 'RETURNING';
            returnBack();
        }
        else if (state === 'READY') {
            state = 'FOLLOWING';
            follow(motherAngle);
        }
        // When coming to a close stop make a new decision
        if (velocity() < 10) {
            state = 'READY';
        }
    };
    var returnBack = function () {
        var angleToMother = Phaser.Math.angleBetween(sprite.x, sprite.y, mother.x, mother.y);
        sprite.body.rotation = angleToMother + Phaser.Math.HALF_PI;
        sprite.body.thrust(Constants_1.default.ENEMY_THRUST_FORCE);
    };
    var attack = function (player) {
        var playerEnemyAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, player.sprite.x, player.sprite.y);
        var offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI / 2; // in [-pi/4, pi/4]
        sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        sprite.body.thrust(Constants_1.default.ENEMY_THRUST_FORCE);
    };
    var follow = function (motherAngle) {
        var angle;
        // Stay inside bounds bounds
        if (sprite.y < Constants_1.default.INFLUENCE_RADIUS / 2) {
            angle = Math.PI;
        }
        else if (sprite.y > Constants_1.default.WORLD_BOUNDS - Constants_1.default.INFLUENCE_RADIUS / 2) {
            angle = 0;
        }
        else if (sprite.x < Constants_1.default.INFLUENCE_RADIUS / 2) {
            angle = Phaser.Math.HALF_PI;
        }
        else if (sprite.x > Constants_1.default.WORLD_BOUNDS - Constants_1.default.INFLUENCE_RADIUS / 2) {
            angle = Math.PI + Phaser.Math.HALF_PI;
            // Random
        }
        else {
            angle = motherAngle + Math.PI / 6 * (Math.random() * 2 - 1);
        }
        sprite.body.rotation = angle;
        sprite.body.thrust(Constants_1.default.ENEMY_THRUST_FORCE);
    };
    var velocity = function () {
        var x = sprite.body.velocity.x;
        var y = sprite.body.velocity.y;
        return Math.round(Math.sqrt(x * x + y * y));
    };
    var playerInRange = function (player) {
        return Phaser.Math.distance(sprite.x, sprite.y, player.x, player.y) < Constants_1.default.SIGHT_RANGE;
    };
    var closeToMother = function () {
        return Phaser.Math.distance(sprite.x, sprite.y, mother.x, mother.y) < Constants_1.default.INFLUENCE_RADIUS / 2;
    };
    // ----------------- DEBUG -----------------
    var debugState;
    if (Constants_1.default.DEBUG_MODE) {
        debugState = game.add.bitmapText(0, -80, 'menuFont', '', 30);
        debugState.anchor.set(0.5);
        sprite.addChild(debugState);
    }
    this.debug = function () {
        if (Constants_1.default.DEBUG_MODE) {
            debugState.text = state;
        }
    };
}
exports.default = default_1;
;
