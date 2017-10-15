var Phaser = require('phaser-ce');
var Const = require('./Constants.js');

var width = window.innerWidth;
var height = window.innerHeight;
var game = new Phaser.Game(width, height, Phaser.AUTO, '');

game.state.add('splash', require('./SplashScene.js'));
game.state.add('boot', require('./BootScene.js'));
game.state.add('load', require('./LoadScene.js'));
game.state.add('menu', require('./MenuScene.js'));
game.state.add('play', require('./PlayScene.js'));

game.state.start('splash');

// TODO: remove speed up
// TODO: keep camera shake with higher frequency, instead use "heated mode"
// TODO: holding space gives bigger thrust
// TODO: Center splash, warning signal
// TODO: Get screen size and use that as game constraints