module.exports = (function(){
    
    var Const = require('./Constants.js');

    var arrowkeys;
    
    var player;
    
    var mainMusic;

    // Receive already loaded player from menu scene
    function init(args) {
        player = args;
        this.physics.p2.enable(player.sprite);
        player.body = player.sprite.body;
    }

    function create() {

        // Music
        mainMusic = this.add.audio('mainMusic');
        mainMusic.onDecoded.add(function() {
            mainMusic.play();
        }, this);

        // Controls
        arrowkeys = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(player.loseControl, this);
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(player.thrust, this);
        this.camera.follow(player.sprite, null, 0.5, 0.5);

        player.body.thrust(Const.LAUNCH_FORCE);
    }
    
    
    function update() { // TODO: Create a proper game loop here

        player.update();

        if (!player.isSpinning() && arrowkeys.left.isDown) 
            player.body.rotateLeft(Const.ROTATION_SPEED);
        else if (!player.isSpinning() && arrowkeys.right.isDown)
            player.body.rotateRight(Const.ROTATION_SPEED);
        else if (!player.isSpinning())
            player.body.setZeroRotation();
    }

    function render() {
        
        if(Const.DEBUG_MODE) {
            var x = player.body.velocity.x;
            var y = player.body.velocity.y;
            var v = Math.round(Math.sqrt(x*x + y*y));
            
            this.game.debug.spriteInfo(player.sprite, 32, 180);
            this.game.debug.body(player);
            this.game.debug.text('Velocity: ' + v , 32, 550);
            this.game.debug.cameraInfo(this.camera, 32, 32);
            this.game.debug.spriteCoords(player.sprite, 32, 500);
            this.game.debug.body(player.sprite);

            this.game.debug.text('Elapsed seconds: ' + this.game.time.totalElapsedSeconds(), 32, 400);
        }
    }

    return { init: init, create: create, update: update, render: render};
})();