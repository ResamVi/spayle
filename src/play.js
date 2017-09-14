module.exports = (function(){
    
    const ROTATION_SPEED = 100;
    const THRUST_FORCE = 50000;
    const PLAYER_START_Y = 120;
    const PLAYER_START_X = 210;
    const SPAWN_DISTANCE = -50;

    var debugMode = true;

    var arrowkeys;
    var wasd;
    
    var player;
    var explosion;
    
    var explosionSpawn; // TODO: Create own module for explosionspawn
    
    function create() {

        // Background
        this.add.sprite(0, 0, 'background');
        
        // Player
        player = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        this.physics.p2.enable(player);

        // Explosion Animation
        explosion = this.add.sprite(-90, -10, 'explosionAtlas', 'explosion/ex0.png');
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.scale.setTo(2, 2);
        var frames = Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1);
        explosion.animations.add('explode', frames, 60, false, true);

        // Explosion Spawn
        explosionSpawn = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'empty');
        explosionSpawn.anchor.x = 0.5;
        explosionSpawn.anchor.y = 0.5;

        // Controls
        arrowkeys = this.input.keyboard.createCursorKeys();
        wasd = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A)
        };
    
        var thrust = function() {
            explosion.x = explosionSpawn.x;
            explosion.y = explosionSpawn.y;
            explosion.animations.play('explode');
            
            player.body.setZeroVelocity();
            player.body.thrust(THRUST_FORCE);
        };

        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(thrust, this);
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(thrust, this);
        this.camera.follow(player, null, 0.5, 0.5);
    }
    
    
    function update() { // TODO: Create a proper game loop here

        updateSpawn.call(this);

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
    
    function updateSpawn() {    
        var xAngle = Math.cos(player.rotation - this.math.HALF_PI);
        var yAngle = Math.sin(player.rotation - this.math.HALF_PI);
        
        explosionSpawn.x = player.x + xAngle * SPAWN_DISTANCE;
        explosionSpawn.y = player.y + yAngle * SPAWN_DISTANCE;
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