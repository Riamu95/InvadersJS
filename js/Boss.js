class Boss 
{
    constructor(pos, size)
    {
        this._shape = new Shape(pos,size,8);
        this.createShape();
        this.m_speed = 0;
        this._health = 100;
    }

    static BOSS_IMAGE = document.getElementById("boss");
    
    createShape()
    {
        //left side
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2,this._shape.getOrigin().y - this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - this._shape.getSize().x/2,this._shape.getOrigin().y + 24));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - 42.5,this._shape.getOrigin().y + 94));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x - 5,this._shape.getOrigin().y + this._shape.getSize().y/2));
        //right side
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + 5,this._shape.getOrigin().y + this._shape.getSize().y/2));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + 42.5,this._shape.getOrigin().y  + 94));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2,this._shape.getOrigin().y + 24));
        this._shape.addPoint(new Vec2(this._shape.getOrigin().x + this._shape.getSize().x/2,this._shape.getOrigin().y - this._shape.getSize().y/2));
    }

    update(dt)
    {

    }

    draw(ctx, cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._shape.getOrigin().x - cameraPos.x,this._shape.getOrigin().y - cameraPos.y);
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
    }
}