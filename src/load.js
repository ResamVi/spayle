module.exports = (function(){
    
    var ready = false;

    function preload() {
        
        var loadbar = game.add.sprite(200, 200, 'loadbar');
        loadbar.anchor.setTo(0.5,0.5);
        game.load.setPreloadSprite(loadbar, 0);
        
        game.load.image('background', 'res/background.png');
        game.load.image('player', 'res/player.png');
        game.load.start();

        game.load.onLoadComplete.addOnce(complete, this);
    }

    function update() {
        if (ready) {
          game.state.start('play');
        }
    }

    function complete() {
        ready = true;
    }
    
    return { preload: preload, update: update};
})();