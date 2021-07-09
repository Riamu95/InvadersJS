const AutoTurret = function(pos,size, bulletSize)
{
    AutoTurret.prototype.playerBulletImage = document.getElementById('playerBullet');
    AutoTurret.prototype.renderSize = bulletSize;

    this._rect = new Rect(pos,size);
    this._turretImage = document.getElementById("autoTurret");
    this._active = false;
    this._bullets = new Map();
    this._fireRate = 0.5;
    this._fireTimer = 0;
    this._timer  = 0;
    this._ttl = 2;
    this._activeDistance = 500;
    this._bulletdamage = 10;
}



AutoTurret.prototype.update = function(dt)
{
    if(this._bullets.size > 0)
    {
        this._timer = (performance.now() - this._fireTimer)/1000;

        if(this._timer > this._fireRate)
        {   
            for(let value of this._bullets.values())
            {
                if (value[1] == false)
                {
                    value[1] = true;
                    value[0].getRect.setRect(this._rect.getOrigin());
                    value[0].setTimer = performance.now();
                    this._fireTimer = performance.now();
                    break;
                }
                else
                {
                    continue;
                } 
            }
        }   
    }

    for(let [key,value] of this._bullets)
    {
        if (value[1] == true) 
            value[0].seek(dt,key);
    }
}

AutoTurret.prototype.addBullet = function(target)
{
    if(this._bullets.get(target) == undefined)
    {
        let temp = new Bullet(new Vec2(this._rect.getOrigin().x,this._rect.getOrigin().y), new Vec2(30,30), 0,8);
        this._bullets.set(target,[temp,false]);
        this._fireTimer = performance.now();
    }
}

AutoTurret.prototype.getTTL = function()
{
    return this._ttl;
}

AutoTurret.prototype.getActive = function()
{
   return this._active;
}

AutoTurret.prototype.getRect = function()
{
   return this._rect;
}

AutoTurret.prototype.getActiveDistance = function()
{
   return this._activeDistance;
}

AutoTurret.prototype.getBullets = function()
{
   return this._bullets;
}

AutoTurret.prototype.setActive = function(val)
{
    this._active = val;
}

AutoTurret.prototype.getBulletDamage = function()
{
   return this._bulletdamage;
}
AutoTurret.prototype.clear = function()
{
    if (this._bullets.size  == 0)
        return;
        
    this._bullets.clear();
}

AutoTurret.prototype.draw = function(ctx,cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    ctx.drawImage(this._turretImage,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
    ctx.closePath();
    ctx.restore();


    for(let value of this._bullets.values())
    {
        if (value[1] == true)
            value[0].draw(ctx,cameraPos,AutoTurret.prototype.playerBulletImage);   
    }     
}
