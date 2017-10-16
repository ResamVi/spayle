// TODO: Code like thisExample: https://github.com/photonstorm/phaser-ce/blob/master/src/sound/Sound.js
import Const from './Constants';

export default function(game: Phaser.Game)
{
    return {
        create: function() {

            // World settings
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.world.setBounds(0, 0, Const.WORLD_BOUNDS, Const.WORLD_BOUNDS); // TODO: CHange name to MAP_SIZE

            game.state.start('load');
        }
    };
}