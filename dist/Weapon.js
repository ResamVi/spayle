"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
function default_1(trackedSprite, game) {
    this.fire = function () {
        var position = calculateCoordinates(-20);
        var bullet = game.add.sprite(position.x, position.y, 'bullet');
        bullet.anchor.setTo(0.5);
        bullet.angle = trackedSprite.angle + 180;
        game.physics.arcade.enable(bullet);
        var velocity = calculateVelocity(Constants_1.default.BULLET_SPEED);
        bullet.body.velocity.x = velocity.x;
        bullet.body.velocity.y = velocity.y;
    };
    var calculateVelocity = function (speed) {
        var x = Math.cos(trackedSprite.rotation + Math.PI / 2) * speed;
        var y = Math.sin(trackedSprite.rotation + Math.PI / 2) * speed;
        return {
            x: x,
            y: y
        };
    };
    var calculateCoordinates = function (radius) {
        var xAngle = Math.cos(trackedSprite.rotation - Phaser.Math.HALF_PI);
        var yAngle = Math.sin(trackedSprite.rotation - Phaser.Math.HALF_PI);
        return {
            x: trackedSprite.x + xAngle * radius,
            y: trackedSprite.y + yAngle * radius
        };
    };
}
exports.default = default_1;
;
