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
    
        this.m_rotationSpeed = 1.5;
        this._spriteAngle = 0;
        this._ttl = 3;
        this._maxbulletSpeed = 8;
        this.m_color = 'red'; 
        this._fireRate = 0.1;
        this._fireTimer = 0;
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
        ctx.rotate(this._spriteAngle * (Math.PI/180));
        ctx.drawImage(playerIMG,0,0,this._shape.getSize().x,this._shape.getSize().y,-this._shape.getSize().x/2,-this._shape.getSize().y/2,this._shape.getSize().x,this._shape.getSize().y);
        ctx.closePath();
        ctx.restore();



        this._shape.draw(ctx,cameraPos, this.m_color);
        this._collisionRect.draw(ctx,cameraPos, 'blue');
        ctx.save();
        ctx.beginPath();   
        ctx.translate(this._shape.getPoints()[2].x - cameraPos.x, this._shape.getPoints()[2].y - cameraPos.y);
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    move(dt)
    {        
        this._velocity.x =  Math.cos(this._spriteAngle  * Math.PI / 180) * this.m_acceleration *this.m_speed * dt;
        this._velocity.y =  Math.sin(this._spriteAngle  * Math.PI / 180)* this.m_acceleration * this.m_speed * dt;
        this._shape.addPos(this._velocity);

        this._shape.updatePoints(this._velocity);
        this._collisionRect.updatePoints(this._velocity);
    }

    get getMaxBulletSpeed()
    {
        return this._maxbulletSpeed;
    }
    get getHealth()
    {
        return this._health;
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
    get getRotationSpeed()
    {
        return this.m_rotationSpeed;
    }
    set setAcceleration(_accel)
    {
        this.m_acceleration += _accel;
    }
    set setHealth(value)
    {
        this._health -= value;
    }
    set setSpriteAngle(val)
    {
        this._spriteAngle += val;
    }
    get getSpriteAngle()
    {
        return this._spriteAngle;
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

    get getFireRate()
    {
        return this._fireRate;
    }
    set setFireRate(val)
    {
        this._fireRate = val;
    }
    get getFireTimer()
    {
        return this._fireTimer;
    }
    setFireTimer(val)
    {
        this._fireTimer = val;
    }
}