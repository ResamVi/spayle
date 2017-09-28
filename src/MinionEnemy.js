module.exports = function MinionEnemy(game, mother) {
    
    // To use constants in this module
    var Const = require('./Constants.js');

    // This object keeps track and exposes the sprite
    var sprite = game.add.sprite(2000, 400, 'enemy_many');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'ready', 'attacking', 'returning'
    var state = 'ready';

    this.update = function(player)
    {
        // Decisions
        if(state === 'ready' && playerInRange(player.sprite)) {
            state = 'attacking';
            attack(player);
        }else if(state === 'ready' && !closeToMother()) {
            state = 'returning';
            returnBack();
        }else if(state === 'ready') {
            state = 'roam';
            roam();
        }

        // When coming to a close stop make a new decision
        if(velocity() < 10) {
            state = 'ready';
        }
    };
    var returnBack = function() {
        var angleToMother = Phaser.Math.angleBetween(sprite.x, sprite.y, mother.sprite.x, mother.sprite.y);
        sprite.body.rotation = angleToMother + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    var attack = function(player)
    {
        var playerEnemyAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, player.sprite.x, player.sprite.y);
        var offset = Math.random() * Phaser.Math.HALF_PI - Phaser.Math.HALF_PI/2; // in [-pi/4, pi/4]
        
        sprite.body.rotation = playerEnemyAngle + offset + Phaser.Math.HALF_PI;
        sprite.body.thrust(Const.ENEMY_THRUST_FORCE);
    };

    var roam = function()
    {   
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

    var velocity = function()
    {
        var x = sprite.body.velocity.x;
        var y = sprite.body.velocity.y;
        
        return Math.round(Math.sqrt(x * x, y * y));
    };

    var playerInRange = function(player)
    {
        return Phaser.Math.distance(sprite.x, sprite.y, player.x, player.y) < Const.INFLUENCE_RADIUS;
    };

    var closeToMother = function()
    {
        return Phaser.Math.distance(sprite.x, sprite.y, mother.sprite.x, mother.sprite.y) < Const.SIGHT_RANGE;
    };
};