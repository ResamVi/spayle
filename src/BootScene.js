module.exports = (function(){
    
    var Const = require('./Constants.js');

    function create() {
        
        // World settings
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.world.setBounds(0,0, Const.WORLD_BOUNDS, Const.WORLD_BOUNDS);

        this.state.start('load');
    }

    return { create: create};
})();