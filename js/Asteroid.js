const Asteroid = function(pos, size) 
{
    this._rect = new Rect(pos,size);
    
    this._acceleration = new Vec2(0,0);
    this._velocity = new Vec2(Math.random() * 1,(Math.random() * 1));
    this._maxSpeed = Math.random() * 2;
    this._health = 100;
}

Asteroid.prototype.update = function(dt)
{
    this._rect.addAngle(0.1);
    this._velocity.setMagnitude = this._maxSpeed;

    //boundary wrapping
    this._rect.updatePoints(this._velocity);

    if (this._rect.getOrigin().x + this._rect.getSize().x/2 <= 0)
    {
        this._rect._points.forEach(point =>
        {
            point.x +=  WORLD_WIDTH;
        })
        this._rect._origin.x += WORLD_WIDTH;
    }
    else if (this._rect.getOrigin().x - this._rect.getSize().x/2 >= WORLD_WIDTH)
    {
        //wrap left
        this._rect._points.forEach(point =>
        {
            point.x -= WORLD_WIDTH;
        })
        this._rect.getOrigin().x -= WORLD_WIDTH;
    }

    if(this._rect.getOrigin().y + this._rect.getSize().y/2 <= 0)
    {
        this._rect._points.forEach(point =>
        {
            point.y += WORLD_HEIGHT;
        })
        this._rect.getOrigin().y += WORLD_HEIGHT;
    }
    else if(this._rect.getOrigin().y - this._rect.getSize().y/2 >= WORLD_HEIGHT)
    {
        this._rect._points.forEach(point =>
        {
            point.y -= WORLD_HEIGHT;
        })
        this._rect.getOrigin().y -= WORLD_HEIGHT;
    }
}

Asteroid.prototype.draw = function(ctx, cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    ctx.drawImage(ASTEROID_IMAGE,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
    ctx.closePath();
    ctx.restore();

    this._rect.draw(ctx,cameraPos, 'red');
}

Asteroid.prototype.getRect = function()
{
    return this._rect;
}

Asteroid.prototype.getHealth = function()
{
    return this._health;
}

Asteroid.prototype.setHealth = function(val)
{
    return this._health += val;
}