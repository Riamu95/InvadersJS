class MapGui extends GuiComponent
{
    constructor(_image,pos,size,_active,...listeners)
    {
        super(_image,pos,size,_active,...listeners);
        this._player = document.getElementById("playerMap");
        this._playerSize = new Vec2(23,18);        
    }

     draw(ctx,cameraPos = new Vec2(0,0), rotate)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate((cameraPos.x + this._pos.x) - cameraPos.x,(cameraPos.y + this._pos.y) - cameraPos.y);
        ctx.drawImage(this._image,0,0,this._size.x,this._size.y,-this._size.x/2,-this._size.y/2,this._renderSize.x,this._renderSize.y);
        ctx.closePath();
        ctx.restore();


        ctx.save();
        ctx.beginPath();
        ctx.translate((cameraPos.x + this._pos.x) - cameraPos.x,(cameraPos.y + this._pos.y) - cameraPos.y);
        ctx.rotate(rotate * (Math.PI/180));
        ctx.drawImage(this._player,0,0,this._playerSize.x,this._playerSize.y,-this._playerSize.x/2,-this._playerSize.y/2,this._playerSize.x,this._playerSize.y);
        ctx.closePath();
        ctx.restore();
    }
}