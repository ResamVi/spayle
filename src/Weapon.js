module.exports = function Weapon(trackedSprite, game) {

    var Const = require('./Constants.js');

    this.fire = function() {
        var position = calculateCoordinates(-20);

        var bullet = game.add.sprite(position.x, position.y, 'bullet');
        bullet.anchor.setTo(0.5);
        bullet.angle = trackedSprite.angle + 180;
        game.physics.arcade.enable(bullet);
        
        var velocity = calculateVelocity(Const.BULLET_SPEED);        
        bullet.body.velocity.x = velocity.x;
        bullet.body.velocity.y = velocity.y;
    };

    var calculateVelocity = function (speed) {
        var velocity = {};
        
        velocity.x = Math.cos(trackedSprite.rotation + Math.PI / 2) * speed;
        velocity.y = Math.sin(trackedSprite.rotation + Math.PI / 2) * speed;

        return velocity;
    };

    var calculateCoordinates = function(radius) {    
        var xAngle = Math.cos(trackedSprite.rotation - game.math.HALF_PI);
        var yAngle = Math.sin(trackedSprite.rotation - game.math.HALF_PI);
        
        var position = {};
        position.x = trackedSprite.x + xAngle * radius;
        position.y = trackedSprite.y + yAngle * radius;

        return position;
    };

};