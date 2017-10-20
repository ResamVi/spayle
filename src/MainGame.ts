import * as Phaser from 'phaser-ce';

import startBooting from './BootScene';
import displaySplash from './SplashScene';
import loadAssets from './LoadScene';
import showMenu from './MenuScene';
import playGame from './PlayScene';

let width = window.innerWidth;
let height = window.innerHeight;
let game = new Phaser.Game(width, height, Phaser.AUTO, '');

game.state.add('splash', displaySplash(game));
game.state.add('boot', startBooting(game));
game.state.add('load', loadAssets(game));
game.state.add('menu', showMenu(game));
game.state.add('play', playGame(game));

game.state.start('splash');

// TODO: remove speed up
// TODO: keep camera shake with higher frequency, instead use "heated mode"
// TODO: holding space gives bigger thrust
// TODO: Center splash, warning signal
// TODO: Get screen size and use that as game constraints
// TODO: Change vars to lets
// TODO: Use webpack
// TODO: Combine package.json inside build