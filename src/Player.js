module.exports = function Player(game) {
    
    // To use constants in this module
    var Const = require('./Constants.js');
    
    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'player');
    sprite.anchor.setTo(0.5);
    sprite.angle = Const.PLAYER_START_ANGLE;
    this.sprite = sprite;

    // The coordinates of the explosion spawn are used when the animation is triggered
    var explosionSpawn = game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'empty');
    explosionSpawn.anchor.setTo(0.5);

    // Boom sound for thrusting
    var boomSound = game.add.audio('boom');
    boomSound.volume = 0.05;
    
    // Keep track of thrust frequency and adjust "instability mode" accordingly
    var thrustFrequency = 0;
    var intervalMargin = 0;
    var velocityBonus = 0;

    // Do animation, camera and sound effects
    var fireEngine = function() {
        var explosion = game.add.sprite(explosionSpawn.x, explosionSpawn.y, 'explosionAtlas');
        var frames = Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1);
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(2, 2);
        explosion.animations.add('explode', frames, 60, false, true).play();
        
        boomSound.play();
        game.camera.shake(0.01, 100, false);
    };

    // Apply the physics
    this.thrust = function() {
        fireEngine();
        thrustFrequency++;
        sprite.body.setZeroVelocity();            
        var acceleration = Const.THRUST_FORCE + Const.THRUST_FORCE * 0.1 * (Math.pow(velocityBonus, 2));
        sprite.body.thrust(acceleration);
    };

    this.loseControl = function() {
        console.log('OW');
        sprite.body.thrustLeft(100);
    };

    // This has to be called in the game loop for each frame
    this.update = function() {
        updateSpawn();
        updateAcceleration();
    };

    // Given how the rocket ship is angled, calculate the explosion spawn coordinates
    var updateSpawn = function() {    
        var xAngle = Math.cos(sprite.rotation - game.math.HALF_PI);
        var yAngle = Math.sin(sprite.rotation - game.math.HALF_PI);
        
        explosionSpawn.x = sprite.x + xAngle * Const.SPAWN_DISTANCE;
        explosionSpawn.y = sprite.y + yAngle * Const.SPAWN_DISTANCE;
    };

    // Given the frequency, increase the the camera shake with higher frequency
    var updateAcceleration = function() {
        if(game.time.totalElapsedSeconds() > intervalMargin) {
            intervalMargin += 1;
            
            if(thrustFrequency > Const.SPEED_UP_FREQUENCY) this.velocityBonus++; // Increase
            else if (velocityBonus / 2 > 1) velocityBonus /= 2; // Decrease
            else  velocityBonus = 0; // Round down to zero
            
            thrustFrequency = 0;
        }

        if(velocityBonus > Const.INSTABILITY_THRESHOLD)
            game.camera.shake(0.002 * velocityBonus, 2000, false);
    };
};