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
        console.log('jjj');
        ctx.save();
        ctx.beginPath();
        ctx.translate((this._pos.x + this._size.x/2) - cameraPos.x,(this._pos.y + this._size.y/2) - cameraPos.y);
        ctx.rotate(Math.PI/180 * this.m_angle);
        ctx.drawImage(enemyOne,0,0,this._size.x,this._size.y,0,0,this._size.x,this._size.y);
        ctx.closePath();
        ctx.restore();
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