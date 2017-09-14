module.exports = (function(){
    
    const FADE_IN_DURATION = 1000;
    const FADE_OUT_DURATION = 1000;
    const DELAY_DURATION = 1200;

    function preload() {
        this.load.image('splash','assets/splash.png');
    }

    function create() {
        this.stage.backgroundColor = '#FFFFFF';
        
        var splash = this.add.sprite(this.world.centerX, this.world.centerY, 'splash');
        splash.anchor.setTo(0.5);
        splash.alpha = 0;
        
        var tween = this.add.tween(splash);
        tween.onComplete.add(fadeOut, this);
        tween.to( { alpha: 1 }, FADE_IN_DURATION, Phaser.Easing.Linear.None, true);
        
    }

    function fadeOut(splash) {
        var tween = this.add.tween(splash);
        tween.onComplete.add(function() {
            this.stage.backgroundColor = '#000000';
            this.state.start('boot');
        }, this);
        tween.to( { alpha: 0 }, FADE_OUT_DURATION, Phaser.Easing.Linear.None, true, DELAY_DURATION);
    }
    
    return { preload: preload, create: create};
})();