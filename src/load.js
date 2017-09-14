module.exports = (function(){
    
    var progressText;

    function preload() {
        this.load.bitmapFont('font','res/font_0.png', 'res/font.fnt');
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
        this.load.image('dot', 'res/dot.png'); // debug purposes only
        this.load.image('empty', 'res/empty.png');
        this.load.image('background', 'res/background.png');
        this.load.image('player', 'res/player.png');
        this.load.atlasJSONHash('explosionAtlas', 'res/explosionAnimation.png', 'res/explosionAnimation.json');

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
        //console.log('Load complete');
        this.state.start('play');
    }
    
    return { preload: preload, create: create};
})();