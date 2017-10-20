import MinionEnemy from './MinionEnemy';
import Const from './Constants';

export default function (this: any, game: Phaser.Game)
{
    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(2000, 2000, 'enemy_boss');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'READY', 'ROAM', 'ATTACKING'
    var state = 'READY';

    // Group stays inside this circle
    var graphics = game.add.graphics(0, 0);
    graphics.boundsPadding = 10;

    // Each mother gets 3 minions to start with
    var minions: any[] = [];
    var group = game.add.group();
    for (var i = 0; i < 3; i++) {
        var minion = new MinionEnemy(game, sprite);
        minions.push(minion);
        group.add(minion.sprite);
    }
    this.group = group;

    // Select a random angle to start travelling
    var currentAngle = Phaser.Math.PI2 * Math.random() - Math.PI;

    this.update = function (player)
    {
        graphics.clear();
        graphics.beginFill(0xff6500);
        graphics.drawCircle(sprite.x, sprite.y, Const.INFLUENCE_RADIUS);
        graphics.endFill();

        // Possible decisions
        if (state === 'READY' && playerInRange(player.sprite)) {
            state = 'ATTACKING';
            attack(player);
        } else if (state === 'READY') {
            state = 'ROAM';
            roam();
        }

        spawnEnemy();

        // Update its minions (they should choose a similar angle to their mother)
        for (var i = 0; i < minions.length; i++) {
            minions[i].update(player, currentAngle);
        }

        // When coming to a (near) stop make a new decision
        if (velocity() < 10) {
            state = 'READY';
        }
    };

    var attack = function (player)
    {
        var playerEnemyAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, player.sprite.x, player.sprite.y);
        var offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI / 2; // in [-pi/4, pi/4]

        sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    var roam = function ()
    {
        // Stay inside bounds bounds
        if (sprite.y < Const.INFLUENCE_RADIUS / 2) {
            currentAngle = Math.PI;
        } else if (sprite.y > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2) {
            currentAngle = 0;
        } else if (sprite.x < Const.INFLUENCE_RADIUS / 2) {
            currentAngle = Phaser.Math.HALF_PI;
        } else if (sprite.x > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS / 2) {
            currentAngle = Math.PI + Phaser.Math.HALF_PI;

            // Random
        } else {
            var offset = Math.PI / 6 * (Math.random() * 2 - 1);
            currentAngle = currentAngle + offset;
        }

        sprite.body.rotation = currentAngle;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    var spawnEnemy = function ()
    {
        if (Math.random() < 0.005) {
            var minion = new MinionEnemy(game, sprite);
            minions.push(minion);
            group.add(minion.sprite);
        }
    };

    var velocity = function ()
    {
        var x = sprite.body.velocity.x;
        var y = sprite.body.velocity.y;

        return Math.round(Math.sqrt(x * x + y * y));
    };

    var playerInRange = function (player)
    {
        return Phaser.Math.distance(sprite.x, sprite.y, player.x, player.y) < Const.SIGHT_RANGE;
    };

    // ----------------- DEBUG -----------------
    var debugState;
    if (Const.DEBUG_MODE) {
        debugState = game.add.bitmapText(0, -80, 'menuFont', '', 30);
        debugState.anchor.set(0.5);
        sprite.addChild(debugState);
    }
    this.debug = function ()
    {
        if (Const.DEBUG_MODE) {
            debugState.text = state;
            for (var i = 0; i < minions.length; i++) {
                minions[i].debug();
            }
        }
    };
};