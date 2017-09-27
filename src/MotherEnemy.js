module.exports = function MotherEnemy(game) {

    // To use constants in this module
    var Const = require('./Constants.js');

    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(2000, 800, 'enemy_boss');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'ready', 'moving', 'attacking'
    var state = 'ready';

    // Group stays inside this circle
    var graphics = game.add.graphics(0, 0);
    graphics.boundsPadding = 10;

    this.update = function(player)
    {
        graphics.clear();
        graphics.beginFill(0xff6500);
        graphics.drawCircle(sprite.x, sprite.y, Const.INFLUENCE_RADIUS);
        graphics.endFill();

        if(state === 'ready' && playerInRange(player.sprite)) {
            state = 'attacking';
            attack(player);
        }else if(state === 'ready') {
            state = 'moving';
            moving();
        }
        
        if(velocity() < 10) {
            state = 'ready';
        }
    };

    var attack = function(player)
    {
        var playerEnemyAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, player.sprite.x, player.sprite.y);
        var offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI/2; // in [-pi/4, pi/4]
        
        sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    var moving = function()
    {
        console.log(sprite.x + ", " + sprite.y);
        
        // Stay inside bounds bounds
        if(sprite.y < Const.INFLUENCE_RADIUS/2) {
            sprite.body.rotation = Math.PI;
        } else if(sprite.y > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS/2) {
            sprite.body.rotation = 0;
        } else if(sprite.x < Const.INFLUENCE_RADIUS/2) {
            sprite.body.rotation = Phaser.Math.HALF_PI;
        } else if(sprite.x > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS/2) {
            sprite.body.rotation = Math.PI + Phaser.Math.HALF_PI;
        
        // Random
        }else {
            sprite.body.rotation = Phaser.Math.PI2 * Math.random() - Math.PI;
        }
        
        
        
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    var spawnEnemy = function()
    {

    };

    var velocity = function()
    {
        var x = sprite.body.velocity.x;
        var y = sprite.body.velocity.y;
        
        return Math.round(Math.sqrt(x * x, y * y));
    };

    var playerInRange = function(player)
    {
        return Phaser.Math.distance(sprite.x, sprite.y, player.x, player.y) < Const.SIGHT_RANGE;
    };
};