var Phaser = require('phaser-ce');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('splash', require('./SplashScene.js'));
game.state.add('boot', require('./BootScene.js'));
game.state.add('load', require('./LoadScene.js'));
game.state.add('menu', require('./MenuScene.js'));
game.state.add('play', require('./PlayScene.js'));

game.state.start('boot');
