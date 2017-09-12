module.exports = (function(){
    
    const ROTATION_SPEED = 100;
    const THRUST_FORCE = 50000;
    const PLAYER_START_Y = 120;
    const PLAYER_START_X = 210;
    
    var arrowkeys;
    var wasd;
    
    var player;
    
    function create() {

        // Sprites
        game.add.sprite(0, 0, 'background');
        player = game.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        game.physics.p2.enable(player);
    
        // Controls
        arrowkeys = game.input.keyboard.createCursorKeys();
        wasd = {
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A)
        };
    
        var thrust = function() {
            player.body.setZeroVelocity();
            player.body.thrust(THRUST_FORCE);
        }

        game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(thrust, this);
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(thrust, this);
    
        game.camera.follow(player, null, 0.1, 0.1);
    }
    
    function update() {
        player.body.thrust(100);
    
        if (arrowkeys.left.isDown || wasd.left.isDown) {
            player.body.rotateLeft(ROTATION_SPEED);
        }
        else if (arrowkeys.right.isDown || wasd.right.isDown) {
            player.body.rotateRight(ROTATION_SPEED);
        }else{
            player.body.setZeroRotation();
        }
    }
    
    function render() {
        //game.debug.spriteInfo(player, 32, 32);
        var x = player.body.velocity.x;
        var y = player.body.velocity.y;
        
        game.debug.text(Math.sqrt(x*x + y*y) , 10, 10);
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }

    return { create: create, update: update, render: render};
})();