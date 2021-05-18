const BlackHole = function(pos,size)
{
    this._rect = new Rect(pos,size);
    
    this._acitve = false;
    this._activeDistance = 500;
}

BlackHole.prototype.update = function(dt)
{
    if(this._rect.getAngle() >= 360)
    {
        this._rect.setAngle(0);
    }
    else
    {
        this._rect.addAngle(0.1);
    }  
}

BlackHole.prototype.draw = function(ctx,cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect._origin.x - cameraPos.x,this._rect._origin.y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    ctx.drawImage(BLACKHOLE_IMAGE,0,0,this._rect._size.x,this._rect._size.y,-this._rect._size.x/2,-this._rect._size.y/2,this._rect._size.x,this._rect._size.y);
    ctx.closePath();
    ctx.restore();
}

