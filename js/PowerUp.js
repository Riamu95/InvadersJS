import { Rect } from "./Rect.js";
import { Vec2 } from "./Vec2.js";

export { PowerUpType };
const PowerUpType = 
{
    HEALTH : "health",
    FIRE_RATE : "fireRate",
    AUTOTURRET : "autoTurret",
    SPEED : "speed"
};

export { PowerUp };

const PowerUp = function(pos,size,type, spawnTimer)
{
    this._rect = new Rect(pos,size);
    this._type = type;
    this._spawnTimer = spawnTimer;
    this._active = true;
    this._inactiveTimer = 0;
}

PowerUp.prototype.healthIncreaseAmount = 0;
PowerUp.prototype.healthIncreaseValue = 30;
PowerUp.prototype.MaxPowerUpCount = 5;
PowerUp.prototype.currentPowerUpTimer = 0;
PowerUp.prototype.timeToLive = 5;
PowerUp.prototype.AutoTurretTimer = 20;
PowerUp.prototype.resetTime = 20;
PowerUp.prototype.fireRateTimer = 10;
PowerUp.prototype.speedTimer = 10;
PowerUp.prototype.health_image = document.getElementById('health');
PowerUp.prototype.fire_rate = document.getElementById('fireRate');
PowerUp.prototype.autoTurret_image = document.getElementById('shield');
PowerUp.prototype.speed_image = document.getElementById('speed');

PowerUp.prototype.activatePowerUp = function()
{ 

}

PowerUp.prototype.worldWidth = 0;
PowerUp.prototype.worldHeight = 0;

PowerUp.prototype.setWorldSize = function(val)
{
    PowerUp.prototype.worldWidth = val.x;
    PowerUp.prototype.worldHeight = val.y;
}

PowerUp.prototype.generateRandomType = function(val)
{
    let type = "";
    switch(val)
    {
        case  0:
            type = "health";
            break;
        case 1:
            type = "fireRate";
            break;
        case 2:
            type = "autoTurret";
            break;
        case 3:
            type = "speed";
            break;
    }
    return type;
    
}

PowerUp.prototype.getActive = function()
{
    return this._active;
}

PowerUp.prototype.getRect = function()
{
    return this._rect;
}

PowerUp.prototype.getType = function()
{
    return this._type;
}

PowerUp.prototype.setActive = function(val)
{
    this._active = val;
}

PowerUp.prototype.update = function(dt)
{
    if(!this._active && Math.round((performance.now() - this._inactiveTimer)/1000) > PowerUp.prototype.resetTime)
    {
        this.reset();
    }

    this._rect.addAngle(0.2);
}

PowerUp.prototype.reset = function()
{
    this._active = true;
    this._rect.pos = new Vec2(Math.random() * PowerUp.prototype.worldWidth, Math.random() * PowerUp.prototype.worldHeight);
    this._type = this.generateRandomType(Math.round(Math.random() * 3));
}

PowerUp.prototype.setInactiveTimer = function(val)
{
    this._inactiveTimer = val;
}

PowerUp.prototype.draw = function(ctx,cameraPos)
{
    if(this._active == false)
        return;
    
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    
    switch(this._type) 
    {
        case PowerUpType.HEALTH:
            ctx.drawImage(this.health_image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
          break;
        case  PowerUpType.FIRE_RATE:
            ctx.drawImage(this.fire_rate,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
          break;
        case  PowerUpType.AUTOTURRET:
            ctx.drawImage(this.autoTurret_image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
          break;
        case  PowerUpType.SPEED:
            ctx.drawImage(this.speed_image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
          break;
    }

      ctx.closePath();
      ctx.restore();
}