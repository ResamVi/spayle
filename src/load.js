module.exports = (function(){
    
    var ready = false;

    function preload() {
        
        var bmpText = this.add.bitmapText(10, 10, "font", "Loading");
        bmpText.updateTransform();
        var centerX = this.game.width / 2 - (bmpText.textWidth * 0.5);
        var centerY = this.game.height / 2 - (bmpText.textHeight * 0.5);
        bmpText.position.x = centerX;
        bmpText.position.y = centerY - 90;

        var loadbar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loadbar');
        loadbar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadbar, 0);
        
        this.load.image('background', 'res/background.png');
        this.load.image('player', 'res/player.png');
        this.load.start();

        this.load.onLoadComplete.addOnce(complete, this);
    }

    function update() {
        if (ready) {
          this.state.start('play');
        }
    }

    function complete() {
        ready = true;
    }
    
    return { preload: preload, update: update};
})();