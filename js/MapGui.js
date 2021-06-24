class MapGui extends GuiComponent
{
    constructor(_image,pos,size,_activateAnimation,...listeners)
    {
        super(_image,pos,size,_activateAnimation,...listeners);
        this._player = document.getElementById("playerMap");
        this._playerSize = new Vec2(23,18); 
        this._npcPos = [];
        this._radius = 120;
        this._radarRange = 3000;
        this._scalar = 120;
        this._enemyRadarPos = new Vec2(0,0);
        this._renderSize = new Vec2(266,266);
       
        this._radarReloadTime = 3;
        this._radarReloadClock = performance.now();

        this._radarAnimationTime = 3;
        this._radarAnimationClock = performance.now();
        this._activateAnimation = false;
        
        this._renderClock = performance.now();
        this._render = false;
        this._renderTime = 0.2;
    }

    addNPCPos(val)
    {
        this._npcPos.push(val);
    }

    update(animationManager,cameraPos,canvasWidth,canvasHeight)
    {
        this._pos.x = cameraPos.x + canvasWidth/1.1;
        this._pos.y = cameraPos.y + canvasHeight/6;

        //if radar timer has passed add radar animation
        if(!this._activateAnimation && ((performance.now() - this._radarReloadClock)/1000) >= this._radarReloadTime)
        {
            this._activateAnimation = true;
            this._radarAnimationClock = performance.now();
            animationManager.addAnimation(6,0.5,this._pos,"MAP",this._renderSize);
        }//if radar animation activates, wait radar animation time duration
        if(this._activateAnimation && ((performance.now() - this._radarAnimationClock)/1000) >= this._radarAnimationTime)
        {
            this._activateAnimation = false;
            //render objects on radar
            this._render = true;
            this._renderClock = performance.now();
            this._radarReloadClock = performance.now();
        }
        //redner objects for given time
        /*if(this._render && (performance.now() - this._renderClock)/1000 > this._renderTime)
        {
            this._render = false;
        }*/

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

    drawObjects(ctx,cameraPos = new Vec2(0,0), rotate, playerPos,animationManager)
    {
        ctx.save();
        ctx.beginPath();      
        ctx.translate(this._pos.x - cameraPos.x, this._pos.y - cameraPos.y);
        ctx.rotate(rotate * (Math.PI/180));
        ctx.drawImage(this._player,0,0,this._playerSize.x,this._playerSize.y,-this._playerSize.x/2,-this._playerSize.y/2,this._playerSize.x,this._playerSize.y);
        ctx.closePath();
        ctx.restore();

        if(this._render)
        {
            ctx.save();
            ctx.fillStyle  = "red";
            this._npcPos[0].forEach(bomber =>
            {
                this.calculateNPCRadarPos(bomber.getRect.getOrigin(), playerPos,cameraPos);
                animationManager.addAnimation(4,0.2,new Vec2(cameraPos.x + this._enemyRadarPos.x,cameraPos.y + this._enemyRadarPos.y)
                                                ,"BOMBER", new Vec2(20,30));
                //ctx.beginPath();
               // ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
               // ctx.fill();
               // ctx.closePath();
            });
            
            ctx.fillStyle  = "blue";
            this._npcPos[1].forEach(minionArray => 
            {
                minionArray.forEach( minion => 
                {
                    this.calculateNPCRadarPos(minion.getRect.getOrigin(), playerPos,cameraPos);
                    animationManager.addAnimation(4,0.2,new Vec2(cameraPos.x + this._enemyRadarPos.x,cameraPos.y + this._enemyRadarPos.y)
                    ,"MINION", new Vec2(20,30));
                    /*ctx.beginPath();
                    ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();*/
                });
            });

            ctx.fillStyle  = "yellow";
            this._npcPos[2].forEach(asteroid =>
            {
                this.calculateNPCRadarPos(asteroid.getRect().getOrigin(), playerPos,cameraPos);
                animationManager.addAnimation(4,0.2,new Vec2(cameraPos.x + this._enemyRadarPos.x,cameraPos.y + this._enemyRadarPos.y)
                ,"ASTEROID", new Vec2(20,30));
                /*ctx.beginPath();
                ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();*/
            });

            ctx.fillStyle  = "black";
            this._npcPos[3].forEach(bh =>
            {
                this.calculateNPCRadarPos(bh.getRect().getOrigin(), playerPos,cameraPos);
                animationManager.addAnimation(4,0.2,new Vec2(cameraPos.x + this._enemyRadarPos.x,cameraPos.y + this._enemyRadarPos.y)
                ,"BH", new Vec2(20,30));
                /*ctx.beginPath();
                ctx.arc((cameraPos.x + this._enemyRadarPos.x) - cameraPos.x, (cameraPos.y + this._enemyRadarPos.y) - cameraPos.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();*/
            });
            ctx.restore();
        }
        this._render = false;
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
            this._enemyRadarPos.y += (this._pos.y - cameraPos.y);
    }
}