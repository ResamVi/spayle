module.exports = function Enemy(game) {

    // To use constants in this module
    var Const = require('./Constants.js');

    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(600, 400, 'enemy_many');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    /* sprite.body.angularDamping = 0;
    sprite.body.angularVelocity = Math.random() * 10 - 5; */
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'ready'
    var state = 'ready';

    this.update = function(player)
    {
        console.log(velocity());
        sprite.body.rotation = 0;
        if(state === 'ready' && playerInRange(player.sprite)) {
            state = 'moving';
            move(player);
        }

        if(velocity() < 10) {
            state = 'ready';
        }
    };

    var move = function(player)
    {
        if(Math.random() >= 0.5) {
            if(player.sprite.x - sprite.x > 0) {
                sprite.body.thrustRight(10000);
            }else{
                sprite.body.thrustLeft(10000);
            }
        }else {
            if(player.sprite.y - sprite.y > 0) {
                sprite.body.thrust(-10000);
            }else{
                sprite.body.thrust(10000);
            }
        }
        
        
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