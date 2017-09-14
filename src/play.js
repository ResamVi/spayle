module.exports = (function(){
    
    const ROTATION_SPEED = 100;
    const THRUST_FORCE = 50000;
    const PLAYER_START_Y = 120;
    const PLAYER_START_X = 210;
    
    var debugMode = true;

    var arrowkeys;
    var wasd;
    
    var player;
    var explosion;
    
    function create() {

        // Background
        this.add.sprite(0, 0, 'background');
        
        // Player
        player = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        this.physics.p2.enable(player);

        // Explosion
        explosion = this.add.sprite(-90, -10, 'explosionAtlas', 'explosion/ex0.png');
        explosion.scale.setTo(2, 2);
        var frames = Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1);
        explosion.animations.add('explode', frames, 60, false, true);
        player.addChild(explosion);

        // Controls
        arrowkeys = this.input.keyboard.createCursorKeys();
        wasd = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A)
        };
    
        var thrust = function() {
            explosion.animations.play('explode');
            player.body.setZeroVelocity();
            player.body.thrust(THRUST_FORCE);
        };

        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(thrust, this);
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(thrust, this);
        this.camera.follow(player, null, 0.5, 0.5);
    }
    
    function update() {

        // Keep the player moving
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
            this.game.debug.text('Velocity: ' + v , 32, 550);
            this.game.debug.cameraInfo(this.camera, 32, 32);
            this.game.debug.spriteCoords(player, 32, 500);
            this.game.debug.body(explosion);
            this.game.debug.body(player);
        }
    }

    return { create: create, update: update, render: render};
})();