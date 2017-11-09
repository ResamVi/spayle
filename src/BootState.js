/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';

/**
 * Initialize physics and world settings to start playing
 *
 * @this MainGame Has game property to the recently initialized game
 */

 // TODO: Change to object
export default
{
    create: function ()
    {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, Const.MAP_SIZE, Const.MAP_SIZE);

        this.game.state.start('load');
    }
};
