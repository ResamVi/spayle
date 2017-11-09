import Const from './Constants';
import Player from './Player';
import Mother from './Mother';
import Hud from './HUD';

export default function(game : Phaser.Game)
{
    let arrowkeys : any;

    let player : Player;
    let enemy : any;
    let hud : any;
    /* let line; */

    let mainMusic : Phaser.Sound;

    function create()
    {
        player = new Player(game);
        enemy = new Mother(game);
        hud = new Hud(game, player, enemy);

        // game.global = {enemies: enemy};

        /* line = game.add.sprite(game.camera.width/2, game.game.height/2, 'line');
        hud.add(line); */

        // Music
        mainMusic = game.add.audio('mainMusic');
        mainMusic.onDecoded.add(function() {
            mainMusic.play('', 0, 1, true);
        }, game);

        // Controls
        arrowkeys = game.input.keyboard.createCursorKeys();
        console.log(player);
        game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(player.loseControl, player, 1, Const.STUN_DURATION);
        game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(player.superThrust, player);
        game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(player.snipe, player);
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(player.thrust, player);
        game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function() {
            game.add.tween(game.camera.scale).to({x: 1, y: 1}, 7000, Phaser.Easing.Cubic.InOut, true);
        }, game);

        game.camera.follow(player.sprite, undefined, 0.5, 0.5);

        // Launch rocket away to start game
        player.body.thrust(Const.LAUNCH_FORCE);
    }

    function update()
    {
        player.update();

        // Put logic into player object
        if (!player.isSpinning && arrowkeys.left.isDown)
        {
            player.body.rotateLeft(Const.ROTATION_SPEED);
        }
        else if (!player.isSpinning && arrowkeys.right.isDown)
        {
            player.body.rotateRight(Const.ROTATION_SPEED);
        }
        else if (!player.isSpinning)
        {
            player.body.setZeroRotation();
        }

        enemy.update(player);
        hud.update();

        // ---------------------------------- DEBUG ----------------------------------
        /* line.rotation = Phaser.Math.angleBetween(player.sprite.x, player.sprite.y, enemy.sprite.x, enemy.sprite.y); */
        game.world.bringToTop(enemy.sprite); // TODO: Debug only
        if (Const.DEBUG_MODE)
        {
            if (arrowkeys.up.isDown)
            {
                game.camera.y -= Const.CAM_SPEED;
            }
            else if (arrowkeys.down.isDown)
            {
                game.camera.y += Const.CAM_SPEED;
            }

            if (arrowkeys.left.isDown)
            {
                game.camera.x -= Const.CAM_SPEED;
            }
            else if (arrowkeys.right.isDown)
            {
                game.camera.x += Const.CAM_SPEED;
            }
        }
    }

    function render()
    {
        if (Const.DEBUG_MODE) {
            /* game.game.camera.scale.setTo(0.5); */
            /* game.game.camera.unfollow(); */

            let x = player.body.velocity.x;
            let y = player.body.velocity.y;
            let v = Math.round(Math.sqrt(x * x + y * y));

            enemy.debug();

            game.debug.text('Play coordinates: ' + Math.round(player.sprite.x) + ', ' + Math.round(player.sprite.y), 32, 510);
            game.debug.text('Camera coordinates: ' + game.camera.x + ', ' + game.camera.x, 32, 530);
            game.debug.text('Player velocity: ' + v , 32, 550);
        }
    }

    return {create: create, update: update, render: render};
}
