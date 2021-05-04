class Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
     {
        this._pos = new Vec2(_x,_y);
        this._size = new Vec2(_width,_height);
        this._rect = new Rect(this._pos,this._size);
        this._velocity = new Vec2(_xVel, _yVel);
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

    draw(cameraPos)
    {
        c.save();
        c.beginPath();
        c.translate((this._pos.x + this._size.x/2) - cameraPos.x,(this._pos.y + this._size.y/2) - cameraPos.y);
        c.rotate(Math.PI/180 * this.m_angle);
        c.drawImage(enemyOne,0,0,this._size.x,this._size.y,0,0,this._size.x,this._size.y);
        c.closePath();
        c.restore();
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