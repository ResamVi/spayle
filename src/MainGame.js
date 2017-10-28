import 'p2';
import 'pixi';
import 'phaser-ce';

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

game.state.start('boot');

// TODO: Center splash, warning signal [x]
// TODO: Get screen size and use that as game constraints [x]
// TOOO: insert global [x]
// TODO: Change lets to lets
// TODO: Use webpack [x]
// TODO: Combine package.json inside build [x]
// TODO: Add beeping sound to heating mode
// TODO: Add comments as JSDOC
// TODO: holding space gives bigger thrust
// TODO: Put methods into prototype
// TODO: Add .d.ts files
// TODO: Rework speed up to heated mode?