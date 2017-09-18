module.exports = (function(){
    
    var progressText;

    function preload() {
        this.load.bitmapFont('font','assets/font_0.png', 'assets/font.fnt');
    }

    function create() {
        
        // Declare loading process
        this.load.onLoadStart.add(loadStart, this);
        this.load.onFileComplete.add(fileComplete, this);
        this.load.onLoadComplete.add(loadComplete, this);

        // Display and center load text
        var loadText = this.add.bitmapText(10, 10, 'font', 'Loading');
        loadText.updateTransform();
        var centerX = this.game.width / 2 - (loadText.textWidth * 0.5);
        var centerY = this.game.height / 2 - (loadText.textHeight * 0.5);
        loadText.position.x = centerX;
        loadText.position.y = centerY - 90;
        
        // Display and center current progress text
        progressText = this.add.bitmapText(10, 10, 'font', '0%');
        progressText.updateTransform();
        centerX = this.game.width / 2 - (progressText.textWidth * 0.5);
        centerY = this.game.height / 2 - (progressText.textHeight * 0.5);
        progressText.position.x = centerX;
        progressText.position.y = centerY;

        queueFiles.call(this);
    }

    function queueFiles() {
        //console.log('Queue files');
        this.load.audio('startMusic', 'assets/start.mp3');
        this.load.audio('menuMusic', 'assets/menu.mp3');
        this.load.audio('mainMusic', 'assets/main.mp3');
        this.load.audio('ignition', 'assets/ignition.mp3');
        this.load.audio('boom', 'assets/boom.mp3');
        this.load.audio('boom', 'assets/boom.mp3');
        this.load.image('dot', 'assets/dot.png'); // debug purposes only
        this.load.image('empty', 'assets/empty.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('redPlanet', 'assets/red_planet.png');
        this.load.image('moon', 'assets/moon.png');
        this.load.image('player', 'assets/player.png');
        this.load.bitmapFont('menuFont','assets/menu_0.png', 'assets/menu.fnt');
        this.load.atlasJSONHash('explosionAtlas', 'assets/explosionAnimation.png', 'assets/explosionAnimation.json');
        this.load.atlasJSONHash('buttonAtlas', 'assets/buttons.png', 'assets/buttons.json');

        // Everything above has been put into queue, now start loading
        this.load.start();
    }

    function loadStart() {
        //console.log('Start loading');
    }

    function fileComplete(progress /*, cacheKey, success, totalLoaded, totalFiles*/) {
        //console.log('--- Completed file ---');
        //console.log('progress: ' + progress);
        //console.log('cacheKey: ' + cacheKey);
        //console.log('success: ' + success);
        //console.log('totalLoaded: ' + totalLoaded);
        //console.log('totalFiles: ' + totalFiles);
        //console.log('\n');
        progressText.setText(progress + '%');
    }

    function loadComplete() {
        //console.log("Finished");
        //console.log('Load complete');
        this.state.start('menu');
    }
    
    return { preload: preload, create: create};
})();