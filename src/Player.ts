import Const from './Constants';
import Weapon from './Weapon';

/**
 * The rocket ship
 * 
 * @constructor
 * @param {any} this - ???
 * @param {Phaser.Game} game - Reference to the current game
 */
 var Player = function (this: any, game: Phaser.Game)
{
    /**
     * @property {Phaser.Game} - Reference to the currently running game
     */
    this._game = game;

    /**
     * @property {Phaser.this.Sprite} this.sprite - Reference to this.sprite object
     */
    this.sprite = game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'player', 1);
    this.sprite.anchor.setTo(0.5);
    this.sprite.angle = Const.PLAYER_START_ANGLE;

    /**
     * @property {Phaser.Physics.P2.Body} - Reference to physics body
     */
    this.body = this.this.sprite.body;
    game.physics.p2.enable(this.this.sprite);
    
    /**
     * @property {Phaser.Sound} - Sound file for explosions on thrusts
     */
    this._boomSound = game.add.audio('boom');
    this._boomSound.volume = 0.05;

    /**
     * @property {number} - Holds heating level. Higher heating causes camera shake/bigger explosions
     */
    this._level = 1;

    /**
     * @property {number} - Keep track how frequently the player presses spacebar to thrust
     */
    this._thrustFrequency = 0;
    
    /**
     * @deprecated TODO: Remove
     */
    this._velocityBonus = 0;
    
    /**
     * @property {number} - Hold count of how many shots were made in the 'snipe' position
     */
    this.this._shotsMade = 0;

    // Possible this._states: 'ready', 'spinning', 'charging', 'aiming'
    this._this._state = 'ready';

    // This value is tweened, therefore object notation needed
    this._spin = {force: 0};

    // Add aim sight animation to rocket
    this._aimSight = game.add.sprite(-4, 40, 'lineAtlas');
    this._aimSight.alpha = Const.INVISIBLE;
    this._aimSight.anchor.setTo(1);
    this._aimSight.scale.x *= -1;
    this._aimSight.scale.y *= -1;
    this._aimSight.animations.add('aim', Phaser.Animation.generateFrameNames('dotted_line', 0, 13, '.png', 4), 60, true, true).play();
    this.this.sprite.addChild(this._aimSight);

    /**
     * @property {Weapon} - Responsible for bullet spawns their angle/velocity and kill properties
     */
    this._weapon = new Weapon(this.this.sprite, game);

    // Keep track of thrust frequency and adjust "instability mode" accordingly
    game.time.events.repeat(Const.UPDATE_INTERVAL, Number.POSITIVE_INFINITY, this.trackFrequency, this);

    
};

