"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Code like thisExample: https://github.com/photonstorm/phaser-ce/blob/master/src/sound/Sound.js
var Constants_1 = require("./Constants");
function default_1(game) {
    return {
        create: function () {
            // World settings
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.world.setBounds(0, 0, Constants_1.default.WORLD_BOUNDS, Constants_1.default.WORLD_BOUNDS); // TODO: CHange name to MAP_SIZE
            game.state.start('load');
        }
    };
}
exports.default = default_1;
