const PowerUpType = {

    HEALTH : "health",
    FIRE_RATE : "fireRate",
    SHIELD : "shield"
};

const PowerUp = function(pos,size,type, spawnTimer)
{
    this._rect = new Rect(pos,size);
    this._type = type;
    this._spawnTimer = spawnTimer;
    this._active = true;
}

PowerUp.prototype.MaxPowerUpCount = 5;
PowerUp.prototype.currentPowerUpTimer = 0;
PowerUp.prototype.timeToLive = 5;
PowerUp.prototype.shieldTimer = 20;
PowerUp.prototype.fireRateTimer = 10;
PowerUp.prototype.health_image = document.getElementById('health');
PowerUp.prototype.fire_rate = document.getElementById('fireRate');
PowerUp.prototype.shield_image = document.getElementById('shield');

PowerUp.prototype.activatePowerUp = function()
{
    /*
    switch(this._type)
    {
        case PowerUpType.fire_rate:
            break;
        case PowerUpType.SHIELD:
            break;
    }*/  

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
    this._rect.addAngle(0.2);
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
        case  PowerUpType.SHIELD:
            ctx.drawImage(this.shield_image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
          break;
    }

      ctx.closePath();
      ctx.restore();
}