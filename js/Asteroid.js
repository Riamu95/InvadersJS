const Asteroid = function(pos, size) 
{
    this._rect = new Rect(pos,size);
    
    this._acceleration = new Vec2(0,0);
    this._velocity = new Vec2(Math.random() * 1,(Math.random() * 1));
    this._maxSpeed = Math.random() * 2;
    this._health = 100;
    this._rect.setAngle(0.2);
    this._spriteAngle = 0;
}
Asteroid.prototype.ASTEROID_IMAGE = document.getElementById('asteroid');
Asteroid.prototype.collisionDamage = 30;

Asteroid.prototype.update = function(worldWidth,worldHeight)
{
    this._spriteAngle >= 360 ? this._spriteAngle = 0 : this._spriteAngle += 0.2;
    this._rect.rotate();
    this._velocity.setMagnitude = this._maxSpeed;

    //boundary wrapping
    this._rect.updatePoints(this._velocity);

    if (this._rect.getOrigin().x + this._rect.getSize().x/2 <= 0)
    {
        this._rect._points.forEach(point =>
        {
            point.x +=  worldWidth;
        })
        this._rect._origin.x += worldWidth;
    }
    else if (this._rect.getOrigin().x - this._rect.getSize().x/2 >= worldWidth)
    {
        //wrap left
        this._rect._points.forEach(point =>
        {
            point.x -= worldWidth;
        })
        this._rect.getOrigin().x -= worldWidth;
    }

    if(this._rect.getOrigin().y + this._rect.getSize().y/2 <= 0)
    {
        this._rect._points.forEach(point =>
        {
            point.y += worldHeight;
        })
        this._rect.getOrigin().y += worldHeight;
    }
    else if(this._rect.getOrigin().y - this._rect.getSize().y/2 >= worldHeight)
    {
        this._rect._points.forEach(point =>
        {
            point.y -= worldHeight;
        })
        this._rect.getOrigin().y -= worldHeight;
    }
}

Asteroid.prototype.draw = function(ctx, cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._spriteAngle);
    ctx.drawImage(Asteroid.prototype.ASTEROID_IMAGE,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
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

Asteroid.prototype.setHealth = function (val)
{
     this._health += val;
}

Asteroid.prototype.checkHealth = function()
{
    return this._health < 1;
}
