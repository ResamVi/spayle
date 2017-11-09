/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

 /**
  * The SplashState fades in the melon logo along with the creator's name.
  * @typedef {Phaser.Scene}
  */
export default {
    FADE_IN_DURATION: 1000,
    FADE_OUT_DURATION: 1000,
    DELAY_DURATION: 1200,

    preload: function()
    {
        this.game.load.image('melon', 'assets/splash.png'); // TODO: Rename to splash
    },

    create: function()
    {
        this.game.stage.backgroundColor = '#FFFFFF';

        let melon = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'melon');
        melon.anchor.setTo(0.5);
        melon.alpha = 0;

        let tween = this.game.add.tween(melon);
        tween.to({alpha: 1}, this.FADE_IN_DURATION, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.fadeOut, this);
    },

    fadeOut: function(melon: Phaser.Sprite)
    {
        let tween = this.game.add.tween(melon);
        tween.to({alpha: 0}, this.FADE_OUT_DURATION, Phaser.Easing.Linear.None, true, this.DELAY_DURATION);
        tween.onComplete.add(function ()
        {
            this.game.stage.backgroundColor = '#000000';
            this.game.state.start('boot');
        }, this);
    }
};
