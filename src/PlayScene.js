module.exports = (function() 
{
    
    var Const = require('./Constants.js');
    var Player = require('./Player.js');
    var MotherEnemy = require('./MotherEnemy.js');
    var Hud = require('./Hud.js');

    var arrowkeys;
    
    var player;
    var enemy;
    
    var hud;
    /* var line; */

    var mainMusic;

    function create()
    {
        player = new Player(this);
        enemy = new MotherEnemy(this);
        hud = new Hud(this, player, enemy);

        /* line = this.add.sprite(this.camera.width/2, this.game.height/2, 'line');
        hud.add(line); */
        
        // Music
        mainMusic = this.add.audio('mainMusic');
        mainMusic.onDecoded.add(function() {
            mainMusic.play('', 0, 1, true);
        }, this);

        // Controls
        arrowkeys = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(player.loseControl, this, 0, Const.STUN_DURATION);
        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(player.superThrust, this);
        this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(player.snipe, this);
        this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(player.thrust, this);
        this.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function() {
            this.add.tween(this.camera.scale).to({x: 1, y: 1}, 7000, Phaser.Easing.Cubic.InOut, true);
        }, this);
        
        this.camera.follow(player.sprite, null, 0.5, 0.5);

        // Launch rocket away to start game
        player.body.thrust(Const.LAUNCH_FORCE);
    }
    
    
    function update() 
    {
        player.update();

        if (!player.isSpinning() && arrowkeys.left.isDown) // Put logic into player object
            player.body.rotateLeft(Const.ROTATION_SPEED);
        else if (!player.isSpinning() && arrowkeys.right.isDown)
            player.body.rotateRight(Const.ROTATION_SPEED);
        else if (!player.isSpinning())
            player.body.setZeroRotation();

        enemy.update(player);

        hud.update();

        // ---------------------------------- DEBUG ----------------------------------
        /* line.rotation = Phaser.Math.angleBetween(player.sprite.x, player.sprite.y, enemy.sprite.x, enemy.sprite.y); */
        this.world.bringToTop(enemy.sprite); // TODO: Debug only
        if(Const.DEBUG_MODE) {
            if (arrowkeys.up.isDown) {
                this.camera.y -= Const.CAM_SPEED;
            }
            else if (arrowkeys.down.isDown) {
                this.camera.y += Const.CAM_SPEED;
            }
        
            if (arrowkeys.left.isDown) {
                this.camera.x -= Const.CAM_SPEED;
            }
            else if (arrowkeys.right.isDown) {
                this.camera.x += Const.CAM_SPEED;
            }
        }
    }

    function render()
    {
        if(Const.DEBUG_MODE) {
            /* this.game.camera.scale.setTo(0.5); */
            /* this.game.camera.unfollow(); */

            var x = player.body.velocity.x;
            var y = player.body.velocity.y;
            var v = Math.round(Math.sqrt(x*x + y*y));

            enemy.debug();

            this.game.debug.text('Play coordinates: ' + Math.round(player.sprite.x) + ', ' + Math.round(player.sprite.y), 32, 510);
            this.game.debug.text('Camera coordinates: ' + this.game.camera.x + ', ' + this.game.camera.x, 32, 530);
            this.game.debug.text('Player velocity: ' + v , 32, 550);
        }
    }

    return {create: create, update: update, render: render};
})();