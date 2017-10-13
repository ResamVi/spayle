module.exports = (function(){
    
    var progressText;
    var Const = require('./Constants.js');

    function preload() {
        this.load.bitmapFont('font','assets/font_0.png', 'assets/font.fnt');
        this.load.image('preloadbar', 'assets/loadbar.png');
    }

    function create() {
        
        // Declare loading process
        this.load.onLoadStart.add(loadStart, this);
        this.load.onFileComplete.add(fileComplete, this);
        this.load.onLoadComplete.add(loadComplete, this);

        // Display and center load text
        var loadText = this.add.bitmapText(0, 0, 'font', 'Loading');
        loadText.updateTransform();
        var centerX = this.game.width / 2 - (loadText.textWidth * 0.5);
        var centerY = this.game.height / 2 - (loadText.textHeight * 0.5);
        loadText.x = centerX;
        loadText.y = centerY - 90;
        
        // Display and center current progress text
        progressText = this.add.bitmapText(0, 0, 'font', '0%');
        progressText.updateTransform();
        centerX = this.game.width / 2 - (progressText.textWidth * 0.5);
        centerY = this.game.height / 2 - (progressText.textHeight * 0.5);
        progressText.x = centerX;
        progressText.y = centerY;

        // Loadbar
        var preloadBar = this.add.sprite(10, 30, 'preloadbar');
        preloadBar.updateTransform();
        centerX = this.game.width / 2;
        centerY = this.game.height / 2;
        preloadBar.x = centerX - Const.LOADBAR_WIDTH / 2;
        preloadBar.y = centerY + Const.LOADBAR_OFFSET;
        this.load.setPreloadSprite(preloadBar);

        queueFiles.call(this);
    }

    function queueFiles() {
        //console.log('Queue files');
        this.load.audio('startMusic', 'assets/start.mp3');
        this.load.audio('menuMusic', 'assets/menu.mp3');
        this.load.audio('mainMusic', 'assets/main.mp3');
        this.load.audio('startMusic', 'assets/start.mp3');
        this.load.audio('ignition', 'assets/ignition.mp3');
        this.load.audio('boom', 'assets/boom.mp3');
        this.load.audio('roger', 'assets/rogerbeep.mp3');

        this.load.image('instructions', 'assets/instructions.png');
        this.load.image('dot', 'assets/dot.png'); // debug purposes only
        this.load.image('empty', 'assets/empty.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('redPlanet', 'assets/red_planet.png');
        this.load.image('moon', 'assets/moon.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('playerFire', 'assets/player_fire.png');
        this.load.image('enemy_boss', 'assets/enemy_boss.png');
        this.load.image('enemy_many', 'assets/enemy_many.png');
        this.load.image('enemy_bullet', 'assets/enemy_bullet.png');
        this.load.image('warning', 'assets/warning.png');
        this.load.image('line', 'assets/line.png');
        this.load.image('arrow', 'assets/arrow.png');
        
        this.load.bitmapFont('menuFont','assets/menu_0.png', 'assets/menu.fnt');
        
        this.load.atlasJSONHash('explosionAtlas', 'assets/explosionAnimation.png', 'assets/explosionAnimation.json');
        this.load.atlasJSONHash('buttonAtlas', 'assets/buttons.png', 'assets/buttons.json');
        this.load.atlasJSONHash('lineAtlas', 'assets/dotted_line_animation.png', 'assets/dotted_line_animation.json');

        // Everything above has been put into queue, now start loading
        this.load.start();
    }

    function loadStart() {
        if(Const.DEBUG_MODE) {
            console.log('Start loading');
        }
    }

    function fileComplete(progress , cacheKey, success, totalLoaded, totalFiles) {
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

    function loadComplete() {
        if(Const.DEBUG_MODE) {
            console.log('Load complete');
        }
        this.state.start('menu');
    }
    
    return { preload: preload, create: create};
})();