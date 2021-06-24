class Camera
{
    constructor(x,y,width,height,worldWidth,worldHeight)
    {   
        this._pos = new Vec2(x,y);
        this._size= new Vec2(width,height);
        this._worldSize = new Vec2(worldWidth,worldHeight);
    }
    static background = document.getElementById('background');

    update(playerPos,canvasWidth,canvasHeight)
     {
        //dont use global variables here!!
        this._pos.x = playerPos.x - canvasWidth/2;
        this._pos.y = playerPos.y - canvasHeight/2;

        if(this._pos.x <= 0 ) 
        {
             this._pos.x = 0;
        }
        if( this._pos.x +  this._size.x >= this._worldSize.x)
        {
            this._pos.x = this._worldSize.x - this._size.x;
        }
        if(this._pos.y <= 0)
        {
            this._pos.y = 0;
        }
        if(this._pos.y  + this._size.y >= this._worldSize.y)
        {
            this._pos.y = this._worldSize.y - this._size.y;
        }
    }

    draw(ctx)
    {
        ctx.drawImage(Camera.background,this._pos.x,this._pos.y,this._size.x,this._size.y,0,0,this._size.x,this._size.y);
    }

    get getPos()
    {
        return this._pos;
    }
    get getSize()
    {
        return this._size;
    }
}