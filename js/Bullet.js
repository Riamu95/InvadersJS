import { Rect } from "./Rect.js";
import { Vec2 } from "./Vec2.js";
import { seek } from "./Steering.js";

export { Bullet };

class Bullet
{
    constructor(pos,size,_angle,maxSpeed)
    {
        this._rect = new Rect(pos,size);
        this._rect.setAngle(_angle);
        this._color = 'Red';
        this._velocity = new Vec2(0,0);
        this._timer = performance.now();
        this._maxSpeed = maxSpeed;
        this._steering = new Vec2(0,0);
    }

    move(dt)
    {
        this._velocity.x = Math.cos(this._rect.getAngle()) * dt;
        this._velocity.y = Math.sin(this._rect.getAngle()) * dt;
        this._velocity.setMagnitude = this._maxSpeed;
        this._rect.updatePoints(this._velocity);
    }

    seek(dt, targetPos)
    {
        this._steering = seek(targetPos, this._rect, this._velocity, this._maxSpeed);

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
        ctx.drawImage(Image,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos);
    }

    get getVel()
    {
        return this._velocity;
    }

    getTimer()
    {
        return this._timer;
    } 

    set setTimer(val)
    {
        this._timer = val;
    }

    get getRect()
    {
        return this._rect;
    }
}