module.exports = (function(){
    
    const ROTATION_SPEED = 100;
    const THRUST_FORCE = 50000;
    const PLAYER_START_Y = 120;
    const PLAYER_START_X = 210;
    
    var debugMode = true;

    var arrowkeys;
    var wasd;
    
    var player;
    
    function create() {

        // Sprites
        this.add.sprite(0, 0, 'background');
        player = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        this.physics.p2.enable(player);
    
        // Controls
        arrowkeys = this.input.keyboard.createCursorKeys();
        wasd = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A)
        };
    
        var thrust = function() {
            player.body.setZeroVelocity();
            player.body.thrust(THRUST_FORCE);
        }

        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(thrust, this);
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(thrust, this);
    
        this.camera.follow(player, null, 0.1, 0.1);
    }
    
    function update() {
        player.body.thrust(100);
    
        if (arrowkeys.left.isDown || wasd.left.isDown) {
            player.body.rotateLeft(ROTATION_SPEED);
        }
        else if (arrowkeys.right.isDown || wasd.right.isDown) {
            player.body.rotateRight(ROTATION_SPEED);
        }else{
            player.body.setZeroRotation();
        }
    }
    
    function render() {
        
        if(debugMode) {
            var x = player.body.velocity.x;
            var y = player.body.velocity.y;
            var v = Math.round(Math.sqrt(x*x + y*y));
            
            this.game.debug.spriteInfo(player, 32, 180);
            this.game.debug.body(player);
            this.game.debug.text("Velocity: " + v , 32, 550);
            this.game.debug.cameraInfo(this.camera, 32, 32);
            this.game.debug.spriteCoords(player, 32, 500);
        }
    }

    return { create: create, update: update, render: render};
})();