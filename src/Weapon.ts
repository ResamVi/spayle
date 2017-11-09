import Const from './Constants';

export default function (this: any, trackedSprite: Phaser.Sprite, game: Phaser.Game)
{

    this.fire = function ()
    {
        let position = calculateCoordinates(-20);

        let bullet = game.add.sprite(position.x, position.y, 'bullet');
        bullet.anchor.setTo(0.5);
        bullet.angle = trackedSprite.angle + 180;
        game.physics.arcade.enable(bullet);

        let velocity = calculateVelocity(Const.BULLET_SPEED);
        bullet.body.velocity.x = velocity.x;
        bullet.body.velocity.y = velocity.y;
    };

    let calculateVelocity = function (speed): { x: number, y: number }
    {
        let x = Math.cos(trackedSprite.rotation + Math.PI / 2) * speed;
        let y = Math.sin(trackedSprite.rotation + Math.PI / 2) * speed;

        return {
            x: x,
            y: y
        };
    };

    let calculateCoordinates = function (radius): { x: number, y: number }
    {
        let xAngle = Math.cos(trackedSprite.rotation - Phaser.Math.HALF_PI);
        let yAngle = Math.sin(trackedSprite.rotation - Phaser.Math.HALF_PI);

        return {
            x: trackedSprite.x + xAngle * radius,
            y: trackedSprite.y + yAngle * radius
        };
    };

}
