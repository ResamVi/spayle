"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
function default_1(game, player, enemy) {
    // HUD
    var hud = game.add.group();
    hud.fixedToCamera = true;
    // Warning icon
    var warning = game.add.sprite(300, 600 - 36, 'warning');
    warning.anchor.setTo(0.5);
    hud.add(warning);
    // Arrow point to enemy
    var arrow = game.add.sprite(game.camera.width / 2, game.height / 2, 'arrow');
    arrow.anchor.setTo(0.5);
    hud.add(arrow);
    // Crew comments
    var comments = game.add.bitmapText(game.camera.width / 2, 20, 'font', '', 20);
    comments.anchor.setTo(0.5);
    hud.add(comments);
    // Start off with a comment
    game.time.events.add(100, function () {
        var beep = game.add.audio('roger');
        beep.volume = 0.5;
        beep.play();
        // Text appear
        comments.text = Constants_1.default.LIFT_OFF[Math.floor(Math.random() * Constants_1.default.LIFT_OFF.length)];
        // Text disappear
        game.time.events.add(Constants_1.default.COMMENT_TIME_SHOWN, function () {
            comments.text = '';
        });
    });
    this.update = function update() {
        focusPointer(getNearestEnemy());
    };
    function giveComment() {
        // game.time.events.add(Math.random() * 5000, function() {
        //
        //     // Text appear
        //     comments.text = Const.IDLE[Math.floor(Math.random() * Const.IDLE.length)];
        //
        //     // Text disappear
        //     game.time.events.add(Const.COMMENT_TIME_SHOWN, function() {
        //         comments.text = '';
        //     });
        // }, this);
    }
    function getNearestEnemy() {
        var shortestDistance = Number.POSITIVE_INFINITY;
        var closestEnemy;
        enemy.group.forEach(function (child) {
            var d = Phaser.Math.distance(player.sprite.x, player.sprite.y, child.x, child.y);
            if (d < shortestDistance) {
                shortestDistance = d;
                closestEnemy = child;
            }
        });
        if (shortestDistance < Constants_1.default.WARNING_RADIUS)
            return closestEnemy;
    }
    function focusPointer(enemy) {
        if (enemy === undefined) {
            warning.alpha = 0;
            arrow.alpha = 0;
            return;
        }
        else {
            warning.alpha = 1;
            arrow.alpha = 1;
        }
        // Angle
        arrow.rotation = Phaser.Math.angleBetween(player.sprite.x, player.sprite.y, enemy.x, enemy.y);
        // Y Coord
        var ySlope = (enemy.y - player.sprite.y) / Math.abs(enemy.x - player.sprite.x);
        var yCoord = ySlope * Constants_1.default.GAME_WIDTH / 2 + Constants_1.default.CENTER_CAMERA_X;
        if (yCoord < 7)
            arrow.y = 7;
        else if (yCoord > Constants_1.default.GAME_HEIGHT)
            arrow.y = Constants_1.default.GAME_HEIGHT - 7;
        else
            arrow.y = yCoord;
        // X Coord
        var xSlope = Math.abs(enemy.y - player.sprite.y) / (enemy.x - player.sprite.x);
        var xCoord = (Constants_1.default.GAME_HEIGHT * 0.5) / xSlope + Constants_1.default.CENTER_CAMERA_Y;
        if (xCoord > Constants_1.default.GAME_WIDTH)
            arrow.x = Constants_1.default.GAME_WIDTH - 7;
        else if (xCoord < 7)
            arrow.x = 7;
        else
            arrow.x = xCoord;
    }
}
exports.default = default_1;
;
