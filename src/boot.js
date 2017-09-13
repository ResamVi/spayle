module.exports = (function(){
    
    const WORLD_BOUNDS = 10000;

    function preload() {
        this.load.image('loadbar', 'res/loadbar.png');
        this.load.bitmapFont('font','res/font_0.png', 'res/font.fnt');
    }

    function create() {
        
       // World settings
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       this.physics.startSystem(Phaser.Physics.P2JS);
       this.world.setBounds(0,0, WORLD_BOUNDS, WORLD_BOUNDS);

       this.state.start("load");
    }

    return { preload: preload, create: create};
})();