class Enemy {

    constructor(pos,size,vel)
     {
        this._pos = new Vec2(pos.x,pos.y);
        this._size = new Vec2(size.x,size.y);
        this._rect = new Rect(this._pos,this._size);
        this._velocity = new Vec2(vel.x, vel.y);
        this.m_angle = 90;
        this.m_speed = 0.2;
        
        this._attack = false;
        this._attackDistance = 500;

        this._bullets = new Array();
        this._bulletTimer = 2000;
        this._timer = 0;
    }

    move (dt,playerPos,playerSize) 
    {
    
    }

    draw(ctx,cameraPos)
    {
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