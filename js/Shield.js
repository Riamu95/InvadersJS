const Shield = function(pos,size)
{
    this._rect = new Rect(pos,size);
    this._turretImage = document.getElementById("autoTurret");
    this._active = false;
    this._bullets = [];
}


Shield.prototype.update = function(dt)
{
    this._rect.addAngle(0.2);
}

Shield.prototype.getActive = function()
{
   return this._active;
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
}