module.exports = (function(){

    const PLAYER_START_Y = 270;
    const PLAYER_START_X = 205;

    var player;
    var planet;
    
    var title;
    var startButton;
    var optionButton;
    var backButton;

    var menuMusic;

    function create() {
        
        // Background
        this.add.sprite(0, 0, 'background');

        // Moon
        planet = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'moon');
        planet.anchor.setTo(0.5, 0.5);
        planet.scale.setTo(0.1, 0.1);
        planet.pivot.set(2000);

        // Player
        player = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        player.anchor.setTo(0.5);
        player.angle = 110;

        // Title
        title = this.add.bitmapText(10, 10, 'menuFont', 'SPAYLE', 80);
        title.updateTransform();
        title.anchor.setTo(0.5, 0.5);
        var centerX = this.game.width / 2 - (title.textWidth * 0.5); // TODO: Create a utils function?
        var centerY = this.game.height / 2 - (title.textHeight * 0.5);
        title.position.x = centerX + 270;
        title.position.y = centerY - 150;
        this.add.tween(title.scale).to( {x: 1.1, y: 1.1}, 2000, Phaser.Easing.Cubic.InOut, true, 10, -1, true);

        // Buttons
        startButton = createButton.call(this, 190, 80, 1.5, play, 'buttonAtlas', 'yellow_button01.png', 'yellow_button02.png', 'yellow_button01.png');
        optionButton = createButton.call(this, 190, 250, 1.5, moveDown, 'buttonAtlas', 'grey_button02.png', 'grey_button01.png', 'grey_button02.png');
        backButton = createButton.call(this, 190, 950, 1.5, moveUp, 'buttonAtlas', 'grey_button02.png', 'grey_button01.png', 'grey_button02.png');

        // Music
        menuMusic = this.add.audio('menuMusic');
        menuMusic.onDecoded.add(function() {
            menuMusic.fadeIn(5000, true);
        }, this);
    }
    
    function createButton(x, y, scale, func, atlas, onHover, onIdle, onClick) {
        var button = this.add.button(0, 0, atlas, func, this, onHover, onIdle, onClick, onIdle);
        var centerX = this.game.width / 2 - (button.width * 0.5);
        var centerY = this.game.height / 2 - (button.width * 0.5);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(scale, scale);
        button.x = centerX + x;
        button.y = centerY + y;
        return button;
    }

    function play() {
        title.destroy();
        startButton.destroy();
        optionButton.destroy();
        backButton.destroy();
        this.state.start('play', false, false, player, menuMusic);
    }

    function moveUp() {
        this.add.tween(this.camera).to({y: 0}, 1500, Phaser.Easing.Cubic.Out, true);
    }

    function moveDown() {
        this.add.tween(this.camera).to({y: 700}, 1500, Phaser.Easing.Cubic.Out, true);
    }

    function update() {
        planet.rotation += 0.005;
    }

    function render() {
        
        
    }

    return { create: create, update: update, render: render};
})();