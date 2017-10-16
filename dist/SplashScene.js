"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Code like thisExample: https://github.com/photonstorm/phaser-ce/blob/master/src/sound/Sound.js
function default_1(game) {
    var FADE_IN_DURATION = 1000;
    var FADE_OUT_DURATION = 1000;
    var DELAY_DURATION = 1200;
    function preload() {
        game.load.image('melon', 'assets/splash.png'); // TODO: Rename to splash
    }
    function create() {
        game.stage.backgroundColor = '#FFFFFF';
        var melon = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
        melon.anchor.setTo(0.5);
        melon.alpha = 0;
        var tween = game.add.tween(melon);
        tween.to({ alpha: 1 }, FADE_IN_DURATION, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(fadeOut);
    }
    function fadeOut(melon) {
        var tween = game.add.tween(melon);
        tween.to({ alpha: 0 }, FADE_OUT_DURATION, Phaser.Easing.Linear.None, true, DELAY_DURATION);
        tween.onComplete.add(function () {
            game.stage.backgroundColor = '#000000';
            game.state.start('boot');
        });
    }
    return { preload: preload, create: create };
}
exports.default = default_1;
;
