/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';

/**
 * A Minion is spawned by its mother and follows it to
 * all eternity. Is a simple type enemy that is of no threat
 * whatsoever.
 *
 * @param  {Phaser.Game} game
 * @param  {Phaser.Sprite} mother //TODO: DO not pass the sprite
 */
function Minion(game : Phaser.Game, mother : Phaser.Sprite)
{
    /**
     * @property {Phaser.Game} - Keep a reference to the game
     */
    this._game = game;

    /**
     * @property {} - Keep a reference to this minion's this._mother TODO:
     */
    this._mother = mother;

    let xOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    let yOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));

    /**
     * @property {Phaser.Sprite} sprite - Reference to sprite object
     * @public
     */
    this.sprite = game.add.sprite(this._mother.x + xOffset, this._mother.y + yOffset, 'enemy_many');
    this.sprite.anchor.setTo(0.5);

    game.physics.p2.enable(this.sprite);
    this.sprite.body.damping = 0.8;
    this.sprite.body.fixedRotation = true;

    /**
     * @property {Phaser.Physics.P2.Body} - Reference to physics body
     * @public
     */
    this.body = this.sprite.body;

    /** TODO: Rename _state
     * @property {string} - Keep current decision in this variable
     * Possible states: 'READY', 'ATTACKING', 'RETURNING', 'FOLLOWING'
     * @private
     */
    this.state = 'READY';

    // ----------------- DEBUG -----------------
    if (Const.DEBUG_MODE)
    {
        this._debugState = game.add.bitmapText(0, -80, 'menuFont', '', 30);
        this._debugState.anchor.set(0.5);
        this.sprite.addChild(this._debugState);
    }
}

Minion.prototype = {

    /**
     * Has to be called each cycle.
     * Currently controls decision making.
     *
     * @param  {Player} player
     * @param  {} motherAngle
     */
    update: function (player, motherAngle)
    {
        // Decisions
        if (this.state === 'READY' && this.playerInRange(player.sprite))
        {
            this.state = 'ATTACKING';
            this.attack(player);
        }
        else if (this.state === 'READY' && !this.closeToMother())
        {
            this.state = 'RETURNING';
            this.returnBack();
        }
        else if (this.state === 'READY')
        {
            this.state = 'FOLLOWING';
            this.follow(motherAngle);
        }

        // When coming to a close stop make a new decision
        if (this.velocity() < 10)
        {
            this.state = 'READY';
        }
    },

    /**
     * Calculates direct path to mother and moves in that direction.
     * @method
     */
    returnBack: function ()
    {
        let angleToMother = Phaser.Math.angleBetween(this.sprite.x, this.sprite.y, this._mother.x, this._mother.y);
        this.sprite.body.rotation = angleToMother + Phaser.Math.HALF_PI;
        this.sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    },

    /**
     * Attacking currently only means moving in the direction of the player.
     * @method
     * @param  {Player} player
     */
    attack: function (player)
    {
        //TODO: Shorten params?
        let playerEnemyAngle = Phaser.Math.angleBetween(this.sprite.x,
                                                        this.sprite.y,
                                                        player.sprite.x,
                                                        player.sprite.y);
        let offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI / 2; // in [-pi/4, pi/4]

        this.sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        this.sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    },
    /**
     * Stays inside the influence radius of the mother.
     * @method
     * @param  {} motherAngle - choose a similar angle to move like the mother
     */
    follow: function (motherAngle)
    {
        let angle;

        // Stay inside bounds bounds
        if (this.sprite.y < Const.INFLUENCE_RADIUS / 2) // TODO: Kinda magic numbers?
        {
            angle = Math.PI;
        }
        else if (this.sprite.y > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2)
        {
            angle = 0;
        }
        else if (this.sprite.x < Const.INFLUENCE_RADIUS / 2)
        {
            angle = Phaser.Math.HALF_PI;
        }
        else if (this.sprite.x > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2)
        {
            angle = Math.PI + Phaser.Math.HALF_PI;
        }
        else
        {
            angle = motherAngle + Math.PI / 6 * (Math.random() * 2 - 1);
        }
        this.sprite.body.rotation = angle;
        this.sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    },

    /**
     * Calculate the velocity
     * @method
     * @returns {number} velocity of this object
     */
    velocity: function ()
    {
        let x = this.sprite.body.velocity.x;
        let y = this.sprite.body.velocity.y;

        return Math.round(Math.sqrt(x * x + y * y));
    },

    /**
     * Check whether the player is inside the sight range of this object
     * @method
     * @param {Player} player - Player to check
     * @returns {boolean} - Whether or not player is inside sight range
     */
    playerInRange: function (player)
    {
        return Phaser.Math.distance(this.sprite.x, this.sprite.y, player.x, player.y) < Const.SIGHT_RANGE;
    },

    /**
     * Check whether this object is inside the mother's influence range
     * @method
     * @returns {boolean} - Whether or not this object is inside
     */
    closeToMother: function ()
    {
        return Phaser.Math.distance(this.sprite.x,
                                    this.sprite.y,
                                    this._mother.x,
                                    this._mother.y) < Const.INFLUENCE_RADIUS / 2; // TODO: Radius =/= circumference
    },

    /**
     * Has to be called each cycle when debugging.
     * Presents information on the state.
     */
    debug: function ()
    {
        if (Const.DEBUG_MODE)
        {
            this._debugState.text = this.state;
        }
    }
};

export default Minion;
