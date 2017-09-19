module.exports = {
    
    // DEBUG MODE
    DEBUG_MODE: true,

    // MenuScene Constants
    PLAYER_START_Y: 270,
    PLAYER_START_X: 205,
    PLAYER_START_ANGLE: 110,

    LOADBAR_WIDTH: 320,
    LOADBAR_OFFSET: 20,

    AUDIO_FADE_DURATION: 4000,

    FADE_OUT: [{alpha: 0}, 1000, Phaser.Easing.Cubic.InOut, true, 0],

    ORBIT_SPEED: 0.005,
    ORBIT_RADIUS: 2000,
    
    TITLE_X_OFFSET: 180,
    TITLE_Y_OFFSET: 150,

    BUTTON_X: 180,
    START_BUTTON: ['yellow_button01.png', 'yellow_button02.png', 'yellow_button01.png'],
    OPTION_BUTTON: ['grey_button02.png', 'grey_button01.png', 'grey_button02.png'],
    INVISIBLE: 0,

    TITLE_BOUNCE: [{x: 1.1, y: 1.1}, 2000, Phaser.Easing.Cubic.InOut, true, 10, -1, true],
    MAIN_MENU: [{y: 0}, 1500, Phaser.Easing.Cubic.Out, true],
    OPTION_MENU: [{y: 700}, 1500, Phaser.Easing.Cubic.Out, true],
    
    // PlayScene Constants
    ROTATION_SPEED: 100,
    THRUST_FORCE: 50000,
    LAUNCH_FORCE: 100000,
    SPAWN_DISTANCE: -20,
    SPEED_UP_FREQUENCY: 1,
    INSTABILITY_THRESHOLD: 2,
};