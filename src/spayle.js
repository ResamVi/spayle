var Phaser = require('phaser-ce');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '')

game.state.add('boot', require('./boot.js'))
game.state.add('load', require('./load.js'))
game.state.add('play', require('./play.js'));

game.state.start('boot');
