class Player
{
    constructor(pos,size)
    {
        this._shape = new Shape(pos,size,6);
        
        this._collisionRect = new Rect(new Vec2(this._shape._origin.x , this._shape._origin.y)
        , new Vec2(this._shape._size.x * 3, this._shape._size.y * 4));

        this._health = 1;

        
        this._velocity = new Vec2(0,0);
        this._speed = 0;

        this._acceleration = new Vec2(0,0);
        this._direction = new Vec2(0,0);
        this._deccelerationRate = 0.003;
        this._accelerationRate = 0.003;
        this._maxAcceleration = 0.5;
        
        this._rotationSpeed = 1.5;
        this._spriteAngle = 0;
        this._ttl = 3;
        this._maxbulletSpeed = 8;
        this._color = 'red'; 
        this._fireRate = 0.1;
        this._fireTimer = 0;
        this._mass = 1;
        this._powerUp = null;
        this._usingPowerUp = false;
        this._currentPowerUp = null;
        this._nextPowerUp = null;
        this.createShape();
    }


    createShape()
    {
        //should be based around origin??
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2, this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2((this._shape.getOrigin().x - this._shape.getSize().x/2) + 32, this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2, (this._shape.getOrigin().y - this._shape.getSize().y/2) + 59));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2, (this._shape.getOrigin().y - this._shape.getSize().y/2) + 70));
        this._shape.addPoint(new Vec2((this._shape.getOrigin().x - this._shape.getSize().x/2) + 32, this._shape.getOrigin().y + this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2,this._shape.getOrigin().y + this._shape.getSize().y/2));
    }

    setShapePosition()
    {
        this._shape._points[0].x = this._shape.getOrigin().x - this._shape.getSize().x/2;
        this._shape._points[0].y = this._shape.getOrigin().y - this._shape.getSize().y/2;

        this._shape._points[1].x = (this._shape.getOrigin().x - this._shape.getSize().x/2) + 32;
        this._shape._points[1].y = this._shape.getOrigin().y - this._shape.getSize().y/2;

        this._shape._points[2].x = this._shape.getOrigin().x + this._shape.getSize().x/2;
        this._shape._points[2].y = (this._shape.getOrigin().y - this._shape.getSize().y/2) + 59;

        this._shape._points[3].x = this._shape.getOrigin().x + this._shape.getSize().x/2;
        this._shape._points[3].y = (this._shape.getOrigin().y - this._shape.getSize().y/2) + 70;

        this._shape._points[4].x = (this._shape.getOrigin().x - this._shape.getSize().x/2) + 32;
        this._shape._points[4].y =  this._shape.getOrigin().y + this._shape.getSize().y/2;

        this._shape._points[5].x = this._shape.getOrigin().x - this._shape.getSize().x/2;
        this._shape._points[5].y =  this._shape.getOrigin().y + this._shape.getSize().y/2;

        
        this._shape.rotate(this._spriteAngle  * Math.PI / 180);
        this._collisionRect.setRect(new Vec2(this._shape.getOrigin().x, this._shape.getOrigin().y));
    }

    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate(this._shape.getOrigin().x - cameraPos.x,this._shape.getOrigin().y- cameraPos.y);
        ctx.rotate(this._spriteAngle * (Math.PI/180));
        ctx.drawImage(playerIMG,0,0,this._shape.getSize().x,this._shape.getSize().y,-this._shape.getSize().x/2,-this._shape.getSize().y/2,this._shape.getSize().x,this._shape.getSize().y);
        ctx.closePath();
        ctx.restore();



        this._shape.draw(ctx,cameraPos, this._color);
        this._collisionRect.draw(ctx,cameraPos, 'blue');
        
        ctx.save();
        ctx.beginPath();   
        ctx.translate(this._shape.getOrigin().x - cameraPos.x, this._shape.getOrigin().y - cameraPos.y);
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    move(dt)
    {        

        this._direction.x = Math.cos(this._spriteAngle  * Math.PI / 180);
        this._direction.y = Math.sin(this._spriteAngle  * Math.PI / 180);

        this._direction.setMagnitude = this._speed;

        this._acceleration.x += this._direction.x;
        this._acceleration.y += this._direction.y;      

        this._velocity.x =  this._acceleration.x * dt;
        this._velocity.y = this._acceleration.y * dt;
        
        //this._shape.addPos(this._velocity);

        this._shape.updatePoints(this._velocity);
        this._collisionRect.updatePoints(this._velocity);

        this._acceleration.x = 0;
        this._acceleration.y = 0;
    }

    get getMass()
    {
        return this._mass;
    }

    get getMaxBulletSpeed()
    {
        return this._maxbulletSpeed;
    }

    get getHealth()
    {
        return this._health;
    }

    get getRotationSpeed()
    {
        return this._rotationSpeed;
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

    getSpeed()
    {
        return this._speed;
    }

    setSpeed(val)
    {
        this._speed = val;
    }

    addSpeed(val)
    {
        this._speed += val;
    }

    getDirection()
    {
        return this._direction;
    }

    setDirection(val)
    {
        this._direction = val;
    }

    getPowerUpType()
    {
        return this._powerUp;
    }
    setPowerUpType(val)
    {
        return this._powerUp = val;
    }

    getCurrentPowerUp()
    {
        return this._currentPowerUp;
    }

    setCurrentPowerUp(val)
    {
        this._currentPowerUp = val;
    }

    resetPowerUp()
    {
        this.setUsingPowerUp(false);
        this.setCurrentPowerUp(null);
        this.setPowerUpType(null);
        this.setUsingPowerUp(false);
    }

    getUsingPowerUp()
    {
        return this._usingPowerUp;
    }

    setUsingPowerUp(val)
    {
        this._usingPowerUp = val;
    }

    getNextPowerUp()
    {
        return this._nextPowerUp;
    }

    setNextPowerUp(val)
    {
        this._nextPowerUp = val;
    }

    get getDeccelerationRate()
    {
        return this._deccelerationRate;
    }

    get getAcceleration()
    {
        return this._acceleration;
    }

    get getAccelerationRate()
    {
        return this._accelerationRate;
    }

    get getMaxAcceleration()
    {
        return this._maxAcceleration;
    }
}