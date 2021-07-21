const GuiComponent = function(_image,pos,size,_active,...listeners)
{
    this._image = document.getElementById(_image);
    this._listeners = listeners;
    
    this._active = _active;
    this._pos = new Vec2(pos.x,pos.y);
    this._size = new Vec2(size.x,size.y);
    this._renderSize = new Vec2(size.x,size.y);
    this._renderPos = new Vec2(0,0);

    for(let i = 0; i < this._listeners.length; i++)
    {
        let type = Object.keys(this._listeners[i]);
        let value = Object.values(this._listeners[i]);

        if(type == "mouseenter" && value[0] == null)
        {
            value[0] = this.mouseEnter;
        }
        else if(type == "mouseleave" && value[0] == null)
        {
            value[0] = this.mouseLeave;
        }

        if (type == "click")
            this._image.addEventListener(type,value[0]);
        else if(type == "mouseenter")
            this._image.addEventListener(type,value[0]);
        else if(type == "mouseleave")
            this._image.addEventListener(type,value[0]);
    }
}

GuiComponent.prototype.setActive = function(val)
{
    this._active = val;
}

GuiComponent.prototype.mouseEnter = function(e)
{
    //AudioManager.getInstance().playSound("buttonHover");

    /*
    if(e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/play.png')
    {
        e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playClicked.png';
    } 
    else if(e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/unquit.png')
    {
        e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/quitClicked.png';
    } 
    else if(e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgain.png')
    {
        e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgainClicked.png';
    } 
    */
   console.log(e.target.src);

    if(e.target.src == '/Assets/buttons/play.png')
    {
        e.target.src = '/Assets/buttons/playClicked.png';
    } 
    else if(e.target.src == '/Assets/buttons/unquit.png')
    {
        e.target.src = '/Assets/buttons/quitClicked.png';
    } 
    else if(e.target.src == '/Assets/buttons/playAgain.png')
    {
        e.target.src = '/Assets/buttons/playAgainClicked.png';
    } 
}

GuiComponent.prototype.mouseLeave = function(e)
{

    if (e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playClicked.png')
    {
        e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/play.png';
    }
    else if (e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/quitClicked.png')
    {
        e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/unquit.png';
    } 
    else if (e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgainClicked.png')
    {
        e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgain.png';
    }
}

GuiComponent.prototype.draw = function(ctx,cameraPos = new Vec2(0,0))
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate((cameraPos.x + this._pos.x) - cameraPos.x,(cameraPos.y + this._pos.y) - cameraPos.y);
    ctx.drawImage(this._image,this._renderPos.x,this._renderPos.y,this._size.x,this._size.y,-this._size.x/2,-this._size.y/2,this._renderSize.x,this._renderSize.y);
    ctx.closePath();
    ctx.restore();
}

GuiComponent.prototype.removeListeners = function()
{
    for(let i =0; i < this._listeners.length; i++)
    {
        let type = Object.keys(this._listeners[i]);
        let value = Object.values(this._listeners[i]);

        if(type == "mouseenter" && value[0] == null)
        {
            value[0] = this.mouseEnter;
        }
        else if(type == "mouseleave" && value[0] == null)
        {
            value[0] = this.mouseLeave;
        }

        if (type == "click")
            this._image.removeEventListener(type,value[0]);
        else if(type == "mouseenter")
            this._image.removeEventListener(type,value[0]);
        else if(type == "mouseleave")
            this._image.removeEventListener(type,value[0]);
    }
}

GuiComponent.prototype.getActive = function()
{
    return this._active;
}

GuiComponent.prototype.getImage = function()
{
    return this._image;
}

GuiComponent.prototype.getPos = function()
{
    return this._pos;
}

GuiComponent.prototype.setPos = function(val)
{
    this._pos = val;
}

GuiComponent.prototype.getSize = function()
{
    return this._size;
}

GuiComponent.prototype.getRenderSize = function()
{
    return this._renderSize;
}

GuiComponent.prototype.setSize = function(val)
{
    this._size = val;
}

GuiComponent.prototype.setRenderSize = function(val)
{
    this._renderSize.x -= val.x;
    this._renderSize.y -= val.y;
}

GuiComponent.prototype.setRenderPos = function(val)
{
    this._renderPos.x = val.x;
    this._renderPos.y = val.y;
}