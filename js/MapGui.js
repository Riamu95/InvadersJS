class MapGui extends GuiComponent
{
    constructor(_image,pos,size,_active,...listeners)
    {
        super(_image,pos,size,_active,...listeners);
        this._player = document.getElementById("playerMap");
        this._playerSize = new Vec2(23,18); 
        this._npcPos = [];
        this._radius = 120;
        this._radarRange = 1500;
        this._scalar = 25;    
    }

    addNPCPos(val)
    {
        this._npcPos.push(val);
    }

     draw(ctx,cameraPos = new Vec2(0,0), rotate,playerPos)
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

        ctx.save();
        ctx.fillStyle  = "red";
        this._npcPos[0].forEach(bomber =>
        {
            ctx.beginPath();

            Vec2.distance(bomber.getRect.getOrigin(), playerPos) > this._radarRange ? this._scalar = this._radius 
                                                                        : this._scalar = Vec2.distance(bomber.getRect.getOrigin(), playerPos)/12.5;
                                                                        
            let vecDirection = new Vec2(bomber.getRect.getOrigin().x - playerPos.x, bomber.getRect.getOrigin().y - playerPos.y);
            vecDirection = Vec2.normalise(vecDirection);
            vecDirection.setMagnitude =  this._scalar;
            vecDirection.x += this._pos.x;
            vecDirection.y += this._pos.y;
            
            ctx.arc((cameraPos.x + vecDirection.x) - cameraPos.x, (cameraPos.y + vecDirection.y) - cameraPos.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        });
        ctx.restore();
    }
}