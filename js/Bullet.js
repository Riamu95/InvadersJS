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
        //this._rect.rotate(this._rect.getAngle());
        this._steering = new Vec2(0,0);
    }

    move(dt)
    {
        this._velocity.x = Math.cos(this._rect.getAngle()) * dt;
        this._velocity.y = Math.sin(this._rect.getAngle()) * dt;
        this._velocity.setMagnitude = this._maxSpeed;
        this._rect.updatePoints(this._velocity);
    }

    seek(dt, playerPos)
    {
        this._steering.x = playerPos.x - this._rect.getOrigin().x;
        this._steering.y = playerPos.y - this._rect.getOrigin().y;  
        //normalise vector and multiply by sacalar
        this._steering.setMagnitude = this._maxSpeed;
        //calcualte desired velocity by subtracting current velocity form diesred vel
        this._steering = Vec2.subtractVec(this._steering, this._velocity);

        this._velocity.x = this._steering.x * dt;
        this._velocity.y = this._steering.y * dt;
        this._velocity.setMagnitude = this._maxSpeed;
        this._rect.updatePoints(this._velocity);
    }

    draw(ctx,cameraPos,Image)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._rect.getOrigin().x - cameraPos.x, this._rect.getOrigin().y - cameraPos.y);
        //ctx.rotate(this._rect.getAngle());
        ctx.drawImage(Image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos);
    }

    get getVel()
    {
        return this._velocity;
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