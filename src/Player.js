import Const from './Constants';
import Weapon from './Weapon';

function Player(game : Phaser.Game)
{
    this.game = game;

    // This object keeps track and exposes the this.sprite
    this.sprite = game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'player', 1);
    this.sprite.anchor.setTo(0.5);
    this.sprite.angle = Const.PLAYER_START_ANGLE;
    

    // Grant access to this object's physics body
    game.physics.p2.enable(this.sprite);
    this.body = this.sprite.body;

    // Boom sound for thrusting
    this.boomSound = game.add.audio('boom');
    this.boomSound.volume = 0.05;
    
    // Keep track of velocity which increases with thrustFrequency
    this.thrustFrequency = 0;
    this.velocityBonus = 0;
    this.shotsMade = 0;

    // Possible states: 'ready', 'spinning', 'charging', 'aiming'
    this.state = 'ready';
    
    // This value is tweened, therefore object notation needed
    var spin = {force: 0}; 

    // Add aim sight animation to rocket
    var aimSight = game.add.sprite(-4, 40, 'lineAtlas');
    aimSight.alpha = Const.INVISIBLE;
    aimSight.anchor.setTo(1);
    aimSight.scale.x *= -1;
    aimSight.scale.y *= -1;
    aimSight.animations.add('aim', Phaser.Animation.generateFrameNames('dotted_line', 0, 13, '.png', 4), 60, true, true).play();
    this.sprite.addChild(aimSight);
    
    // Responsible for bullet spawns their angle/velocity and kill properties
    var weapon = new Weapon(this.sprite, game);

    // ---- FUNCTIONS ----

    // Given the frequency, increase the the camera shake with higher frequency
    var trackFrequency = function()
    {    
        // Increase
        if (this.thrustFrequency > Const.SPEED_UP_FREQUENCY) 
            this.velocityBonus++;
        // Decrease
        else if (this.velocityBonus / 2 > 1) 
            this.velocityBonus /= 2; 
        // Round down to zero
        else  
            this.velocityBonus = 0; 
            
        this.thrustFrequency = 0;

        // Go intro "instability mode" i.e. camera shakes due to high velocity
        if(this.velocityBonus > Const.INSTABILITY_THRESHOLD)
            game.camera.shake(0.002 * this.velocityBonus, Const.SHAKE_DURATION, false);
    };

    // Keep track of thrust frequency and adjust "instability mode" accordingly
    game.time.events.repeat(Const.UPDATE_INTERVAL, Number.POSITIVE_INFINITY, trackFrequency, this);
};

Player.prototype = {
    // TODO: Put into Engine
    // Do animation, camera and sound effects
    fireEngine: function(explosionSize : number, distanceFromShip : number)
    {
        var position = this.calculateRearPosition(distanceFromShip);
        
        var explosion = this.game.add.sprite(position.x, position.y, 'explosionAtlas');
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(explosionSize, explosionSize);
        explosion.animations.add('explode', Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1), 60, false, true).play();

        // game.global.enemies.group.forEach(function(enemy) { // TODO: WTF?
        //     if(checkOverlap(enemy, explosion)) {
        //         console.log("HEUREKA");
        //     }
        // });


        this.boomSound.play();
        this.game.camera.shake(0.01, 100, false);
    };

    checkOverlap: function(spriteA : Phaser.Sprite, spriteB : Phaser.Sprite)
    {    
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return false;

        // return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    // Apply the physics
    thrust: function()
    {    
        this.fireEngine(Const.SMALL_EXPLOSION, Const.SMALL_EXPLOSION_DISTANCE);

        if(this.state === 'ready' || this.state === 'spinning') {    
            this.thrustFrequency++;
            
            this.sprite.body.setZeroVelocity();            
            var acceleration = Const.THRUST_FORCE + Const.THRUST_FORCE * 0.1 * (Math.pow(this.velocityBonus, 2));
            this.sprite.body.thrust(acceleration);
        
        } else if(this.state === 'aiming') {
            this.shotsMade++;
            
            weapon.fire();
            
            this.sprite.body.thrust(Const.RECOIL_FORCE);
            
            if(this.shotsMade < Const.MAGAZINE_SIZE) {
                this.game.time.events.add(Const.RECOVER_TIME, function() {
                    this.game.add.tween(this.sprite.body.velocity).to({x: 0, y: 0}, 100, Phaser.Easing.Cubic.Out, true); // TODO: Constant
                }, this);
            } else {
                this.sprite.body.thrust(Const.RECOIL_FORCE * 2);
                aimSight.alpha = Const.INVISIBLE;
                this.shotsMade = 0;
                this.state = 'ready';
            }
        }
    };

    // This has to be called in the game loop for each frame
    update: function()
    {
        if(this.state === 'ready')
            this.sprite.body.thrust(Const.MINIMUM_SPEED);
        
        if(this.state === 'spinning')
            this.sprite.body.rotateLeft(spin.force);
    },

    gainControl: function(duration : number)
    {
        var tween = this.game.add.tween(spin);
        tween.to({force: 0}, duration, Phaser.Easing.Quintic.Out, true);
        tween.onComplete.add(function() {
            this.state = 'ready';
        });
    },

    loseControl: function(_ : any, duration : number)
    {
        if(this.state === 'ready') {
            this.state = 'spinning';
            spin.force = Const.SPIN_AMOUNT;

            this.game.time.events.add(duration, gainControl, undefined, duration);
        }
    },

    isSpinning: function()
    {
        return this.state === 'spinning';
    },

    // These coordinates are used for spawning explosion animations,
    // Given how the rocket ship is angled, calculate the coordinates
    calculateRearPosition: function(radius : number) : {x : number, y : number}
    {    
        var xAngle = Math.cos(this.sprite.rotation - Phaser.Math.HALF_PI);
        var yAngle = Math.sin(this.sprite.rotation - Phaser.Math.HALF_PI);
        
        return {
            x: this.sprite.x + xAngle * radius,
            y: this.sprite.y + yAngle * radius
        };
    },

    superThrust: function()
    {
        if(this.state === 'ready') {
            this.state = 'charging';
            
            // TODO: Particles

            // Come to a stop
            this.game.add.tween(this.sprite.body.velocity).to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant
            this.sprite.loadTexture('playerFire');
            
            // Same as thrust() but bigger
            var launch = function() {
                this.fireEngine(Const.BIG_EXPLOSION, Const.BIG_EXPLOSION_DISTANCE);
                this.sprite.body.setZeroVelocity();
                this.sprite.body.thrust(Const.THRUST_FORCE * 5);
                this.sprite.loadTexture('player');
                this.state = 'ready';
                loseControl(null, Const.SUPER_THRUST_STUN_DURATION);
            };

            // When fully braked launch away
            this.game.time.events.add(1000, launch, this);
        }
    },

    snipe: function()
    {
        if(this.state === 'ready') {
            this.state = 'aiming';

            // Come to a stop
            this.game.add.tween(this.sprite.body.velocity).to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant

            // Aim
            this.game.add.tween(aimSight).to({alpha: Const.VISIBLE}, 500, 'Linear', true);

            // Shooting is done via space button (and thus handled in this.thrust())
        }
    },

    destroy: function()
    {
        this.sprite.destroy();
        this.boomSound.destroy();
    }
};

export default Player;