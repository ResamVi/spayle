module.exports = function HUD(game, player, enemy) {

    var Const = require('./Constants.js');

    var warning;
    var arrow;

    // HUD
    var hud = game.add.group();
    hud.fixedToCamera = true;

    warning = game.add.sprite(300, 600-36, 'warning');
    warning.anchor.setTo(0.5);
    hud.add(warning);
    
    arrow = game.add.sprite(game.camera.width/2, game.game.height/2, 'arrow');
    arrow.anchor.setTo(0.5);
    hud.add(arrow);
    
    this.update = function update() {
        focusPointer(getNearestEnemy());
    };

    function getNearestEnemy() {
        var shortestDistance  = Number.POSITIVE_INFINITY;
        var closestEnemy;

        enemy.group.forEach(function(child) {
            var d = Phaser.Math.distance(player.sprite.x, player.sprite.y, child.x, child.y);
            if(d < shortestDistance) {
                shortestDistance = d;
                closestEnemy = child;
            }
        });
        
        if(shortestDistance < Const.WARNING_RADIUS)
            return closestEnemy;
    }
    
    function focusPointer(enemy)
    {    
        if(enemy === undefined) {
            warning.alpha = 0;
            arrow.alpha = 0;
            return;
        } else {
            warning.alpha = 1;
            arrow.alpha = 1;
        }

        // Angle
        arrow.rotation = Phaser.Math.angleBetween(player.sprite.x, player.sprite.y, enemy.x, enemy.y); 

        // Y Coord
        var ySlope = (enemy.y - player.sprite.y) / Math.abs(enemy.x - player.sprite.x);
        var yCoord = ySlope * Const.GAME_WIDTH / 2 + Const.CENTER_CAMERA_X;
        
        if(yCoord < 7)
            arrow.y = 7;
        else if(yCoord > Const.GAME_HEIGHT)
            arrow.y = Const.GAME_HEIGHT - 7;
        else
            arrow.y = yCoord;
        
        // X Coord
        var xSlope = Math.abs(enemy.y - player.sprite.y) / (enemy.x - player.sprite.x);
        var xCoord = (Const.GAME_HEIGHT * 0.5) / xSlope + Const.CENTER_CAMERA_Y;

        if(xCoord > Const.GAME_WIDTH)
            arrow.x = Const.GAME_WIDTH - 7;
        else if(xCoord < 7)
            arrow.x = 7;
        else
            arrow.x = xCoord;
        
    }
};