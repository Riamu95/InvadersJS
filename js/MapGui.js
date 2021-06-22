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
        this._active = true;
        this._reload = 3;
        this._scan = 3;
        this._reloadTimer = 0;
        this._scanTimer = performance.now();
        this._renderSize = new Vec2(266,266);
    }

    addNPCPos(val)
    {
        this._npcPos.push(val);
    }

    update(animationManager,cameraPos)
    {
        this._pos.x = cameraPos.x + CANVAS_WIDTH/1.1;
        this._pos.y = cameraPos.y + CANVAS_HEIGHT/6;

        if(!this._active && ((performance.now() - this._scanTimer)/1000) >= this._scan)
        {
            this._active = true;
            this._reloadTimer = performance.now();
        }
        if(this._active && ((performance.now() - this._reloadTimer)/1000) >= this._reload)
        {
            this._active = false;
            this._scanTimer = performance.now();
            animationManager.addAnimation(6,0.5,this._pos,this._image,this._renderSize);
        }
    }

     drawMap(ctx,cameraPos = new Vec2(0,0))
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate(this._pos.x - cameraPos.x, this._pos.y - cameraPos.y);
        ctx.drawImage(this._image,0,0,this._renderSize.x,this._renderSize.y,-this._renderSize.x/2,-this._renderSize.y/2,this._renderSize.x,this._renderSize.y);
        ctx.closePath();
        ctx.restore();
    }

    drawObjects(ctx,cameraPos = new Vec2(0,0), rotate, playerPos)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate(this._pos.x - cameraPos.x, this._pos.y - cameraPos.y);
        ctx.rotate(rotate * (Math.PI/180));
        ctx.drawImage(this._player,0,0,this._playerSize.x,this._playerSize.y,-this._playerSize.x/2,-this._playerSize.y/2,this._playerSize.x,this._playerSize.y);
        ctx.closePath();
        ctx.restore();

        if(this._active)
        {
            ctx.save();
            ctx.fillStyle  = "red";
            this._npcPos[0].forEach(bomber =>
            {
                this.calculateNPCRadarPos(bomber.getRect.getOrigin(), playerPos,cameraPos);
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
                    this.calculateNPCRadarPos(minion.getRect.getOrigin(), playerPos,cameraPos);
                    ctx.beginPath();
                    ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();
                });
            });

            ctx.fillStyle  = "yellow";
            this._npcPos[2].forEach(asteroid =>
            {
                this.calculateNPCRadarPos(asteroid.getRect().getOrigin(), playerPos,cameraPos);
                ctx.beginPath();
                ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            });

            ctx.fillStyle  = "black";
            this._npcPos[3].forEach(bh =>
            {
                this.calculateNPCRadarPos(bh.getRect().getOrigin(), playerPos,cameraPos);
                ctx.beginPath();
                ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            });
            ctx.restore();
        }
    }

    calculateNPCRadarPos(enemyPos, playerPos,cameraPos)
    {
        Vec2.distance(enemyPos, playerPos) > this._radarRange ? this._scalar = this._radius 
            : this._scalar = Vec2.distance(enemyPos, playerPos)/25;

            this._enemyRadarPos.x = enemyPos.x - playerPos.x;
            this._enemyRadarPos.y = enemyPos.y - playerPos.y;

            this._enemyRadarPos = Vec2.normalise(this._enemyRadarPos);
            this._enemyRadarPos.setMagnitude =  this._scalar;
            this._enemyRadarPos.x += (this._pos.x - cameraPos.x);
            this._enemyRadarPos.y += (this._pos.y -cameraPos.y);
    }
}