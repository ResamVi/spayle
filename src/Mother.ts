import Minion from './Minion';
import Const from './Constants';

function Mother(game: Phaser.Game)
{
    /**
     * @property {Phaser.Game} - Keep a reference to the game
     */
    this._game = game;

    /**
     * @property {Phaser.Sprite} sprite - Reference to sprite object
     * @public
     */
    this.sprite = game.add.sprite(2000, 2000, 'enemy_boss');
    this.sprite.anchor.setTo(0.5);

    game.physics.p2.enable(this.sprite);
    this.sprite.body.damping = 0.8;
    this.sprite.body.fixedRotation = true;

    /**
     * @property {Phaser.Physics.P2.Body} - Reference to physics body
     * @public TODO: public?
     */
    this.body = this.sprite.body;

    /**
     * @property {string} - Keep current decision in this variable
     * Possible states: 'READY', 'ROAM', 'ATTACKING'
     * @private
     */
    this._state = 'READY';

    /**
     * @property {array} - Contains all minions that have spawned
     * @private
     */
    this._minions = [];

    // Each mother gets 3 minions to start with
    let group = game.add.group();
    for (let i = 0; i < 3; i++)
    {
        let minion = new Minion(game, this.sprite);
        this._minions.push(minion);
        group.add(minion.sprite);
    }

    /**
     * @property {Phaser.Group} - Uhhhhhhhh
     */
    this.group = group;

    // Select a random angle to start travelling
    this._currentAngle = Phaser.Math.PI2 * Math.random() - Math.PI;

    // ----------------- DEBUG -----------------
    let debugState;
    if (Const.DEBUG_MODE)
    {
        debugState = game.add.bitmapText(0, -80, 'menuFont', '', 30);
        debugState.anchor.set(0.5);
        this.sprite.addChild(debugState);
    }

    /**
     * @property {Phaser.Graphics} - TODO
     */
    this._graphics = this._game.add.graphics(0, 0);
    this._graphics.boundsPadding = 10;

    this.debug = function ()
    {
        if (Const.DEBUG_MODE)
        {
            debugState.text = this._state;
            for (let i = 0; i < this._minions.length; i++)
            {
                this._minions[i].debug();
            }
        }
    };
}

Mother.prototype =
{
    update: function (player)
    {
        // TODO: they are not drawn above anymore wtf?
        /*this._graphics.clear();
        this._graphics.lineStyle(0xff6500);
        this._graphics.drawCircle(this.sprite.x, this.sprite.y, Const.INFLUENCE_RADIUS);
        this._graphics.endFill();*/

        // Possible decisions
        if (this._state === 'READY' && this.playerInRange(player.sprite))
        {
            this._state = 'ATTACKING';
            this.attack(player);
        }
        else if (this._state === 'READY')
        {
            this._state = 'ROAM';
            this.roam();
        }

        this.spawnEnemy();

        // Update its minions (they should choose a similar angle to their mother)
        for (let i = 0; i < this._minions.length; i++)
        {
            this._minions[i].update(player, this._currentAngle);
        }

        // When coming to a (near) stop make a new decision
        if (this.velocity() < 10) //TODO Rename velocity
        {
            this._state = 'READY';
        }
    },

    attack: function (player)
    {
        let playerEnemyAngle = Phaser.Math.angleBetween(this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y);
        let offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI / 2; // in [-pi/4, pi/4]

        this.sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        this.sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    },

    roam: function ()
    {
        // Stay inside bounds bounds
        if (this.sprite.y < Const.INFLUENCE_RADIUS / 2)
        {
            this._currentAngle = Math.PI;
        } else if (this.sprite.y > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2)
        {
            this._currentAngle = 0;
        } else if (this.sprite.x < Const.INFLUENCE_RADIUS / 2)
        {
            this._currentAngle = Phaser.Math.HALF_PI;
        }
        else if (this.sprite.x > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2)
        {
            this._currentAngle = Math.PI + Phaser.Math.HALF_PI;
        }
        else
        {
            let offset = Math.PI / 6 * (Math.random() * 2 - 1);
            this._currentAngle = this._currentAngle + offset;
        }

        this.sprite.body.rotation = this._currentAngle;
        this.sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    },

    spawnEnemy: function ()
    {
        if (Math.random() < 0.005)
        {
            let minion = new Minion(this._game, this.sprite);
            this._minions.push(minion);
            this.group.add(minion.sprite);
        }
    },

    velocity: function ()
    {
        let x = this.sprite.body.velocity.x;
        let y = this.sprite.body.velocity.y;

        return Math.round(Math.sqrt(x * x + y * y));
    },

    playerInRange: function (player)
    {
        return Phaser.Math.distance(this.sprite.x, this.sprite.y, player.x, player.y) < Const.SIGHT_RANGE;
    }
};

export default Mother;
