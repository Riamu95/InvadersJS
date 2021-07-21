class Boss extends Enemy
{
    constructor(pos, size)
    {
        super(pos,size, new Vec2(0,0));
        this.m_speed = 0;
        this._health = 100;
    }

    static BOSS_IMAGE = document.getElementById("boss");

    draw(ctx, cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
        ctx.drawImage(Boss.BOSS_IMAGE,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
        ctx.closePath();
        ctx.restore();
    }
}