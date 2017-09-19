module.exports = (function(){

    const Const = require('./Constants.js');

    var player;
    var planet;
    
    var title;
    var startButton;
    var optionButton;
    var backButton;

    var menuMusic;
    var startMusic;

    function create() {
        
        // Background
        this.add.sprite(0, 0, 'background');

        // Moon
        planet = this.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'moon');
        planet.anchor.setTo(0.5, 0.5);
        planet.scale.setTo(0.1, 0.1);
        planet.pivot.set(Const.ORBIT_RADIUS);

        // Player
        player = this.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'player');
        player.anchor.setTo(0.5);
        player.angle = Const.PLAYER_START_ANGLE;

        // Title
        title = this.add.bitmapText(0, 0, 'menuFont', 'SPAYLE', 80);
        title.updateTransform();
        title.anchor.setTo(0.5, 0.5);
        var centerX = this.game.width / 2 - (title.textWidth * 0.5); // TODO: Create a utils function?
        var centerY = this.game.height / 2 - (title.textHeight * 0.5);
        title.position.x = centerX + Const.TITLE_X_OFFSET;
        title.position.y = centerY - Const.TITLE_Y_OFFSET;
        this.add.tween(title.scale).to( ...Const.TITLE_BOUNCE);

        // Buttons
        startButton = createButton.call(this, Const.BUTTON_X, 80, 1.5, play, 'buttonAtlas', ...Const.START_BUTTON);
        optionButton = createButton.call(this, Const.BUTTON_X, 250, 1.5, moveDown, 'buttonAtlas', ...Const.OPTION_BUTTON);
        backButton = createButton.call(this, Const.BUTTON_X, 950, 1.5, moveUp, 'buttonAtlas', ...Const.OPTION_BUTTON);

        // Music
        menuMusic = this.add.audio('menuMusic');
        menuMusic.onDecoded.add(function() {
            menuMusic.fadeIn(Const.AUDIO_FADE_DURATION, true);
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
        
        for(var sprite of [title, startButton, optionButton, backButton]) {
            var t = this.add.tween(sprite).to(...Const.FADE_OUT);
            t.onComplete.add(function(invisibleSprite) {
                invisibleSprite.destroy();
            });
        }

        menuMusic.fadeOut(1000);

        startMusic = this.add.audio('startMusic');
        startMusic.onDecoded.add(function() {
            startMusic.fadeIn(Const.AUDIO_FADE_DURATION);
        }, this);

        menuMusic = this.add.audio('ignition');
        menuMusic.onDecoded.add(function() {
            menuMusic.play();
        }, this);
        menuMusic.onStop.add(function() {
            this.state.start('play', false, false, player, menuMusic);
        }, this);
        
    }

    function moveUp() {
        this.add.tween(this.camera).to(...Const.OPTION_MENU);
    }

    function moveDown() {
        this.add.tween(this.camera).to(...Const.MAIN_MENU);
    }

    function update() {
        planet.rotation += Const.ORBIT_SPEED;
    }

    function render() {
        
        
    }

    return { create: create, update: update, render: render};
})();