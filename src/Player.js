/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';
import Weapon from './Weapon';

/**
 * The rocket ship is controlled by the player
 * and the main actor of this game.
 *
 * @param {Phaser.Game} game - A reference to the currently running game
 * @constructor
 */
function Player(game : Phaser.Game)
{
    /**
     * @property {Phaser.Game} - Reference to the game
     */
    this._game = game;

    /**
     * @property {Phaser.Sprite} sprite - Reference to sprite object
     * @public
     */
    this.sprite = game.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'player', 1);
    this.sprite.anchor.setTo(0.5);
    this.sprite.angle = Const.PLAYER_START_ANGLE;

    this._game.physics.p2.enable(this.sprite);

    /**
     * @property {Phaser.Physics.P2.Body} - Reference to physics body
     */
    this.body = this.sprite.body;

    /**
     * @property {Phaser.Sound} - Sound file for explosions on thrusts
     */
    this._boomSound = game.add.audio('boom');
    this._boomSound.volume = 0.05;

    /**
     * @property {number} - Keep track how frequently the player presses spacebar to thrust
     */
    this._thrustFrequency = 0;

    /**
     * @property {number} - Calculated bonus velocity gained by high thrust frequency
     */
    this._velocityBonus = 0;

    /**
     * @property {number} - Hold count of how many shots were made in the 'snipe' position
     */
    this._shotsMade = 0;

    /**
     * @property {string} - Keeps track of the current status of movement
     * possible states are 'ready', 'spinning', 'charging', 'aiming'
     */
    this._state = 'ready';

    /**
     * @property {object} - Keeps count of spinning intensity (object notation so it can be tweened)
     */
    this._angularVelocity = {amount: 0};

    // Add aim sight animation to rocket
    /**
     * @property {Phaser.Sprite} - Dotted line animation used when sniping
     */
    this._aimSight = game.add.sprite(-4, 40, 'lineAtlas');
    this._aimSight.alpha = Const.INVISIBLE;
    this._aimSight.anchor.setTo(1);
    this._aimSight.scale.x *= -1;
    this._aimSight.scale.y *= -1;
    this._aimSight.animations.add(...Const.ANIMATION_PARAMS).play();
    this.sprite.addChild(this._aimSight);

    // Responsible for bullet spawns their angle/velocity and kill properties
    this._weapon = new Weapon(this.sprite, this._game);

    // Given the frequency, increase the the camera shake with higher frequency TODO: Inside prototype?
    let trackFrequency = function()
    {
        if (this._thrustFrequency > Const.TOO_FAST)
        {
            this._velocityBonus++; // Increase
        }
        else if (this._velocityBonus / 2 > 1)
        {
            this._velocityBonus /= 2; // Decrease
        }
        else // TODO: THis can be done more eleganty
        {
            this._velocityBonus = 0; // Round down to zero
        }
        this._thrustFrequency = 0;

        // Go intro "instability mode" i.e. camera shakes due to high velocity
        if (this._velocityBonus > Const.INSTABILITY_THRESHOLD)
        {
            game.camera.shake(0.002 * this._velocityBonus, Const.SHAKE_DURATION, false);
        }
    };

    // Keep track of thrust frequency and adjust "instability mode" accordingly
    game.time.events.repeat(Const.UPDATE_INTERVAL, Number.POSITIVE_INFINITY, trackFrequency, this);
}

/**
 * Functions
 * @method
 */
