module.exports = (function(){
    
    const ROTATION_SPEED = 100; // TODO: Create own file for constants
    const THRUST_FORCE = 50000; //50000
    const PLAYER_START_Y = 120;
    const PLAYER_START_X = 210;
    const SPAWN_DISTANCE = -20;
    const AUDIO_FADE_DURATION = 7300;
    const SPEED_UP_FREQUENCY = 1;
    const INSTABILITY_THRESHOLD = 2;

    var debugMode = true;

    var arrowkeys;
    var wasd;
    
    var player;
    var explosionSpawn; // TODO: Create own module for explosionspawn
    
    var mainMusic;

    var intervalMargin = 0;
    var velocityBonus = 0;
    var thrustFrequency = 0;

    function create() {

        // Background
        this.add.sprite(0, 0, 'background');
        
        // Player
        player = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        player.anchor.setTo(0.5);
        this.physics.p2.enable(player);

        // Explosion Spawn
        explosionSpawn = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'empty');
        explosionSpawn.anchor.setTo(0.5);

        // Music
        var startMusic = this.add.audio('startMusic');
        startMusic.onFadeComplete.add(function() {
            mainMusic = this.add.audio('mainMusic');
            mainMusic.play();
            mainMusic.loop = true;
        }, this);
        startMusic.onDecoded.add(function() {
            startMusic.fadeIn(AUDIO_FADE_DURATION);
        }, this);
        var boomSound = this.add.audio('boom');
        boomSound.volume = 0.05;

        // Controls
        arrowkeys = this.input.keyboard.createCursorKeys();
        wasd = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A)
        };
    
        var thrust = function() {
            thrustFrequency++;
            
            boomSound.play();

            this.camera.shake(0.01, 100, false);

            var explosion = this.add.sprite(explosionSpawn.x, explosionSpawn.y, 'explosionAtlas');
            var frames = Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1);
            explosion.anchor.setTo(0.5);
            explosion.scale.setTo(2, 2);
            explosion.animations.add('explode', frames, 60, false, true).play();

            player.body.setZeroVelocity();            
            var acceleration = THRUST_FORCE + THRUST_FORCE * 0.1 * (Math.pow(velocityBonus, 2));
            player.body.thrust(acceleration);
        };

        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(thrust, this);
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(thrust, this);
        this.camera.follow(player, null, 0.5, 0.5);
    }
    
    
    function update() { // TODO: Create a proper game loop here

        updateSpawn.call(this);
        calculateAcceleration.call(this);

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
    
    function calculateAcceleration() {
        if(this.game.time.totalElapsedSeconds() > intervalMargin) {
            intervalMargin += 1;
            
            if(thrustFrequency > SPEED_UP_FREQUENCY) velocityBonus++; // Increase
            else if (velocityBonus / 2 > 1) velocityBonus /= 2; // Decrease
            else  velocityBonus = 0; // Round down to zero
            
            thrustFrequency = 0;
        }

        if(velocityBonus > INSTABILITY_THRESHOLD)
            this.camera.shake(0.002 * velocityBonus, 2000, false);
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
            this.game.debug.body(player);

            this.game.debug.text('velBonus: ' + velocityBonus, 32, 350);
            this.game.debug.text('thrustFreq: ' + thrustFrequency, 32, 380);
            this.game.debug.text('Elapsed seconds: ' + this.game.time.totalElapsedSeconds(), 32, 400);
        }
    }

    return { create: create, update: update, render: render};
})();