
class Player
{
    
    constructor(x, y, w ,h ,color)
    {
        this._pos = new Vec2(x,y);
        this._size = new Vec2(w,h);
        this._rect = new Rect(this._pos, this._size);
        this._collisionRect = new Rect(new Vec2(this._rect._origin.x - (this._rect._size.x * 1.5), this._rect._origin.y - (this._rect._size.y * 2)), new Vec2(this._rect._size.x * 3, this._rect._size.y * 4));
        this._health = 1;

        this.m_speed = 0.1;
        this._velocity = new Vec2(0,0);
        this.m_deccelerationRate = 0.005;
        this.m_acceleration = 0;
        this.m_accelerationRate = 0.03;
        this.m_maxAcceleration = 5;
        
        this.m_angle = 0;
        this.m_rotationSpeed = 1.5;
        
        this._ttl = 3;

        this.m_color = color;           
    }

    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate((this._pos.x + this._size.x/2) - cameraPos.x,(this._pos.y + this._size.y/2) - cameraPos.y);
        ctx.rotate(Math.PI/180 * this.m_angle);
        ctx.drawImage(playerIMG,0,0,this._size.x,this._size.y,-this._size.x/2,-this._size.y/2,this._size.x,this._size.y);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos, this.m_color);
        this._collisionRect.draw(ctx,cameraPos, 'blue');
    }

    move(dt)
    {        
        this._velocity.x =  Math.cos(this.m_angle  * Math.PI / 180) * this.m_acceleration *this.m_speed * dt;
        this._velocity.y =  Math.sin(this.m_angle  * Math.PI / 180)* this.m_acceleration * this.m_speed * dt;
        this._pos.x += this._velocity.x;
        this._pos.y += this._velocity.y; 
        this._rect.updatePoints(this._velocity); 
        this._collisionRect.updatePoints(this._velocity);
    }

    get getPos()
    {
        return this._pos;
    }
    get getHealth()
    {
        return this._health;
    }
    get getSize()
    {
        return this._size;
    }
    get getDeccelerationRate()
    {
        return this.m_deccelerationRate;
    }
    get getAcceleration()
    {
        return this.m_acceleration;
    }
    get getAccelerationRate()
    {
        return this.m_accelerationRate;
    }
    get getMaxAcceleration()
    {
        return this.m_maxAcceleration;
    }
    get getAngle()
    {
        return this.m_angle;
    }
    get getRotationSpeed()
    {
        return this.m_rotationSpeed;
    }
    set setAngle(_angle)
    {
        this.m_angle += _angle;
    }
    set setAcceleration(_accel)
    {
        this.m_acceleration += _accel;
    }
    set setHealth(value)
    {
        this._health -= value;
    }
    get getRect()
    {
        return this._rect;
    }
    get getCollisionRect()
    {
        return this._collisionRect;
    }

    get getTTL()
    {
        return this._ttl;
    }
}