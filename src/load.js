module.exports = (function(){
    
    function preload() {
        game.load.image('background', 'res/background.png');
        game.load.image('player', 'res/player.png');
    }
    
    return { preload: preload}
})();