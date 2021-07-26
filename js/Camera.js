import { Vec2 } from "./Vec2.js";
import { Lerp } from "./Lerp.js";
export { Camera };

class Camera
{
    constructor(x,y,width,height,worldWidth,worldHeight,_fadeTime)
    {   
        this._pos = new Vec2(x,y);
        this._size= new Vec2(width,height);
        this._worldSize = new Vec2(worldWidth,worldHeight);

        this._fadeIn = false;
        this._fadeOut = false;
        this._fadeTime = _fadeTime;
        this._fadeClock = 0;
    }

    static background = document.getElementById('background');
    static fadeImage = document.getElementById('fade')

    update(playerPos,canvasWidth = this._size.x,canvasHeight = this._size.y)
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

    fadeCameraIn(ctx , pos = this._pos)
    {
        let percentage = ((performance.now() - this._fadeClock)/1000)  / this._fadeTime;
        let opacity = Lerp.LerpFloat(0,1,percentage);
        ctx.globalAlpha = opacity;

        if(opacity >= 1)
        {
            this._fadeIn = false;
            this._fadeOut = true;
            this._fadeClock = performance.now();
            this.update(pos);
        }

        ctx.drawImage(Camera.fadeImage, 0, 0, this._size.x, this._size.y, 0, 0, this._size.x, this._size.y);
    }

    fadeCameraOut(ctx)
    {
        let percentage = ((performance.now() - this._fadeClock)/1000)  / this._fadeTime;
        let opacity = Lerp.LerpFloat(1,0,percentage);
        ctx.globalAlpha = opacity;

        if(opacity <= 0.0)
        {
            this.teleport_fadeOut = false;
        }
        ctx.drawImage(Camera.fadeImage, 0, 0, this._size.x, this._size.y, 0, 0, this._size.x, this._size.y);
    }

    get getPos()
    {
        return this._pos;
    }
    get getSize()
    {
        return this._size;
    }

    getFadeIn()
    {
        return this._fadeIn;
    }

    setFadeIn(val)
    {
        this._fadeIn = val;
    }

    getFadeOut()
    {
        return this._fadeOut;
    }

    setFadeOut(val)
    {
        this._fadeOut = val;
    }

    getFadeTime()
    {
        return this._fadeTime;
    }

    getFadeClock()
    {
        return this._fadeClock;
    }

    setFadeClock(val)
    {
        this._fadeClock = val;
    }
}