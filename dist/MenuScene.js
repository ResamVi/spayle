"use strict";
// TODO: Code like thisExample: https://github.com/photonstorm/phaser-ce/blob/master/src/sound/Sound.js
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Player_1 = require("./Player");
function default_1(game) {
    var player;
    var planet;
    var title;
    var startButton;
    var optionButton;
    var backButton;
    var instructions;
    var menuMusic;
    var startMusic;
    var centerX;
    var centerY;
    function create() {
        // Center of screen (not the world!)
        centerX = game.camera.width / 2;
        centerY = game.camera.height / 2;
        // Background
        game.add.sprite(0, 0, 'background');
        // Moon
        planet = game.add.sprite(Constants_1.default.PLAYER_START_X, Constants_1.default.PLAYER_START_Y, 'moon');
        planet.anchor.setTo(0.5, 0.5);
        planet.scale.setTo(0.1, 0.1);
        planet.pivot.set(Constants_1.default.ORBIT_RADIUS, Constants_1.default.ORBIT_RADIUS);
        // Player (only used for displayal; not to actually control)
        player = new Player_1.default(game);
        // Title
        title = game.add.bitmapText(0, 0, 'menuFont', 'SPAYLE', 80);
        title.updateTransform();
        title.anchor.setTo(0.5, 0.5);
        title.position.x = centerX + Constants_1.default.TITLE_X_OFFSET;
        title.position.y = centerY - Constants_1.default.TITLE_Y_OFFSET;
        game.add.tween(title.scale).to({ x: 1.1, y: 1.1 }, 2000, Phaser.Easing.Cubic.InOut, true, 10, -1, true);
        // Buttons
        startButton = createButton(-50, 1.5, play, 'buttonAtlas', 'yellow_button01.png', 'yellow_button02.png', 'yellow_button01.png');
        optionButton = createButton(50, 1.5, moveDown, 'buttonAtlas', 'grey_button02.png', 'grey_button01.png', 'grey_button02.png');
        backButton = createButton(850, 1.5, moveUp, 'buttonAtlas', 'grey_button02.png', 'grey_button01.png', 'grey_button02.png');
        // Instructions
        instructions = game.add.sprite(30, 870, 'instructions');
        // Music
        menuMusic = game.add.audio('menuMusic');
        menuMusic.onDecoded.add(function () {
            menuMusic.fadeIn(Constants_1.default.AUDIO_FADE_DURATION, true);
        });
    }
    function createButton(y, scale, func, atlas, onHover, onIdle, onClick) {
        var button = game.add.button(0, 0, atlas, func, game, onHover, onIdle, onClick, onIdle);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(scale, scale);
        button.x = centerX + Constants_1.default.BUTTON_X;
        button.y = centerY + y;
        return button;
    }
    function play() {
        // Scale camera out for dramatic effect
        game.add.tween(game.camera.scale).to({ x: 0.5, y: 0.5 }, 7000, Phaser.Easing.Cubic.InOut, true);
        // Fade out all menu items
        for (var _i = 0, _a = [title, startButton, optionButton, backButton, instructions]; _i < _a.length; _i++) {
            var sprite = _a[_i];
            var t = game.add.tween(sprite).to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.InOut, true, 0);
            t.onComplete.add(function (invisibleSprite) {
                invisibleSprite.destroy();
            });
        }
        // Change music and start count down
        menuMusic.fadeOut(1000);
        startMusic = game.add.audio('startMusic');
        startMusic.onDecoded.add(function () {
            startMusic.fadeIn(Constants_1.default.AUDIO_FADE_DURATION);
        });
        var countdown = game.add.audio('ignition');
        countdown.onDecoded.add(function () {
            countdown.play();
        });
        countdown.onStop.add(function () {
            player.destroy();
            game.state.start('play', false, false);
        });
    }
    function moveUp() {
        game.add.tween(game.camera).to({ y: 0 }, 1500, Phaser.Easing.Cubic.Out, true);
    }
    function moveDown() {
        game.add.tween(game.camera).to({ y: 700 }, 1500, Phaser.Easing.Cubic.Out, true);
    }
    function update() {
        planet.rotation += Constants_1.default.ORBIT_SPEED;
    }
    return { create: create, update: update };
}
exports.default = default_1;
;
