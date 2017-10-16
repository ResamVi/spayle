"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Player_1 = require("./Player");
var MotherEnemy_1 = require("./MotherEnemy");
var HUD_1 = require("./HUD");
function default_1(game) {
    var arrowkeys;
    var player;
    var enemy;
    var hud;
    /* var line; */
    var mainMusic;
    function create() {
        player = new Player_1.default(game);
        enemy = new MotherEnemy_1.default(game);
        hud = new HUD_1.default(game, player, enemy);
        var global = { enemies: enemy };
        Object.defineProperty(game, 'global', { value: global });
        /* line = game.add.sprite(game.camera.width/2, game.game.height/2, 'line');
        hud.add(line); */
        // Music
        mainMusic = game.add.audio('mainMusic');
        mainMusic.onDecoded.add(function () {
            mainMusic.play('', 0, 1, true);
        }, game);
        // Controls
        arrowkeys = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(player.loseControl, game, 0, Constants_1.default.STUN_DURATION);
        game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(player.superThrust, game);
        game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(player.snipe, game);
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(player.thrust, game);
        game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function () {
            game.add.tween(game.camera.scale).to({ x: 1, y: 1 }, 7000, Phaser.Easing.Cubic.InOut, true);
        }, game);
        game.camera.follow(player.sprite, undefined, 0.5, 0.5);
        // Launch rocket away to start game
        player.body.thrust(Constants_1.default.LAUNCH_FORCE);
    }
    function update() {
        player.update();
        if (!player.isSpinning() && arrowkeys.left.isDown)
            player.body.rotateLeft(Constants_1.default.ROTATION_SPEED);
        else if (!player.isSpinning() && arrowkeys.right.isDown)
            player.body.rotateRight(Constants_1.default.ROTATION_SPEED);
        else if (!player.isSpinning())
            player.body.setZeroRotation();
        enemy.update(player);
        hud.update();
        // ---------------------------------- DEBUG ----------------------------------
        /* line.rotation = Phaser.Math.angleBetween(player.sprite.x, player.sprite.y, enemy.sprite.x, enemy.sprite.y); */
        game.world.bringToTop(enemy.sprite); // TODO: Debug only
        if (Constants_1.default.DEBUG_MODE) {
            if (arrowkeys.up.isDown) {
                game.camera.y -= Constants_1.default.CAM_SPEED;
            }
            else if (arrowkeys.down.isDown) {
                game.camera.y += Constants_1.default.CAM_SPEED;
            }
            if (arrowkeys.left.isDown) {
                game.camera.x -= Constants_1.default.CAM_SPEED;
            }
            else if (arrowkeys.right.isDown) {
                game.camera.x += Constants_1.default.CAM_SPEED;
            }
        }
    }
    function render() {
        if (Constants_1.default.DEBUG_MODE) {
            /* game.game.camera.scale.setTo(0.5); */
            /* game.game.camera.unfollow(); */
            var x = player.body.velocity.x;
            var y = player.body.velocity.y;
            var v = Math.round(Math.sqrt(x * x + y * y));
            enemy.debug();
            game.debug.text('Play coordinates: ' + Math.round(player.sprite.x) + ', ' + Math.round(player.sprite.y), 32, 510);
            game.debug.text('Camera coordinates: ' + game.camera.x + ', ' + game.camera.x, 32, 530);
            game.debug.text('Player velocity: ' + v, 32, 550);
        }
    }
    return { create: create, update: update, render: render };
}
exports.default = default_1;
;
