class Bullet
{
    constructor(pos,size,_angle,maxSpeed)
    {
        this._rect = new Rect(pos,size);
        this._rect.setAngle(_angle);
        this._color = 'Red';
        this._velocity = new Vec2(0,0);
        this._ttl = performance.now();
        this._maxSpeed = maxSpeed;
        this._rect.rotate(this._rect.getAngle());
    }

    move(dt)
    {
        //something wrogn with angle??? 
        this._velocity.x = Math.cos(this._rect.getAngle()) * dt;
        this._velocity.y = Math.sin(this._rect.getAngle()) * dt;
        this._velocity.setMagnitude = this._maxSpeed;
        this._rect._pos.x += this._velocity.x;
        this._rect._pos.y += this._velocity.y;
        this._rect.updatePoints(this._velocity);
    }

    draw(ctx,cameraPos,Image)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._rect.getOrigin().x - cameraPos.x, this._rect.getOrigin().y - cameraPos.y);
        ctx.rotate(this._rect.getAngle());
        ctx.drawImage(Image,0,0,this._rect._size.x,this._rect._size.y,-this._rect._size.x/2,-this._rect._size.y/2,this._rect._size.x,this._rect._size.y);
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos);
    }

    get getVel()
    {
        return this._velocity;
    }

    get getPos()
    {
        return this._pos;
    }
    get getCircle()
    {
        return this._circle;
    }
    getTTL()
    {
        return this._ttl;
    } 
    set setTTL(val)
    {
        this._ttl += val;
    }

    get getRect()
    {
        return this._rect;
    }
}