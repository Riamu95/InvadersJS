class MapGui extends GuiComponent
{
    constructor(_image,pos,size,_active,...listeners)
    {
        super(_image,pos,size,_active,...listeners);
        this._player = document.getElementById("playerMap");
        this._playerSize = new Vec2(23,18); 
        this._npcPos = [];
        this._radius = 120;
        this._radarRange = 3000;
        this._scalar = 120;
        this._enemyRadarPos = new Vec2(0,0);  
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
            this.calculateNPCRadarPos(bomber.getRect.getOrigin(), playerPos);
            ctx.beginPath();
            ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        });

        ctx.fillStyle  = "blue";
        this._npcPos[1].forEach(minionArray => 
        {
            minionArray.forEach( minion => 
            {
                this.calculateNPCRadarPos(minion.getRect.getOrigin(), playerPos);
                ctx.beginPath();
                ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 4, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            });
        });
        ctx.fillStyle  = "yellow";
        this._npcPos[2].forEach(asteroid =>
        {
            this.calculateNPCRadarPos(asteroid.getRect().getOrigin(), playerPos);
            ctx.beginPath();
            ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        });
        ctx.fillStyle  = "black";
        this._npcPos[3].forEach(bh =>
        {
            this.calculateNPCRadarPos(bh.getRect().getOrigin(), playerPos);
            ctx.beginPath();
            ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        });
        ctx.restore();
    }




    calculateNPCRadarPos(enemyPos, playerPos)
    {
        Vec2.distance(enemyPos, playerPos) > this._radarRange ? this._scalar = this._radius 
            : this._scalar = Vec2.distance(enemyPos, playerPos)/25;

            this._enemyRadarPos.x = enemyPos.x - playerPos.x;
            this._enemyRadarPos.y = enemyPos.y - playerPos.y;

            this._enemyRadarPos = Vec2.normalise(this._enemyRadarPos);
            this._enemyRadarPos.setMagnitude =  this._scalar;
            this._enemyRadarPos.x += this._pos.x;
            this._enemyRadarPos.y += this._pos.y;
    }
}