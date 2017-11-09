/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import Const from './Constants';
/**
 * Contains all the HUD elements and contains interfaces
 * for changes and interactions.
 *
 * @param  {Phaser.Game} game - A reference to the currently running game
 * @param  {Player} player - A reference to the player to access its status
 * @param  {any} enemy - TODO: Use global enemy
 */
function HUD(game: Phaser.Game, player: Player, enemy: any)  // TODO: .d.ts file
{
    /**
     * @property {any} - Reference to the player
     */
    this._player = player;

    /**
     * @property {any} - Reference to the enemy
     */
    this._enemy = enemy;

    /**
     * @property {Phaser.Group} - Container for all HUD elements
     */
    this._hud = game.add.group();
    this._hud.fixedToCamera = true;

    /**
     * @property {Phaser.Sprite} - The warning logo for close proximity of enemies
     */
    this._warning = game.add.sprite(game.camera.width / 2, game.camera.height / 1.1 , 'warning');
    this._warning.anchor.setTo(0.5);
    this._hud.add(this._warning);

    /**
     * @property {Phaser.Sprite} - Arrow pointing at the closest enemy when in proximity
     */
    this._arrow = game.add.sprite(game.camera.width / 2, game.height / 2, 'arrow');
    this._arrow.anchor.setTo(0.5);
    this._hud.add(this._arrow);

    /**
     * @property {Phaser.BitmapText} - Comments at the top of the screen
     */
    this._comments = game.add.bitmapText(game.camera.width / 2, 20, 'font', '', 20);
    this._comments.anchor.setTo(0.5);
    this._hud.add(this._comments);

    // Start off with a comment
    game.time.events.add(100, function ()
    {
        let beep = game.add.audio('roger');
        beep.volume = 0.5;
        beep.play();

        // Text appear
        this._comments.text = Const.LIFT_OFF[Math.floor(Math.random() * Const.LIFT_OFF.length)];

        // Text disappear
        game.time.events.add(Const.COMMENT_TIME_SHOWN, function ()
        {
            this._comments.text = '';
        }, this);

    }, this);
}

/**
 * All the functions
 *
 * @method
 */
HUD.prototype = {

    /**
     * Has to be called each frame
     * @method
     */
    update: function()
    {
        this.focusPointer(this.getNearestEnemy());
    },

    /**
     * Display new text at the top of the screen, handles fade in and fade out times
     * @method
     */
    giveComment: function()
    {
        // game.time.events.add(Math.random() * 5000, function() {
        //
        //     // Text appear
        //     this._comments.text = Const.IDLE[Math.floor(Math.random() * Const.IDLE.length)];
        //
        //     // Text disappear
        //     game.time.events.add(Const.COMMENT_TIME_SHOWN, function() {
        //         this._comments.text = '';
        //     });
        // }, this);
    },

    /**
     * Calculate which enemy is closest
     *
     * @returns {any} - closest enemy to the ship
     * @method
     */
    getNearestEnemy: function()
    {
        let shortestDistance = Number.POSITIVE_INFINITY;
        let closestEnemy;

        this._enemy.group.forEach(function (child)
        {
            let d = Phaser.Math.distance(this._player.sprite.x, this._player.sprite.y, child.x, child.y);
            if (d < shortestDistance)
            {
                shortestDistance = d;
                closestEnemy = child;
            } 
        }, this);

        if (shortestDistance < Const.WARNING_RADIUS)
        {
            return closestEnemy;
        }
    },

    /**
     * Calculates the angle and position of the arrow to point at the enemy
     *
     * @param {any} - Enemy to point at
     * @method
     */
    focusPointer: function (enemy)
    {
        // TODO: REDO:
        /*if (this._enemy === undefined)
        {
            this._warning.alpha = 0;
            this._arrow.alpha = 0;
            return;
        }
        else
        {
            this._warning.alpha = 1;
            this._arrow.alpha = 1;
        }

        // Angle TODO: those parameters man...
        this._arrow.rotation = Phaser.Math.angleBetween(this._player.sprite.x,
                                                        this._player.sprite.y,
                                                        this._enemy.x,
                                                        this._enemy.y);

        // Y Coord
        let ySlope = (this._enemy.y - this._player.sprite.y) / Math.abs(this._enemy.x - this._player.sprite.x);
        let yCoord = ySlope * Const.GAME_WIDTH / 2 + Const.CENTER_CAMERA_X;

        if (yCoord < 7)
        {
            this._arrow.y = 7;
        }
        else if (yCoord > Const.GAME_HEIGHT)
        {
            this._arrow.y = Const.GAME_HEIGHT - 7;
        }
        else
        {
            this._arrow.y = yCoord;
        }

        // X Coord
        let xSlope = Math.abs(this._enemy.y - this._player.sprite.y) / (this._enemy.x - this._enemy.sprite.x);
        let xCoord = (Const.GAME_HEIGHT * 0.5) / xSlope + Const.CENTER_CAMERA_Y;

        if (xCoord > Const.GAME_WIDTH)
        {
            this._arrow.x = Const.GAME_WIDTH - 7;
        }
        else if (xCoord < 7)
        {
            this._arrow.x = 7;
        }
        else
        {
            this._arrow.x = xCoord;
        }*/
    }
};

export default HUD;
