import { Vec2 } from "./Vec2.js";
import { Shape } from "./Shape.js";
import { seek } from "./Steering.js";
import { Lerp } from "./Lerp.js";
import { Circle } from "./Circle.js";
export { Boss };

class Boss 
{
    constructor(pos, size, worldSize)
    {
        this._shape = new Shape(pos,size,8);
        this._velocity = new Vec2(0,0);
        this._acceleration = new Vec2(0,0);
        this._maxSpeed = 2;
        this.m_speed = 0;
        this._health = 100;
        this._shieldHealth = 100;
        this._worldSize = worldSize;
        this._flockPoint = new Vec2(Math.random() * this._worldSize.x, Math.random() * this._worldSize.y);
        this._shieldColour = [0,255,255];
        this._beginShieldColour = [100,255,255];
        this._endShieldColour = [0,0,255];
        this._lerpTime = 3;
        this._lerpClock = performance.now();
        this._shieldActive = true;
        this._shield = new Circle(this._shape.getOrigin(), 250);
        this._opacity = 1;
        this.createShape();
    }

    static BOSS_IMAGE = document.getElementById("boss");
    
    createShape()
    {
        //left side
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2,this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + 24,this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + 96,this._shape.getOrigin().y - 43.5));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2,this._shape.getOrigin().y - 5.5));
        //right side
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2,this._shape.getOrigin().y + 4));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + 95,this._shape.getOrigin().y  + 41.5));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + 24 ,this._shape.getOrigin().y + this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2,this._shape.getOrigin().y + this._shape.getSize().y/2));       
    }

    update(dt)
    {
        if(Vec2.distance(this._shape.getOrigin(), this._flockPoint) < 50)
        {
            this._flockPoint.x = Math.random() * this._worldSize.x;
            this._flockPoint.y =  Math.random() * this._worldSize.y;
        }
        else
        {
            this._acceleration = seek(this._flockPoint, this._shape,this._velocity,this._maxSpeed);

            this._velocity.addVec = this._acceleration;
       
            this._velocity.x = this._velocity.x * dt;
            this._velocity.y = this._velocity.y * dt;
 
            this._velocity.setMagnitude = this._maxSpeed;

            this._shape.setAngle(-this._shape.getAngle());
            this._shape.rotate();
            //rotate points by direction of
            this._shape.setAngle(Math.atan2(this._velocity.y,this._velocity.x) * 180 / Math.PI);
            //rotate object in direction of velocity
            this._shape.rotate(); 
 
            this._shape.updatePoints(this._velocity);
            this._acceleration = new Vec2(0,0);
        } 
     
        if( ((performance.now() - this._lerpClock) /1000) > this._lerpTime)
        {
            this._lerpClock = performance.now();
           
            let tempColour = this._beginShieldColour;
            
            this._beginShieldColour = this._endShieldColour;
            this._endShieldColour = tempColour;
            //this._shieldColour = this._beginShieldColour;
        }

        let timerRemaining = (performance.now() - this._lerpClock)/1000;
        let percentage = timerRemaining / this._lerpTime;
  
        this._shieldColour[0] = Lerp.LerpFloat(this._beginShieldColour[0], this._endShieldColour[0],percentage);
        this._shieldColour[1] = Lerp.LerpFloat(this._beginShieldColour[1], this._endShieldColour[1],percentage);
        this._shieldColour[2] = Lerp.LerpFloat(this._beginShieldColour[2], this._endShieldColour[2],percentage);
      
        let opacityPercentage = (100 - this._shieldHealth)/100;
        console.log(opacityPercentage);
        this._opacity = Lerp.LerpFloat(1, 0, opacityPercentage);
        console.log(this._opacity);
    }

    draw(ctx, cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._shape.getOrigin().x - cameraPos.x,this._shape.getOrigin().y - cameraPos.y);
        ctx.rotate(this._shape.getAngle() * Math.PI/180);
        ctx.drawImage(Boss.BOSS_IMAGE,0,0,this._shape.getSize().x,this._shape.getSize().y,-this._shape.getSize().x/2,-this._shape.getSize().y/2,this._shape.getSize().x,this._shape.getSize().y);
        ctx.closePath();
        ctx.restore();

        this._shape.draw(ctx,cameraPos, this._color);
        ctx.save();
        ctx.beginPath();   
        ctx.translate(this._shape.getOrigin().x - cameraPos.x, this._shape.getOrigin().y - cameraPos.y);
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        if(this._shieldActive)
        {
            ctx.save();
            ctx.op
            ctx.lineWidth = 16;
            ctx.strokeStyle = `rgba(${this._shieldColour[0]}, ${this._shieldColour[1]},${this._shieldColour[2]},${this._opacity})`;
            ctx.beginPath();   
            ctx.translate(this._shape.getOrigin().x - cameraPos.x, this._shape.getOrigin().y - cameraPos.y);
            ctx.arc(0, 0, 250, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }

    getShape()
    {
        return this._shape;
    }

    getShieldActive()
    {
        return this._shieldActive;
    }

    setShieldActive(val)
    {
        this._shieldActive = val;
    }

    getShield()
    {
        return this._shield;
    }

    getShieldHealth()
    {
        return this._shieldHealth;
    }

    setShieldHealth(val)
    {
        this._shieldHealth -= val;
    }
}