/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

let Const = {} as any;
Const = {

    GAME_HEIGHT: 600,
    GAME_WIDTH: 800,
    CENTER_CAMERA_X: 300,
    CENTER_CAMERA_Y: 400,

    // DEBUG MODE
    DEBUG_MODE: true,
    CAM_SPEED: 16,

    // BootScene Constants
    MAP_SIZE: 10000,

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
    START_BUTTON: ['yellow_button01.png',
                   'yellow_button02.png', 'yellow_button01.png'],

    OPTION_BUTTON: ['grey_button02.png',
                    'grey_button01.png', 'grey_button02.png'],
    VISIBLE: 1,
    INVISIBLE: 0,

    TITLE_BOUNCE: [{x: 1.1, y: 1.1},
                2000, Phaser.Easing.Cubic.InOut, true, 10, -1, true],

    MAIN_MENU: [{y: 0}, 1500, Phaser.Easing.Cubic.Out, true],
    OPTION_MENU: [{y: 700}, 1500, Phaser.Easing.Cubic.Out, true],

    // PlayScene Constants
    ROTATION_SPEED: 100,
    THRUST_FORCE: 50000,
    LAUNCH_FORCE: 100000,
    SPAWN_DISTANCE: -20,
    TOO_FAST: 1,
    INSTABILITY_THRESHOLD: 1,
    STUN_DURATION: 2000,

    // Player Constants
    WARNING_RADIUS: 2000,
    SHAKE_DURATION: 2000,
    SPIN_AMOUNT: 1000,
    MINIMUM_SPEED: 100,

    SMALL_EXPLOSION: 2,
    SMALL_EXPLOSION_DISTANCE: -20,
    BIG_EXPLOSION: 6,
    BIG_EXPLOSION_DISTANCE: -20,

    EXPLODE_ANIMATION_SETTINGS: [
        'explode',
        Phaser.Animation.generateFrameNames('explosion/ex', 0, 13, '.png', 1),
        60,
        false,
        true],

    ANIMATION_PARAMS: [ 'aim', Phaser.Animation.generateFrameNames('dotted_line', 0, 13, '.png', 4), 60, true, true],
    STOPPING_PARAMS: [{x: 0, y: 0}, 300, Phaser.Easing.Cubic.Out, true],

    UPDATE_INTERVAL: 1000,
    SUPER_THRUST_STUN_DURATION: 800,

    BULLET_SPEED: 800,
    AIM_BACKWARDS: 90,
    RECOIL_FORCE: 20000,
    RECOVER_TIME: 100,
    MAGAZINE_SIZE: 3,

    // Enemy Constants
    SIGHT_RANGE: 500,
    ENEMY_THRUST_FORCE: 5000,
    INFLUENCE_RADIUS: 1500,

    // Comments
    LIFT_OFF: [
        'Succesful lift-off!',
        'So long, Earth!',
        'To infinity and beyond!'],
    COMMENT_TIME_SHOWN: 2000,
};

export default Const;
