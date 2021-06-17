const AmmoType = 
{
    SHOTGUN : "shotgunAmmo",
    MINE : "mineAmmo"
};


const Ammo = function(pos,size, type)
{
    this._rect = new Rect(pos,size);
    this._type = type;
    this._image = document.getElementById(this._type);
    this._active = true;
    this._timer = 0;
    this._ammount = this._type == "shotgunAmmo" ? 10 : 5;
}

Ammo.prototype.getRect = function()
{
    return this._rect;
}

Ammo.prototype.getActive = function()
{
    return this._active;
}

Ammo.prototype.setActive = function(val)
{
    this._active = val;
}
Ammo.prototype.getAmmount = function()
{
    return this._ammount;
}

Ammo.prototype.getType = function()
{
    return this._type;
}


Ammo.prototype.update = function(timeInterval)
{
    if (this._active)
        this._rect.addAngle(0.2);
    else
    {
        if(((performance.now() - this._timer)/1000) > timeInterval)
        {
            this._active = true;
            this.reset();
        }
    }
}

Ammo.prototype.reset = function()
{
    this._rect.setRect(new Vec2(Math.random()* WORLD_WIDTH, Math.random() * WORLD_HEIGHT));
}

Ammo.prototype.setTimer = function(val)
{
    this._timer = val;
}

Ammo.prototype.initAmmo = function(ammunition)
{
    let mineAmmo = new Ammo(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT), new Vec2(138,153),AmmoType.MINE);
    let shotgunAmmo = new Ammo(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT), new Vec2(156,152),AmmoType.SHOTGUN);
    ammunition.push(mineAmmo);
    ammunition.push(shotgunAmmo);
}


Ammo.prototype.draw = function(ctx,cameraPos)
{  
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    ctx.drawImage(this._image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
    ctx.closePath();
    ctx.restore();
}