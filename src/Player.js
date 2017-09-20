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
    
    // Keep track of velocity which increases with thrustFrequency
    var thrustFrequency = 0;
    var velocityBonus = 0;

    // Possible states: 'ready', 'spinning', 'charging'
    var state = 'ready';
    
    // This value is tweened, therefore object notation needed
    var spin = {force: 0}; 

    // Given the frequency, increase the the camera shake with higher frequency
    var trackFrequency = function() {    

        // Increase
        if (thrustFrequency > Const.SPEED_UP_FREQUENCY) 
            velocityBonus++;
        // Decrease
        else if (velocityBonus / 2 > 1) 
            velocityBonus /= 2; 
        // Round down to zero
        else  
            velocityBonus = 0; 
            
        thrustFrequency = 0;

        // Go intro "instability mode" i.e. camera shakes due to high velocity
        if(velocityBonus > Const.INSTABILITY_THRESHOLD)
            game.camera.shake(0.002 * velocityBonus, Const.SHAKE_DURATION, false);
    };

    // Keep track of thrust frequency and adjust "instability mode" accordingly
    game.time.events.repeat(Const.ACCEL_REPEAT_DURATION, Number.POSITIVE_INFINITY, trackFrequency, this);

    // Do animation, camera and sound effects
    var fireEngine = function(explosionSize, distanceFromShip) {
        var position = calculateRearPosition(distanceFromShip);
        
        var explosion = game.add.sprite(position.x, position.y, 'explosionAtlas');
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(explosionSize, explosionSize);
        explosion.animations.add(...Const.EXPLODE_ANIMATION_SETTINGS).play();
        
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
        
        if(state === 'spinning')
            sprite.body.rotateLeft(spin.force);

    };

    var gainControl = function(duration) {
        var tween = game.add.tween(spin);
        tween.to({force: 0}, duration, Phaser.Easing.Quintic.Out, true);
        tween.onComplete.add(function() {
            state = 'ready';
        });
    };

    var loseControl = function(_, duration) {
        state = 'spinning';
        spin.force = Const.SPIN_AMOUNT;

        console.log("Lost control for: " + duration);

        game.time.events.add(duration, gainControl, this, duration);
    };
    
    // loseControl is both used locally and globally
    this.loseControl = loseControl;

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

    this.superThrust = function() {

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
            loseControl(null, Const.SUPER_THRUST_STUN_DURATION);
        };

        // When fully braked launch away
        game.time.events.add(1000, launch, this);
    };

    this.destroy = function() {
        sprite.destroy();
        boomSound.destroy();
    };
};