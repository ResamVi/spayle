/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';
import Player from './Player';

/**
 * The menu is displayed after loading and before playing.
 * This is where options can be changed, credits viewed, name changed
 * and the this.game started.
 *
 * @typedef  {Phaser.State}
 */
export default
{
    player: null, // TODO: Describe properties
    planet: null,

    title: null,
    startButton: null,
    optionButton: null,
    backButton: null,
    instructions: null,

    menuMusic: null,
    startMusic: null,

    centerX: 0,
    centerY: 0,

    create: function()
    {
        // Center of screen (not the world!)
        this.centerX = this.game.camera.width / 2;
        this.centerY = this.game.camera.height / 2;

        // Background
        this.game.add.sprite(0, 0, 'background');

        // Moon
        this.planet = this.game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'moon');
        this.planet.anchor.setTo(0.5, 0.5);
        this.planet.scale.setTo(0.1, 0.1);
        this.planet.pivot.set(Const.ORBIT_RADIUS, Const.ORBIT_RADIUS);

        // Player (only used for displayal; not to actually control)
        this.player = new Player(this.game);

        // this.title
        this.title = this.game.add.bitmapText(0, 0, 'menuFont', 'SPAYLE', 80);
        this.title.updateTransform();
        this.title.anchor.setTo(0.5, 0.5);
        this.title.position.x = this.centerX + Const.TITLE_X_OFFSET;
        this.title.position.y = this.centerY - Const.TITLE_Y_OFFSET;
        this.game.add.tween(this.title.scale).to({x: 1.1, y: 1.1}, 2000, Phaser.Easing.Cubic.InOut, true, 10, -1, true);

        // Buttons
        this.startButton = this.createButton(-50, 1.5, this.play, 'buttonAtlas',
                                                   'yellow_button01.png',
                                                   'yellow_button02.png',
                                                   'yellow_button01.png');

        this.optionButton = this.createButton(50, 1.5, this.moveDown, 'buttonAtlas',
                                                       'grey_button02.png',
                                                       'grey_button01.png',
                                                       'grey_button02.png');

        this.backButton = this.createButton(850, 1.5, this.moveUp, 'buttonAtlas',
                                                    'grey_button02.png',
                                                    'grey_button01.png',
                                                    'grey_button02.png');

        // Instructions
        this.instructions = this.game.add.sprite(30, 870, 'instructions');

        // Music
        this.menuMusic = this.game.add.audio('menuMusic');
        this.menuMusic.onDecoded.add(function () {
            this.menuMusic.fadeIn(Const.AUDIO_FADE_DURATION, true);
        }, this);
    },

    createButton: function(y, scale, func, atlas, onHover, onIdle, onClick)
    {
        let button = this.game.add.button(0, 0, atlas, func, this, onHover, onIdle, onClick, onIdle);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(scale, scale);
        button.x = this.centerX + Const.BUTTON_X;
        button.y = this.centerY + y;
        return button;
    },

    play: function()
    {
        // Scale camera out for dramatic effect
        this.game.add.tween(this.game.camera.scale).to({x: 0.5, y: 0.5}, 7000, Phaser.Easing.Cubic.InOut, true);

        // Fade out all menu items
        for (let sprite of [this.title, this.startButton, this.optionButton, this.backButton, this.instructions])
        {
            let t = this.game.add.tween(sprite).to({alpha: 0}, 1000, Phaser.Easing.Cubic.InOut, true, 0);
            t.onComplete.add(function (invisibleSprite: Phaser.Sprite) {
                invisibleSprite.destroy();
            });
        }

        // Change music and start count down
        this.menuMusic.fadeOut(1000);

        // TODO: Can this be made local?
        this.startMusic = this.game.add.audio('this.startMusic');
        this.startMusic.onDecoded.add(function ()
        {
            this.startMusic.fadeIn(Const.AUDIO_FADE_DURATION);
        }, this);

        let countdown = this.game.add.audio('ignition');
        countdown.onDecoded.add(function ()
        {
            countdown.play();
        });
        countdown.onStop.add(function ()
        {
            this.player.destroy();
            this.game.state.start('play', false, false);
        }, this);

    },

    moveUp: function()
    {
        this.game.add.tween(this.game.camera).to({y: 0}, 1500, Phaser.Easing.Cubic.Out, true);
    },

    moveDown: function()
    {
        this.game.add.tween(this.game.camera).to({y: 700}, 1500, Phaser.Easing.Cubic.Out, true);
    },

    update: function()
    {
        this.planet.rotation += Const.ORBIT_SPEED;
    }
};
