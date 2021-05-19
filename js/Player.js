class Player
{
    constructor(pos,size)
    {
        this._shape = new Shape(pos,size,6);
        
        this._collisionRect = new Rect(new Vec2(this._shape._origin.x - (this._shape._size.x * 1.5), this._shape._origin.y - (this._shape._size.y * 2))
        , new Vec2(this._shape._size.x * 3, this._shape._size.y * 4));

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
        this._maxbulletSpeed = 8;
        this.m_color = 'red'; 
        
        this.createShape();
    }


    createShape()
    {
        //should be based around origin??
        this._shape.addPoint(new Vec2(this._shape.getPos().x, this._shape.getPos().y));
        this._shape.addPoint(new Vec2(this._shape.getPos().x + 32, this._shape.getPos().y));
        this._shape.addPoint(new Vec2(this._shape.getPos().x + 127, this._shape.getPos().y + 59));
        this._shape.addPoint(new Vec2(this._shape.getPos().x + 127, this._shape.getPos().y + 70));
        this._shape.addPoint(new Vec2(this._shape.getPos().x + 32, this._shape.getPos().y + 130));
        this._shape.addPoint(new Vec2(this._shape.getPos().x, this._shape.getPos().y + 130));
    }

    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate((this._shape.getPos().x + this._shape.getSize().x/2) - cameraPos.x,(this._shape.getPos().y + this._shape.getSize().y/2) - cameraPos.y);
        ctx.rotate(Math.PI/180 * this.m_angle);
        ctx.drawImage(playerIMG,0,0,this._shape.getSize().x,this._shape.getSize().y,-this._shape.getSize().x/2,-this._shape.getSize().y/2,this._shape.getSize().x,this._shape.getSize().y);
        ctx.closePath();
        ctx.restore();

        this._shape.draw(ctx,cameraPos, this.m_color);
        this._collisionRect.draw(ctx,cameraPos, 'blue');
    }

    move(dt)
    {        
        this._velocity.x =  Math.cos(this.m_angle  * Math.PI / 180) * this.m_acceleration *this.m_speed * dt;
        this._velocity.y =  Math.sin(this.m_angle  * Math.PI / 180)* this.m_acceleration * this.m_speed * dt;
        this._shape.addPos(this._velocity);

        this._shape.updatePoints(this._velocity);
        this._collisionRect.updatePoints(this._velocity);
    }

    get getMaxBulletSpeed()
    {
        return this._maxbulletSpeed;
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
        if (this.m_angle + _angle > 360)
        {
            this.m_angle = 0;
            this.m_angle += _angle;
            return;
        }
        else if (this.m_angle + _angle < -360)
        {
           
            this.m_angle = 0;
            this.m_angle += _angle;
            return;
        }
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
    get getShape()
    {
        return this._shape;
    }
    get getCollisionRect()
    {
        return this._collisionRect;
    }

    get getTTL()
    {
        return this._ttl;
    }

    get getShape()
    {
        return this._shape;
    }
}