Player.prototype = {

    /**
     * Does animation, camera shake and sound effects.
     *
     * @param  {number} explosionSize - Size of explosion sprite
     * @param  {number} distanceFromShip - Distance from ship where explosion will occur
     */
    fireEngine: function(explosionSize : number, distanceFromShip : number)
    {
        let position = this.calculateRearPosition(distanceFromShip);

        let explosion = this._game.add.sprite(position.x, position.y, 'explosionAtlas');
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(explosionSize, explosionSize);
        explosion.animations.add('explode',
        Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1), 60, false, true).play();

        // game.global.enemies.group.forEach(function(enemy) { // TODO: WTF?
        //     if(checkOverlap(enemy, explosion)) {
        //         console.log("HEUREKA");
        //     }
        // });

        this._boomSound.play();
        this._game.camera.shake(0.01, 100, false);
    },

    /**
     * Check for collision
     *
     * @param  {Phaser.Sprite} spriteA - This sprite
     * @param  {Phaser.Sprite} spriteB - Other sprite to check for
     * @method
     */
    checkOverlap: function(spriteA : Phaser.Sprite, spriteB : Phaser.Sprite)
    {
        let boundsA = spriteA.getBounds();
        let boundsB = spriteB.getBounds();

        return false;

        // return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    /**
     * Applies the animation, physics
     * @method
     */
    thrust: function()
    {
        this.fireEngine(Const.SMALL_EXPLOSION, Const.SMALL_EXPLOSION_DISTANCE);

        // Handle a space bar press as moving forwards
        if (this.isReady || this.isSpinning)
        {
            this._thrustFrequency++;

            let acceleration = Const.THRUST_FORCE + Const.THRUST_FORCE * 0.1 * (Math.pow(this._velocityBonus, 2));
            this.sprite.body.setZeroVelocity();
            this.sprite.body.thrust(acceleration);

        // Handle a space bar press as shooting a missile
        }
        else if (this.isAiming)
        {
            this._shotsMade++;

            this._weapon.fire();

            this.sprite.body.thrust(Const.RECOIL_FORCE);

            // TODO: Cleanup
            if (this._shotsMade < Const.MAGAZINE_SIZE)
            {
                this._game.time.events.add(Const.RECOVER_TIME, function() {
                    this._game.add.tween(this.sprite.body.velocity)
                    .to({x: 0, y: 0}, 100, Phaser.Easing.Cubic.Out, true); // TODO: Constant
                }, this);
            }
            else
            {
                this.sprite.body.thrust(Const.RECOIL_FORCE * 2);
                this._aimSight.alpha = Const.INVISIBLE;
                this._shotsMade = 0;
                this._state = 'ready';
            }
        }
    },

    /**
     * This has to be called in the game loop for each frame
     * @method
     */
    update: function()
    {
        if (this.isReady)
        {
            this.sprite.body.thrust(Const.MINIMUM_SPEED);
        }

        if (this.isSpinning)
        {
            this.sprite.body.rotateLeft(this._angularVelocity.amount);
        }
    },

    /**
     * Stop spinning and fade out into stability again
     * @param {number} duration - how fas to gain back sability
     * @method
     */
    gainControl: function(duration : number)
    {
        let tween = this._game.add.tween(this._angularVelocity);
        tween.to({amount: 0}, duration, Phaser.Easing.Quintic.Out, true);
        tween.onComplete.add(function() {
            this._state = 'ready';
        }, this);
    },

    /**
     * Start spinning madly.
     * Don't even dare trying to touch that first argument.
     *
     * @param  {number} duration - How long the rocket should spin
     */
    loseControl: function(_ : any, duration : number)
    {
        if (this.isReady)
        {
            this._state = 'spinning';
            this._angularVelocity.amount = Const.SPIN_AMOUNT;
            this._game.time.events.add(duration, this.gainControl, this, duration);
        }
    },

    /**
     * These coordinates are used for spawning explosion animations,
     * Given how the rocket ship is angled, calculate the coordinates
     *
     * @method
     * @param  {number} radius - this number dictates the distance between rocket center and rear
     * @returns {object} The point object containing x and y properties of the rocket rear
     */
    calculateRearPosition: function(radius : number)
    {
        let xAngle = Math.cos(this.sprite.rotation - Phaser.Math.HALF_PI);
        let yAngle = Math.sin(this.sprite.rotation - Phaser.Math.HALF_PI);

        return {
            x: this.sprite.x + xAngle * radius,
            y: this.sprite.y + yAngle * radius
        };
    },

    /**
     * A special thrust that requires build-up but launces farther, at the cost of
     * spinning out of control
     *
     * @method
     */
    superThrust: function()
    {
        if (this.isReady)
        {
            this._state = 'charging';

            // TODO: Particles

            // Come to a stop
            this._game.add.tween(this.sprite.body.velocity).to(Const.STOPPING_PARAMS);
            this.sprite.loadTexture('playerFire');

            // Same as thrust() but bigger
            let launch = function()
            {
                this.fireEngine(Const.BIG_EXPLOSION, Const.BIG_EXPLOSION_DISTANCE);
                this.sprite.body.setZeroVelocity();
                this.sprite.body.thrust(Const.THRUST_FORCE * 5);
                this.sprite.loadTexture('player');
                this._state = 'ready';
                this.loseControl(null, Const.SUPER_THRUST_STUN_DURATION);
            };

            // When fully braked: launch away
            this._game.time.events.add(1000, launch, this);
        }
    },

    /**
     * The player goes to a standstill and the aimsight appears.
     * Player can shoot a certain amount of missiles before being launched away again.
     *
     * @method
     */
    snipe: function()
    {
        if (this.isReady)
        {
            this._state = 'aiming';

            // Come to a stop
            this._game.add.tween(this.sprite.body.velocity).
            to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.Out, true); // TODO: Constant

            // Aim
            this._game.add.tween(this._aimSight).to({alpha: Const.VISIBLE}, 500, 'Linear', true);

            // Shooting is done via space button (and thus handled in this.thrust())
        }
    },

    /**
     * Clears sprites (only in use by the menu)
     *
     * @method
     */
    destroy: function()
    {
        this.sprite.destroy();
        this._boomSound.destroy();
    }
};

/**
 * Getter and Setter
 *
 * @method
 */
Object.defineProperties(Player.prototype, {
    'isReady': { get: function() { return this._state === 'ready'; }},
    'isSpinning': { get: function() { return this._state === 'spinning'; }},
    'isChargin': { get: function() { return this._state === 'charging'; }},
    'isAiming': { get: function() { return this._state === 'aiming'; }},
});

export default Player;
