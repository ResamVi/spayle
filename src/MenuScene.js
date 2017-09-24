module.exports = (function(){

    const Const = require('./Constants.js');
    const Player = require('./Player.js');

    var player;
    var planet;
    
    var title;
    var startButton;
    var optionButton;
    var backButton;

    var menuMusic;
    var startMusic;

    var centerX;
    var centerY;

    function create()
    {    
        // Center of screen (not the world!)
        centerX = this.camera.width / 2;
        centerY = this.camera.height / 2;

        // Background
        this.add.sprite(0, 0, 'background');

        // Moon
        planet = this.add.sprite(Const.PLAYER_START_X, Const.PLAYER_START_Y, 'moon');
        planet.anchor.setTo(0.5, 0.5);
        planet.scale.setTo(0.1, 0.1);
        planet.pivot.set(Const.ORBIT_RADIUS);

        // Player (only used for displayal; not to actually control)
        player = new Player(this);

        // Title
        title = this.add.bitmapText(0, 0, 'menuFont', 'SPAYLE', 80);
        title.updateTransform();
        title.anchor.setTo(0.5, 0.5);
        title.position.x = centerX + Const.TITLE_X_OFFSET;
        title.position.y = centerY - Const.TITLE_Y_OFFSET;
        this.add.tween(title.scale).to( ...Const.TITLE_BOUNCE);

        // Buttons
        startButton = createButton.call(this, 0, 1.5, play, 'buttonAtlas', ...Const.START_BUTTON);
        optionButton = createButton.call(this, 120, 1.5, moveDown, 'buttonAtlas', ...Const.OPTION_BUTTON);
        backButton = createButton.call(this, 850, 1.5, moveUp, 'buttonAtlas', ...Const.OPTION_BUTTON);

        // Music
        menuMusic = this.add.audio('menuMusic');
        menuMusic.onDecoded.add(function() {
            menuMusic.fadeIn(Const.AUDIO_FADE_DURATION, true);
        }, this);
    }
    
    function createButton(y, scale, func, atlas, onHover, onIdle, onClick) {
        var button = this.add.button(0, 0, atlas, func, this, onHover, onIdle, onClick, onIdle);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(scale, scale);
        button.x = centerX + Const.BUTTON_X;
        button.y = centerY + y;
        return button;
    }

    function play()
    {
        // Scale camera out for dramatic effect
        this.add.tween(this.camera.scale).to({x: 0.5, y: 0.5}, 7000, Phaser.Easing.Cubic.InOut, true);

        // Fade out all menu items
        for(var sprite of [title, startButton, optionButton, backButton]) {
            var t = this.add.tween(sprite).to(...Const.FADE_OUT);
            t.onComplete.add(function(invisibleSprite) {
                invisibleSprite.destroy();
            });
        }

        // Change music and start count down
        menuMusic.fadeOut(1000);
        
        startMusic = this.add.audio('startMusic');
        startMusic.onDecoded.add(function() {
            startMusic.fadeIn(Const.AUDIO_FADE_DURATION);
        }, this);

        var countdown = this.add.audio('ignition');
        countdown.onDecoded.add(function() {
            countdown.play();
        }, this);
        countdown.onStop.add(function() {
            player.destroy();
            this.state.start('play', false, false);
        }, this);
        
    }

    function moveUp()
    {
        this.add.tween(this.camera).to(...Const.MAIN_MENU);
    }

    function moveDown()
    {
        this.add.tween(this.camera).to(...Const.OPTION_MENU);
    }

    function update()
    {
        planet.rotation += Const.ORBIT_SPEED;
    }

    return { create: create, update: update};
})();