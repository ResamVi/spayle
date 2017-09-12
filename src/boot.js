module.exports = (function(){
    
    const WORLD_BOUNDS = 10000;

    function preload() {
        game.load.image('loadbar', 'res/loadbar.png');
    }

    function create() {
        
       // World settings
       game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       game.physics.startSystem(Phaser.Physics.P2JS);
       game.world.setBounds(0,0, WORLD_BOUNDS, WORLD_BOUNDS);

       this.game.state.start("load");
    }

    return { preload: preload, create: create};
})();