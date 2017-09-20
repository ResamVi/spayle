module.exports = function Player(game) {
    
    // To use constants in this module
    var Const = require('./Constants.js');
    
    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'player');
    sprite.anchor.setTo(0.5);
    sprite.angle = Const.PLAYER_START_ANGLE;
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    this.body = sprite.body;

    // Boom sound for thrusting
    var boomSound = game.add.audio('boom');
    boomSound.volume = 0.05;
    
    // Keep track of thrust frequency and adjust "instability mode" accordingly
    var thrustFrequency = 0;
    var intervalMargin = 0;
    var velocityBonus = 0;
    var timeStamp = 0;

    // Possible states: 'ready', 'spinning', 'charging'
    var state = 'ready';
    
    // This value is tweened, therefore object notation needed
    var spin = {force: 0}; 

    this.destroy = function() {
        sprite.destroy();
        boomSound.destroy();
    };

    // Do animation, camera and sound effects
    var fireEngine = function(explosionSize, distanceFromShip) {
        var position = calculateRearPosition(distanceFromShip);
        var explosion = game.add.sprite(position.x, position.y, 'explosionAtlas');
        var frames = Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1);
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(explosionSize, explosionSize);
        explosion.animations.add('explode', frames, 60, false, true).play(); // TODO: Make Constant
        
        boomSound.play();
        game.camera.shake(0.01, 100, false);
    };

    // Apply the physics
    this.thrust = function() {
        fireEngine(Const.SMALL_EXPLOSION, Const.SMALL_EXPLOSION_DISTANCE);
        thrustFrequency++;
        sprite.body.setZeroVelocity();            
        var acceleration = Const.THRUST_FORCE + Const.THRUST_FORCE * 0.1 * (Math.pow(velocityBonus, 2));
        sprite.body.thrust(acceleration);
    };

    // This has to be called in the game loop for each frame
    this.update = function() {
        
        if(state === 'ready')
            sprite.body.thrust(Const.MINIMUM_SPEED);
        
        /* updateSpawn(); */
        updateAcceleration();
        updateSpin();
    };

    this.loseControl = function() {
        timeStamp = game.time.totalElapsedSeconds();
        state = 'spinning';
        spin.force = Const.SPIN_AMOUNT;
    };

    this.isSpinning = function() {
        return state === 'spinning';
    };

    // These coordinates are used for spawning explosion animations,
    // Given how the rocket ship is angled, calculate the coordinates
    var calculateRearPosition = function(radius) {    
        var xAngle = Math.cos(sprite.rotation - game.math.HALF_PI);
        var yAngle = Math.sin(sprite.rotation - game.math.HALF_PI);
        
        var position = {};
        position.x = sprite.x + xAngle * radius;
        position.y = sprite.y + yAngle * radius;

        return position;
    };

    // Given the frequency, increase the the camera shake with higher frequency
    var updateAcceleration = function() {
        if(game.time.totalElapsedSeconds() > intervalMargin) {
            intervalMargin += 1;
            
            if (thrustFrequency > Const.SPEED_UP_FREQUENCY) velocityBonus++; // Increase
            else if (velocityBonus / 2 > 1) velocityBonus /= 2; // Decrease
            else  velocityBonus = 0; // Round down to zero
            
            thrustFrequency = 0;
        }

        // Go intro "instability mode" i.e. camera shakes due to high velocity
        if(velocityBonus > Const.INSTABILITY_THRESHOLD)
            game.camera.shake(0.002 * velocityBonus, Const.SHAKE_DURATION, false);
    };

    var updateSpin = function() {
        sprite.body.rotateLeft(spin.force);
        
        if(state === 'spinning' && game.time.totalElapsedSeconds() > timeStamp + 2) { // Util function (keepTrack/intervalFunc)         ?
            var gainControl = game.add.tween(spin).to(...Const.GAIN_CONTROL_BACK);
            gainControl.onComplete.add(function() {
                state = 'ready';
            });
        }   
    };

    this.superThrust = function() {

        console.log('SUPER THRUST');
        state = 'charging';
        
        // TODO: Particles

        // Come to a stop
        game.add.tween(sprite.body.velocity).to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.OUT, true); // TODO: Constant
        sprite.loadTexture('playerFire');
        
        // Same as thrust() but bigger
        var launch = function() {
            fireEngine(Const.BIG_EXPLOSION, Const.BIG_EXPLOSION_DISTANCE);
            sprite.body.setZeroVelocity();
            sprite.body.thrust(Const.THRUST_FORCE * 5);
            sprite.loadTexture('player');
            state = 'ready';
        };

        // When fully braked launch away
        game.time.events.add(1000, launch, this);
    };
};