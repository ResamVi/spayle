declare class Player
{
    constructor(game: Phaser.Game);

    sprite: Phaser.Sprite;
    body: Phaser.Physics.P2.Body;
    isSpinning: boolean;

    update(): void;
    loseControl(duration: number): void;
    superThrust(): void;
    snipe(): void;
    thrust(): void;
}

declare class Mother
{
	constructor(game: Phaser.Game);
	
	_graphics: Phaser.Graphics;
}