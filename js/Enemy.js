class Enemy
{
    constructor(pos,size,vel)
     {
        this._rect = new Rect(pos,size);
        this._velocity = new Vec2(vel.x, vel.y);
        this.m_angle = 0;
        this.m_speed = 0.2;
        
        this._attack = false;
        this._attackDistance = 500;

        this._bullets = new Array();
    }

    move (dt,playerPos,playerSize) 
    {
    }

    draw(ctx,cameraPos)
    {
    }

    get getPos()
    {
        return this._pos;
    }
    get getVel()
    {
        return this._velocity;
    }
    get getSize()
    {
        return this._size;
    }
    get getRect()
    {
        return this._rect;
    }
    
}