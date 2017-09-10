const functions = {
    preload: preload,
    create: create,
    update: update,
    render: render
}

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', functions);

const ROTATION_SPEED = 100;
const THRUST_FORCE = 50000

var arrowkeys;
var space;

var player;

function preload() {
    game.load.image("sky", "res/sky.png");
    game.load.image("player", "res/player.png");
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0,0, 1920, 1920);

    game.add.sprite(0, 0, "sky");
    player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
    game.physics.p2.enable(player);

    arrowkeys = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(thrust, this);

    game.camera.follow(player, null, 0.1, 0.1);
}

function update() {
    
    player.body.thrust(100);

    if (arrowkeys.left.isDown) {
        player.body.rotateLeft(ROTATION_SPEED);
    }
    else if (arrowkeys.right.isDown) {
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


function thrust() {
    player.body.setZeroVelocity();
    player.body.thrust(THRUST_FORCE);
}
