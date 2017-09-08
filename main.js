const functions = {
    preload: preload,
    create: create,
    update: update,
    render: render
}

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', functions);

const ROTATION_SPEED = 40;

var controls;
var player;

function preload() {
    game.load.image("sky", "res/sky.png");
    game.load.image("player", "res/player.png");
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.add.sprite(0, 0, "sky");
    
    player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
    game.physics.p2.enable(player);

    controls = game.input.keyboard.createCursorKeys();
}

function update() {
    
    player.body.thrust(100);

    if (controls.left.isDown) {
        player.body.rotateLeft(ROTATION_SPEED);
    }
    else if (controls.right.isDown) {
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
}



