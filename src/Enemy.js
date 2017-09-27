module.exports = function Enemy(game) {

    // To use constants in this module
    var Const = require('./Constants.js');

    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(2000, 400, 'enemy_boss');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'ready', 'attacking'
    var state = 'ready';

    // Group stays inside this circle
    var graphics = game.add.graphics(0, 0);

    this.update = function(player)
    {
        graphics.clear();
        graphics.beginFill(0xff6500);
        graphics.drawCircle(sprite.x, sprite.y, 1500);
        graphics.endFill();

        if(state === 'ready' && playerInRange(player.sprite)) {
            state = 'attacking';
            attack(player);
        }

        if(velocity() < 10) {
            state = 'ready';
        }
    };

    var attack = function(player)
    {
        var playerEnemyAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, player.sprite.x, player.sprite.y)
        var offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI/2; // in [-pi/4, pi/4]
        
        sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
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