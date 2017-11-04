/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';

/**
 * Initialize physics and world settings to start playing
 *
 * @method
 * @param  {Phaser.Game} game - Reference to the game
 * @return {Phaser.State} The scene that handles booting
 */

 // TODO: Change to object
function Boot(game: Phaser.Game)
{
    return {
        create: function ()
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.world.setBounds(0, 0, Const.MAP_SIZE, Const.MAP_SIZE);

            game.state.start('load');
        }
    };
}

export default Boot;
