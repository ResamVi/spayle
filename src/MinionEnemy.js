module.exports = function MinionEnemy(game, mother) {
    
    // To use constants in this module
    var Const = require('./Constants.js');

    // This object keeps track and exposes the sprite
    var xOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    var yOffset = 400 * (Math.random() / 2 + 0.2) * Math.pow(-1, Math.round(Math.random()));
    var sprite = game.add.sprite(mother.sprite.x + xOffset, mother.sprite.y + yOffset, 'enemy_many');
    sprite.anchor.setTo(0.5);
    this.sprite = sprite;

    // Grant access to this object's physics body
    game.physics.p2.enable(sprite);
    sprite.body.damping = 0.8;
    sprite.body.fixedRotation = true;
    this.body = sprite.body;

    // Possible states: 'ready', 'attacking', 'returning', 'following'
    var state = 'ready';

    this.update = function(player, motherAngle)
    {
        
        // Decisions
        if(state === 'ready' && playerInRange(player.sprite)) {
            state = 'attacking';
            attack(player);
        }else if(state === 'ready' && !closeToMother()) {
            state = 'returning';
            returnBack();
        }else if(state === 'ready') {
            state = 'following';
            follow(motherAngle);
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

    var follow = function(motherAngle)
    {   
        var angle;
        
        // Stay inside bounds bounds
        if (sprite.y < Const.INFLUENCE_RADIUS/2) {
            angle = Math.PI;
        } else if(sprite.y > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS/2) {
            angle = 0;
        } else if(sprite.x < Const.INFLUENCE_RADIUS/2) {
            angle = Phaser.Math.HALF_PI;
        } else if(sprite.x > Const.WORLD_BOUNDS - Const.INFLUENCE_RADIUS/2) {
            angle = Math.PI + Phaser.Math.HALF_PI;
        
        // Random
        } else {
            angle = motherAngle + Math.PI/6 * (Math.random() * 2 - 1);
        }
        sprite.body.rotation = angle;
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

    var closeToMother = function()
    {
        return Phaser.Math.distance(sprite.x, sprite.y, mother.sprite.x, mother.sprite.y) < Const.INFLUENCE_RADIUS/2;
    };
};