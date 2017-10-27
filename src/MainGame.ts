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

// TODO: remove speed up
// TODO: keep camera shake with higher frequency, instead use "heated mode"
// TODO: holding space gives bigger thrust
// TODO: Center splash, warning signal
// TODO: Get screen size and use that as game constraints
// TOOO: insert global
// TODO: Add .d.ts files
// TODO: Change vars to lets
// TODO: Use webpack [x]
// TODO: Combine package.json inside build [x]
// TODO: Add beeping sound to heating mode
// TODO: Add comments as JSDOC
// TODO: Put methods into prototype

/*
The "d.ts" file is used to provide typescript type information about an API that's written in
 JavaScript. The idea is that you're using something like jQuery or underscore, an
 existing javascript library. You want to consume those from your typescript code.

Rather than rewriting jquery or underscore or whatever in typescript, you can instead
 write the d.ts file, which contains only the type annotations. Then from your typescript code you get 
 the typescript benefits of static type checking while still using a pure JS library.
https://stackoverflow.com/questions/21247278/about-d-ts-in-typescript
*/