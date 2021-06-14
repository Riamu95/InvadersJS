const Shield = function(pos,size)
{
    this._rect = new Rect(pos,size);
    this._turretImage = document.getElementById("autoTurret");
    this._active = false;
    this._bullets = [];
    this._activebullets = [];
    this._fireRate = 0.5;
    this._fireTimer = 0;
    this._timer  = 0;
    this._targets = new Set();
    this._ttl = 2;
}


Shield.prototype.update = function(dt)
{

    if(this._bullets.length > 0)
    {
        this._timer = (performance.now() - this._fireTimer)/1000;

        if(this._timer > this._fireRate)
        {   
            let bullet = this._bullets.shift();
            bullet[0].getRect.setRect(this._rect.getOrigin());
            bullet[0].setTTL = performance.now();
           this._activebullets.push(bullet);
           this._fireTimer = performance.now();
        }
    }
   
    for( let b = 0; b < this._activebullets.length; b++)
    {
        this._activebullets[b][0].seek(dt,this._activebullets[b][1]);
    }
}

Shield.prototype.addBullet = function(target)
{
    if(!this._targets.has(target))
    {
        this._targets.add(target);
        let temp = new Bullet(new Vec2(this._rect.getOrigin().x,this._rect.getOrigin().y), new Vec2(20,20), 0,8);
        this._bullets.push([temp , target]);
        this._fireTimer = performance.now();
    }
}

Shield.prototype.getTTL = function()
{
    return this._ttl;
}

Shield.prototype.getActive = function()
{
   return this._active;
}

Shield.prototype.getActiveBullets = function()
{
   return this._activebullets;
}

Shield.prototype.getBullets = function()
{
   return this._bullets;
}

Shield.prototype.getTargets = function()
{
   return this._targets;
}

Shield.prototype.setActive = function(val)
{
    this._active = val;
}

Shield.prototype.draw = function(ctx,cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    ctx.drawImage(this._turretImage,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
    ctx.closePath();
    ctx.restore();

    this._activebullets.forEach(ab => {
        ab[0].draw(ctx,cameraPos,PLAYER_BULLET_IMAGE);
    }); 
}