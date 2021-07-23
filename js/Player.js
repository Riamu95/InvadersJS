import { Shape } from "./Shape.js";
import { Vec2 } from "./Vec2.js";
import { Rect } from "./Rect.js";
import { Pistol } from "./Pistol.js";
import { Shotgun } from "./Shotgun.js";
import { Mine } from "./Mine.js";
import { AutoTurret } from "./AutoTurret.js";
import { AudioManager } from "./AudioManager.js";

export { Player };
class Player
{
    constructor(pos,size)
    {
        this._shape = new Shape(pos,size,6);
        
        this._collisionRect = new Rect(new Vec2(this._shape._origin.x , this._shape._origin.y)
        , new Vec2(this._shape._size.x * 4, this._shape._size.y * 4));

        this._health = 100;

        
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
        this._maxbulletSpeed = 10;
        this._color = 'red'; 
        this._fired = false;
        this._fireRate = 0.5;
        this._fireTimer = 0;
        this._mass = 1;
        this._powerUp = null;
        this._usingPowerUp = false;
        this._currentPowerUp = null;
        this._nextPowerUp = null;
       
        this.createShape();

        this._weapons = [];
        this._currentWeapon = null;
                                    //size,ammoCount,ttl,damage
        this._weapons.push(new Pistol(new Vec2(20,20),1000,5,10));
        this._weapons.push(new Shotgun(new Vec2(25,25),12,3,15));
        this._weapons.push(new Mine(new Vec2(70,68),5,20,100));
        this._autoTurret = new AutoTurret(this._shape.getOrigin(), new Vec2(93,94),this._weapons[0].getBulletSize());
        this._currentWeapon = this._weapons[0];
        this._collisionDamage = 10;
    }

    static playerIMG = document.getElementById('player');


    createShape()
    {
        //should be based around origin??
        
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2, this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2((this._shape.getOrigin().x - this._shape.getSize().x/2) + 32, this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2, (this._shape.getOrigin().y - this._shape.getSize().y/2) + 70));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2, (this._shape.getOrigin().y - this._shape.getSize().y/2) + 79));
        this._shape.addPoint(new Vec2((this._shape.getOrigin().x - this._shape.getSize().x/2 ) + 32, (this._shape.getOrigin().y + this._shape.getSize().y/2)));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2,this._shape.getOrigin().y + this._shape.getSize().y/2));
        
        /*
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2, this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2((this._shape.getOrigin().x - this._shape.getSize().x/2), this._shape.getOrigin().y + this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2, (this._shape.getOrigin().y + this._shape.getSize().y/2)));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2, (this._shape.getOrigin().y - this._shape.getSize().y/2) ));
        */
    }

    setShapePosition()
    {
        this._shape._points[0].x = this._shape.getOrigin().x - this._shape.getSize().x/2;
        this._shape._points[0].y = this._shape.getOrigin().y - this._shape.getSize().y/2;

        this._shape._points[1].x = (this._shape.getOrigin().x - this._shape.getSize().x/2) + 32;
        this._shape._points[1].y = this._shape.getOrigin().y - this._shape.getSize().y/2;

        this._shape._points[2].x = this._shape.getOrigin().x + this._shape.getSize().x/2;
        this._shape._points[2].y = (this._shape.getOrigin().y - this._shape.getSize().y/2) + 70;

        this._shape._points[3].x = this._shape.getOrigin().x + this._shape.getSize().x/2;
        this._shape._points[3].y = (this._shape.getOrigin().y - this._shape.getSize().y/2) + 79;

        this._shape._points[4].x = (this._shape.getOrigin().x - this._shape.getSize().x/2) + 32;
        this._shape._points[4].y =  this._shape.getOrigin().y + this._shape.getSize().y/2;

        this._shape._points[5].x = this._shape.getOrigin().x - this._shape.getSize().x/2;
        this._shape._points[5].y =  this._shape.getOrigin().y + this._shape.getSize().y/2;

        
        this._shape.rotate(this._spriteAngle  * Math.PI / 180);
        this._collisionRect.setRect(new Vec2(this._shape.getOrigin().x, this._shape.getOrigin().y));
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


        this._shape.updatePoints(this._velocity);
        this._collisionRect.updatePoints(this._velocity);

        this._acceleration.x = 0;
        this._acceleration.y = 0;
    }

    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate(this._shape.getOrigin().x - cameraPos.x,this._shape.getOrigin().y- cameraPos.y);
        ctx.rotate(this._spriteAngle * (Math.PI/180));
        ctx.drawImage(Player.playerIMG,0,0,this._shape.getSize().x,this._shape.getSize().y,-this._shape.getSize().x/2,-this._shape.getSize().y/2,this._shape.getSize().x,this._shape.getSize().y);
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

    get getMass()
    {
        return this._mass;
    }

    getVelocity()
    {
        return this._velocity;
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
        this._health += value;
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

    getAutoTurret()
    {
        return this._autoTurret;
    }

    getFired()
    {
        return this._fired;
    }

    setFired(val)
    {
        this._fired = val;
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

    setMaxAcceleration(val)
    {
         this._maxAcceleration = val;
    }

    addAcceleration(val)
    {
        this._acceleration.x += val.x;
        this._acceleration.y += val.y;
    }

    getCurrentWeapon()
    {
        return this._currentWeapon;
    }
    setCurrentWeapon(val)
    {
        this._currentWeapon = this._weapons[val];
    }
    getWeapons()
    {
        return this._weapons;
    }
    checkHealth()
    {
        if(this._health < 1)
        {
            AudioManager.getInstance().playSound("death");
            return true;
        }
        else
            return false;
    }
    getCollisionDamage()
    {
        return this._collisionDamage;
    }
}