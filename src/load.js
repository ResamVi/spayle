module.exports = (function(){
    
    var ready = false;

    function preload() {
        
        var bmpText = this.add.bitmapText(10, 10, "font", "Loading");

        var loadbar = this.add.sprite(200, 200, 'loadbar');
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