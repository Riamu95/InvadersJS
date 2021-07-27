import { Rect } from "./Rect.js";
import { Vec2 } from "./Vec2.js";
export { ShieldNode };
class ShieldNode
{
    static _image = document.getElementById("shieldNode");
    
    constructor(pos)
    {
        this._rect = new Rect(pos, new Vec2(101,95));
        this._active = true;
    }

    update()
    {

    }

    draw(ctx, cameraPos)
    {
        if(!this._active)
            return;
    
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._rect.getOrigin().x - cameraPos.x, this._rect.getOrigin().y - cameraPos.y);
        ctx.drawImage(ShieldNode._image, 0,0, this._rect.getSize().x, this._rect.getSize().y, -this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
        ctx.closePath();
        ctx.restore();
    }

    getRect()
    {
        return this._rect;
    }

    getPos()
    {
        return this._rect.getOrigin();
    }

    getActive()
    {
        return this._active;
    }

    setActive(val)
    {
        this._active = val;
    }

}