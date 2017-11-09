/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';

/**
 * The LoadState displays a loading bar foremost and then loads all textures/assets/sounds.
 * @typedef {Phaser.Scene}
 */
export default
{
    progressText: Phaser.BitmapText,

    preload: function()
    {
        this.game.load.bitmapFont('font', 'assets/font_0.png', 'assets/font.fnt');
        this.game.load.image('preloadbar', 'assets/loadbar.png');
    },

    create: function()
    {
        // Declare loading process
        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        // Display and center load text
        let loadText = this.game.add.bitmapText(0, 0, 'font', 'Loading');
        loadText.updateTransform();
        let centerX = this.game.width / 2 - (loadText.textWidth * 0.5);
        let centerY = this.game.height / 2 - (loadText.textHeight * 0.5);
        loadText.x = centerX;
        loadText.y = centerY - 90;

        // Display and center current progress text
        this.progressText = this.game.add.bitmapText(0, 0, 'font', '0%');
        this.progressText.updateTransform();
        centerX = this.game.width / 2 - (this.progressText.textWidth * 0.5);
        centerY = this.game.height / 2 - (this.progressText.textHeight * 0.5);
        this.progressText.x = centerX;
        this.progressText.y = centerY;

        // Loadbar
        let preloadBar = this.game.add.sprite(10, 30, 'preloadbar');
        preloadBar.updateTransform();
        centerX = this.game.width / 2;
        centerY = this.game.height / 2;
        preloadBar.x = centerX - Const.LOADBAR_WIDTH / 2;
        preloadBar.y = centerY + Const.LOADBAR_OFFSET;
        this.game.load.setPreloadSprite(preloadBar);

        this.queueFiles();
    },

    queueFiles: function()
    {
        //console.log('Queue files');
        this.game.load.audio('startMusic', 'assets/start.mp3');
        this.game.load.audio('menuMusic', 'assets/menu.mp3');
        this.game.load.audio('mainMusic', 'assets/main.mp3');
        this.game.load.audio('startMusic', 'assets/start.mp3');
        this.game.load.audio('ignition', 'assets/ignition.mp3');
        this.game.load.audio('boom', 'assets/boom.mp3');
        this.game.load.audio('roger', 'assets/rogerbeep.mp3');

        this.game.load.image('instructions', 'assets/instructions.png');
        this.game.load.image('dot', 'assets/dot.png'); // debug purposes only
        this.game.load.image('empty', 'assets/empty.png');
        this.game.load.image('bullet', 'assets/bullet.png');
        this.game.load.image('background', 'assets/background.png');
        this.game.load.image('redPlanet', 'assets/red_planet.png');
        this.game.load.image('moon', 'assets/moon.png');
        //this.game.load.image('player', 'assets/player.png');
        this.game.load.image('playerFire', 'assets/player_fire.png');
        this.game.load.image('enemy_boss', 'assets/enemy_boss.png');
        this.game.load.image('enemy_many', 'assets/enemy_many.png');
        this.game.load.image('enemy_bullet', 'assets/enemy_bullet.png');
        this.game.load.image('warning', 'assets/warning.png');
        this.game.load.image('line', 'assets/line.png');
        this.game.load.image('arrow', 'assets/arrow.png');

        this.game.load.bitmapFont('menuFont', 'assets/menu_0.png', 'assets/menu.fnt');

        this.game.load.atlasJSONHash('player', 'assets/player.png', 'assets/player.json');
        this.game.load.atlasJSONHash('explosionAtlas', 'assets/explosionAnimation.png', 'assets/explosionAnimation.json');
        this.game.load.atlasJSONHash('buttonAtlas', 'assets/buttons.png', 'assets/buttons.json');
        this.game.load.atlasJSONHash('lineAtlas', 'assets/dotted_line_animation.png', 'assets/dotted_line_animation.json');
        // TODO: Rename files
        // Everything above has been put into queue, now start loading
        this.game.load.start();
    },

    loadStart: function()
    {
        if (Const.DEBUG_MODE) {
            console.log('Start loading');
        }
    },

    fileComplete: function(progress: string, cacheKey: string, success: string, totalLoaded: string, totalFiles: string)
    {
        if (Const.DEBUG_MODE) {
            console.log('--- Completed file ---');
            console.log('progress: ' + progress);
            console.log('cacheKey: ' + cacheKey);
            console.log('success: ' + success);
            console.log('totalLoaded: ' + totalLoaded);
            console.log('totalFiles: ' + totalFiles);
            console.log('\n');
        }
        this.progressText.setText(progress + '%');
    },

    loadComplete: function()
    {
        if (Const.DEBUG_MODE) {
            console.log('Load complete');
        }
        this.game.state.start('menu');
    }
};
