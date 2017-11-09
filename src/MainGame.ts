/**
 * @author       Julien Midedji <admin@resamvi.de>
 * @copyright    2017 Julien Midedji
 * @license      {@link https://github.com/ResamVi/spayle/blob/master/LICENSE MIT License}
 */

import 'p2';
import 'pixi';
import 'phaser-ce';

import boot from './BootState';
import splash from './SplashState';
import load from './LoadState';
import menu from './MenuState';
import playGame from './PlayState';

let width = window.innerWidth;
let height = window.innerHeight;
let game = new Phaser.Game(width, height, Phaser.AUTO, '');

// Each State loaded (boot, splash, ...) depends on having this property configured
this.game = game;

game.state.add('splash', splash);
game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('menu', menu);
game.state.add('play', playGame(game));

game.state.start('splash');

// TODO: Center splash, warning signal [x]
// TODO: Get screen size and use that as game constraints [x]
// TOOO: insert global [x]
// TODO: Change lets to lets [x]
// TODO: Use webpack [x]
// TODO: Combine package.json inside build [x]
// TODO: Fix all linter mistakes
// TODO: States should be objects. Not functions
// TODO: Add beeping sound to heating mode
// TODO: Add comments as JSDOC
// TODO: holding space gives bigger thrust
// TODO: Put methods into prototype
// TODO: Add .d.ts files
// TODO: Rework speed up to heated mode?
// TODO: Endless level
// TODO: Player and Minion should be subclasses of entity?
// TODO: HUD is bugged
// I dont need local typescript and tslint devpackages, jdoc neither