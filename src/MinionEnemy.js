import Const from './Constants';

export default function (this: any, game, mother)
{
    // This object keeps track and exposes the sprite
    let xOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    let yOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    let sprite = game.add.sprite(mother.x + xOffset, mother.y + yOffset, 'enemy_many');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'READY', 'ATTACKING', 'RETURNING', 'FOLLOWING'
    let state = 'READY';

    this.update = function (player, motherAngle)
    {

        // Decisions
        if (state === 'READY' && playerInRange(player.sprite)) {
            state = 'ATTACKING';
            attack(player);
        } else if (state === 'READY' && !closeToMother()) {
            state = 'RETURNING';
            returnBack();
        } else if (state === 'READY') {
            state = 'FOLLOWING';
            follow(motherAngle);
        }

        // When coming to a close stop make a new decision
        if (velocity() < 10) {
            state = 'READY';
        }
    };
    let returnBack = function ()
    {
        let angleToMother = Phaser.Math.angleBetween(sprite.x, sprite.y, mother.x, mother.y);
        sprite.body.rotation = angleToMother + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    let attack = function (player)
    {
        let playerEnemyAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, player.sprite.x, player.sprite.y);
        let offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI / 2; // in [-pi/4, pi/4]

        sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    let follow = function (motherAngle)
    {
        let angle;

        // Stay inside bounds bounds
        if (sprite.y < Const.INFLUENCE_RADIUS / 2) {
            angle = Math.PI;
        } else if (sprite.y > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2) {
            angle = 0;
        } else if (sprite.x < Const.INFLUENCE_RADIUS / 2) {
            angle = Phaser.Math.HALF_PI;
        } else if (sprite.x > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2) {
            angle = Math.PI + Phaser.Math.HALF_PI;

            // Random
        } else {
            angle = motherAngle + Math.PI / 6 * (Math.random() * 2 - 1);
        }
        sprite.body.rotation = angle;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    let velocity = function ()
    {
        let x = sprite.body.velocity.x;
        let y = sprite.body.velocity.y;

        return Math.round(Math.sqrt(x * x + y * y));
    };

    let playerInRange = function (player)
    {
        return Phaser.Math.distance(sprite.x, sprite.y, player.x, player.y) < Const.SIGHT_RANGE;
    };

    let closeToMother = function ()
    {
        return Phaser.Math.distance(sprite.x, sprite.y, mother.x, mother.y) < Const.INFLUENCE_RADIUS / 2;
    };

    // ----------------- DEBUG -----------------
    let debugState;
    if (Const.DEBUG_MODE) {
        debugState = game.add.bitmapText(0, -80, 'menuFont', '', 30);
        debugState.anchor.set(0.5);
        sprite.addChild(debugState);
    }
    this.debug = function ()
    {
        if (Const.DEBUG_MODE) {
            debugState.text = state;
        }
    };
};