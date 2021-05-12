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
        ctx.translate((this._pos.x + this._size.x/2) - cameraPos.x,(this._pos.y + this._size.y/2) - cameraPos.y);
        ctx.rotate(Math.PI/180 * this.m_angle);
        ctx.drawImage(enemyOne,0,0,this._size.x,this._size.y,0,0,this._size.x,this._size.y);
        ctx.closePath();
        ctx.restore();
    }
}