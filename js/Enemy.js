import { Rect } from "./Rect.js";
import { Vec2 } from "./Vec2.js";
export { Enemy };

class Enemy
{
    constructor(pos,size,vel)
     {
        this._rect = new Rect(pos,size);
        this._velocity = new Vec2(vel.x, vel.y);
        this.m_speed = 0.2;
        this._acceleration = new Vec2(0,0);
        this._attack = false;
        this._attackDistance = 500;
        this._health = null;
        this._collisionDamage = null;
    }

    move (dt,playerPos,playerSize) 
    {
    }

    draw(ctx,cameraPos)
    {
    }

    get getVel()
    {
        return this._velocity;
    }
    get getRect()
    {
        return this._rect;
    }

    get getHealth()
    {
        return this._health;
    }

    set setHealth(val)
    {
        this._health += val;
    }

    checkHealth()
    {
        return this._health < 1;
    }
}