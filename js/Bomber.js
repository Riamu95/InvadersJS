class Bomber extends Enemy
{
    constructor(pos,size,velocity)
    {
        super(pos,size,velocity);
    }

    move (dt,playerPos,playerSize) 
    {
    
    }

    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate((this._rect._pos.x + this._rect._size.x/2) - cameraPos.x,(this._rect._pos.y + this._rect._size.y/2) - cameraPos.y);
        ctx.rotate(Math.PI/180 * this.m_angle);
        ctx.drawImage(enemyOne,0,0,this._rect._size.x,this._rect._size.y,0,0,this._rect._size.x,this._rect._size.y);
        ctx.closePath();
        ctx.restore();
    }
}