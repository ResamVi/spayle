"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Phaser = require("phaser-ce");
var BootScene_1 = require("./BootScene");
var SplashScene_1 = require("./SplashScene");
var LoadScene_1 = require("./LoadScene");
var MenuScene_1 = require("./MenuScene");
var PlayScene_1 = require("./PlayScene");
var width = window.innerWidth;
var height = window.innerHeight;
var game = new Phaser.Game(width, height, Phaser.AUTO, '');
game.state.add('splash', SplashScene_1.default(game));
game.state.add('boot', BootScene_1.default(game));
game.state.add('load', LoadScene_1.default(game));
game.state.add('menu', MenuScene_1.default(game));
game.state.add('play', PlayScene_1.default(game));
game.state.start('splash');
// TODO: remove speed up
// TODO: keep camera shake with higher frequency, instead use "heated mode"
// TODO: holding space gives bigger thrust
// TODO: Center splash, warning signal
// TODO: Get screen size and use that as game constraints
// TODO: Change vars to lets
// TODO: Use webpack
// TODO: Combine package.json inside build 
