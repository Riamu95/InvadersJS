const BlackHole = function(pos,size)
{
    this._rect = new Rect(pos,size);
    BlackHole.positions.push(this._rect.getOrigin());
    this._acitve = false;
    this._activeDistance = 750;
    this._gravitationalForce = 0;
    this._g = 9.81;
    this._mass = 1000;

    this._directionalForce = new Vec2(0,0);
    this._forceMagnitude = 0;
}

BlackHole.prototype.update = function(dt)
{
    this._rect.getAngle() >= 360 ? this._rect.setAngle(0) : this._rect.addAngle(0.1);

}

BlackHole.prototype.attract = function(origin, mass)
{
    if (Vec2.distance(this._rect.getOrigin(), origin) > this._activeDistance)  
            return [new Vec2(0,0), false];

    if (Vec2.distance(this._rect.getOrigin(), origin) < 100)
    {
        let pos = BlackHole.teleport(origin);
        return [pos, true];    
    }
    //direction of force
    this._directionalForce.x = this._rect.getOrigin().x - origin.x;
    this._directionalForce.y = this._rect.getOrigin().y - origin.y;

    let d =  Vec2.length(this._directionalForce);
    
    this._directionalForce = Vec2.normalise(this._directionalForce);

    //magnitude of force
    this._forceMagnitude = this._g * (this._mass * mass)/(d * d);
   
    this._directionalForce.setMagnitude = this._forceMagnitude;
    return [this._directionalForce, false];
}

BlackHole.teleport = function(origin)
{
    let pos = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);

   /* for( pos of BlackHole.positions)
    {
        if((rect._origin.x - rect._size.x / 2 > this._origin.x + this._size.x / 2 ||
            rect._origin.x + rect._size.x / 2 < this._origin.x - this._size.x / 2 ||
            rect._origin.y - rect._size.y / 2 > this._origin.y + this._size.y / 2 ||
            rect._origin.y + rect._size.y / 2 < this._origin.y - this._size.y / 2))
        {
            BlackHole.teleport();
        }
    }*/

    return pos;
}

BlackHole.positions = [];

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

