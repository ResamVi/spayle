import Const from './Constants';

// TODO: Code like thisExample: https://github.com/photonstorm/phaser-ce/blob/master/src/sound/Sound.js
export default function(game : Phaser.Game)
{
    var progressText : Phaser.BitmapText;

    function preload()
    {
        game.load.bitmapFont('font','assets/font_0.png', 'assets/font.fnt');
        game.load.image('preloadbar', 'assets/loadbar.png');
    }

    function create()
    {
        // Declare loading process
        game.load.onLoadStart.add(loadStart);
        game.load.onFileComplete.add(fileComplete);
        game.load.onLoadComplete.add(loadComplete);

        // Display and center load text
        var loadText = game.add.bitmapText(0, 0, 'font', 'Loading');
        loadText.updateTransform();
        var centerX = game.width / 2 - (loadText.textWidth * 0.5);
        var centerY = game.height / 2 - (loadText.textHeight * 0.5);
        loadText.x = centerX;
        loadText.y = centerY - 90;
        
        // Display and center current progress text
        progressText = game.add.bitmapText(0, 0, 'font', '0%');
        progressText.updateTransform();
        centerX = game.width / 2 - (progressText.textWidth * 0.5);
        centerY = game.height / 2 - (progressText.textHeight * 0.5);
        progressText.x = centerX;
        progressText.y = centerY;

        // Loadbar
        var preloadBar = game.add.sprite(10, 30, 'preloadbar');
        preloadBar.updateTransform();
        centerX = game.width / 2;
        centerY = game.height / 2;
        preloadBar.x = centerX - Const.LOADBAR_WIDTH / 2;
        preloadBar.y = centerY + Const.LOADBAR_OFFSET;
        game.load.setPreloadSprite(preloadBar);

        queueFiles();
    }

    function queueFiles()
    {
        //console.log('Queue files');
        game.load.audio('startMusic', 'assets/start.mp3');
        game.load.audio('menuMusic', 'assets/menu.mp3');
        game.load.audio('mainMusic', 'assets/main.mp3');
        game.load.audio('startMusic', 'assets/start.mp3');
        game.load.audio('ignition', 'assets/ignition.mp3');
        game.load.audio('boom', 'assets/boom.mp3');
        game.load.audio('roger', 'assets/rogerbeep.mp3');

        game.load.image('instructions', 'assets/instructions.png');
        game.load.image('dot', 'assets/dot.png'); // debug purposes only
        game.load.image('empty', 'assets/empty.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('background', 'assets/background.png');
        game.load.image('redPlanet', 'assets/red_planet.png');
        game.load.image('moon', 'assets/moon.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('playerFire', 'assets/player_fire.png');
        game.load.image('enemy_boss', 'assets/enemy_boss.png');
        game.load.image('enemy_many', 'assets/enemy_many.png');
        game.load.image('enemy_bullet', 'assets/enemy_bullet.png');
        game.load.image('warning', 'assets/warning.png');
        game.load.image('line', 'assets/line.png');
        game.load.image('arrow', 'assets/arrow.png');

        game.load.bitmapFont('menuFont','assets/menu_0.png', 'assets/menu.fnt');

        game.load.atlasJSONHash('explosionAtlas', 'assets/explosionAnimation.png', 'assets/explosionAnimation.json');
        game.load.atlasJSONHash('buttonAtlas', 'assets/buttons.png', 'assets/buttons.json');
        game.load.atlasJSONHash('lineAtlas', 'assets/dotted_line_animation.png', 'assets/dotted_line_animation.json');

        // Everything above has been put into queue, now start loading
        game.load.start();
    }

    function loadStart()
    {
        if(Const.DEBUG_MODE) {
            console.log('Start loading');
        }
    }

    function fileComplete(progress : string, cacheKey : string, success : string, totalLoaded : string, totalFiles: string)
    {
        if(Const.DEBUG_MODE) {
            console.log('--- Completed file ---');
            console.log('progress: ' + progress);
            console.log('cacheKey: ' + cacheKey);
            console.log('success: ' + success);
            console.log('totalLoaded: ' + totalLoaded);
            console.log('totalFiles: ' + totalFiles);
            console.log('\n');
        }
        progressText.setText(progress + '%');
    }

    function loadComplete()
    {
        if(Const.DEBUG_MODE) {
            console.log('Load complete');
        }
        game.state.start('menu');
    }
    
    return { preload: preload, create: create};
};