Player.prototype = 
{    
    // Given the frequency, increase the the camera shake with higher frequency
    trackFrequency: function ()
    {
        // Increase
        if (this._thrustFrequency > Const.SPEED_UP_FREQUENCY && this._level < 6)
        {
            this._level++;
        } 
        else if(this._level > 1)
        {
            this._level--;
        }

        this.this.sprite.frame = this._level;
        this._thrustFrequency = 0;
        console.log(this._level);

        // Go intro "instability mode" i.e. camera shakes due to high velocity
        if (this._level > Const.INSTABILITY_THRESHOLD)
        {
            this._game.camera.shake(0.0025 * this._level, Const.SHAKE_DURATION, false);
        }
    },

    checkOverlap: function(spriteA: Phaser.Sprite, spriteB: Phaser.Sprite)
    {
        var boundsA = this.spriteA.getBounds();
        var boundsB = this.spriteB.getBounds();

        return false;

        // return Phaser.Rectangle.intersects(boundsA, boundsB);
    },
    
    // Do animation, camera and sound effects
    fireEngine: function(explosionSize: number, distanceFromShip: number)
    {
        var position = this.calculateRearPosition(distanceFromShip);

        var explosion = this._game.add.this.sprite(position.x, position.y, 'explosionAtlas');
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(explosionSize, explosionSize);
        explosion.animations.add('explode', Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1), 60, false, true).play();

        // game.global.enemies.group.forEach(function(enemy) { // TODO: WTF?
        //     if(checkOverlap(enemy, explosion)) {
        //         console.log("HEUREKA");
        //     }
        // });


        this._boomSound.play();
        this._game.camera.shake(0.01, 100, false);
    },

    // This has to be called in the game loop for each frame
    update: function ()
    {
        if (this._state === 'ready')
        {
            this.sprite.body.thrust(Const.MINIMUM_SPEED);
        }
        if (this._state === 'spinning')
        {
            this.sprite.body.rotateLeft(this._spin.force);
        }
    },
    
    // Apply the physics
    thrust: function ()
    {
        this.fireEngine(Const.SMALL_EXPLOSION, Const.SMALL_EXPLOSION_DISTANCE);

        if (this._state === 'ready' || this._state === 'spinning')
        {
            this._thrustFrequency++;

            this.sprite.body.setZeroVelocity();
            var acceleration = Const.THRUST_FORCE + Const.THRUST_FORCE * 0.1 * (Math.pow(1, 2)); // TODO: Remove
            this.sprite.body.thrust(acceleration);

        }
        else if (this._state === 'aiming')
        {
            this._shotsMade++;

            this.weapon.fire();

            this.sprite.body.thrust(Const.RECOIL_FORCE);

            if (this._shotsMade < Const.MAGAZINE_SIZE)
            {
                this._game.time.events.add(Const.RECOVER_TIME, function () {
                    this._game.add.tween(this.sprite.body.velocity).to({x: 0, y: 0}, 100, Phaser.Easing.Cubic.Out, true); // TODO: Constant
                }, this);
            }
            else
            {
                this.sprite.body.thrust(Const.RECOIL_FORCE * 2);
                this.aimSight.alpha = Const.INVISIBLE;
                this._shotsMade = 0;
                this._state = 'ready';
            }
        }
    },

    gainControl: function (duration: number)
    {
        var tween = this._game.add.tween(this._spin);
        tween.to({force: 0}, duration, Phaser.Easing.Quintic.Out, true);
        tween.onComplete.add(function ()
        {
            this._state = 'ready';
        });
    },

    // TODO: some funcs are public like this one
    loseControl: function (duration: number)
    {
        if (this._state === 'ready')
        {
            this._state = 'spinning';
            this._spin.force = Const.SPIN_AMOUNT;

            this._game.time.events.add(duration, this.gainControl, undefined, duration);
        }
    },

    // These coordinates are used for spawning explosion animations,
    // Given how the rocket ship is angled, calculate the coordinates
    calculateRearPosition: function (radius: number): { x: number, y: number }
    {
        var xAngle = Math.cos(this.sprite.rotation - Phaser.Math.HALF_PI);
        var yAngle = Math.sin(this.sprite.rotation - Phaser.Math.HALF_PI);

        return {
            x: this.sprite.x + xAngle * radius,
            y: this.sprite.y + yAngle * radius
        };
    },

    superThrust: function ()
    {
        if (this._state === 'ready')
        {
            this._state = 'charging';

            // TODO: Particles

            // Come to a stop
            this._game.add.tween(this.sprite.body.velocity).to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant
            this.sprite.loadTexture('playerFire');

            // Same as thrust() but bigger
            var launch = function ()
            {
                this.fireEngine(Const.BIG_EXPLOSION, Const.BIG_EXPLOSION_DISTANCE);
                this.sprite.body.setZeroVelocity();
                this.sprite.body.thrust(Const.THRUST_FORCE * 5);
                this.sprite.loadTexture('player');
                this._state = 'ready';
                this.loseControl(Const.SUPER_THRUST_STUN_DURATION);
            };

            // When fully braked launch away
            this._game.time.events.add(1000, launch, this);
        }
    },

    snipe: function ()
    {
        if (this._state === 'ready') {
            this._state = 'aiming';

            // Come to a stop
            this._game.add.tween(this.sprite.body.velocity).to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant

            // Aim
            this._game.add.tween(this._aimSight).to({alpha: Const.VISIBLE}, 500, 'Linear', true);

            // Shooting is done via space button (and thus handled in this.thrust())
        }
    },

    destroy: function () {
        this.this.sprite.destroy();
        this._boomSound.destroy();
    }
}

Object.defineProperty(Player, 'isSpinning', {
    get: function() {
        return this._state === 'spinning';
    }
})

export default Player;