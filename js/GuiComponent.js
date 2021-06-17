const GuiComponent = function(_image,pos,size,_active,...listeners)
{
    this._image = document.getElementById(_image);
    this._listeners = listeners;
    this._active = _active;
    this._pos = pos;
    this._size = size;

    for(let i = 0; i < this._listeners.length; i++)
    {
        if (this._listeners[i] == "click")
            this._image.addEventListener(this._listeners[i],this.click);
        else if(this._listeners[i] == "hover")
            this._image.addEventListener(this._listeners[i],this.hover);
        else if(this._listeners[i] == "mouseEnter")
            this._image.addEventListener(this._listeners[i],this.mouseEnter);
        else if(this._listeners[i] == "mouseLeave")
            this._image.addEventListener(this._listeners[i],this.mousmousLeave);
    }
}

GuiComponent.prototype.setActive = function(val)
{
    this._active = val;
}

GuiComponent.prototype.update = function()
{

}

GuiComponent.prototype.click = function()
{

}

GuiComponent.prototype.hover = function()
{

}
GuiComponent.prototype.mouseEnter = function()
{

}

GuiComponent.prototype.mouseLeave = function()
{

}

GuiComponent.prototype.draw = function(ctx,cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate((cameraPos.x + this._pos.x) - cameraPos.x,(cameraPos.y + this._pos.y) - cameraPos.y);
    ctx.drawImage(this._image,0,0,this._size.x,this._size.y,-this._size.x/2,-this._size.y/2,this._size.x,this._size.y);
    ctx.closePath();
    ctx.restore();
}

GuiComponent.prototype.removeListeners = function()
{
    for(let i =0; i < this._listeners.length; i++)
    {
        if (this._listeners[i] == "click")
            this._image.removeListeners(this._listeners[i],this.click);
        else if(this._listeners[i] == "hover")
            this._image.removeListeners(this._listeners[i],this.hover);
        else if(this._listeners[i] == "mouseEnter")
            this._image.removeListeners(this._listeners[i],this.mouseEnter);
        else if(this._listeners[i] == "mouseLeave")
            this._image.removeListeners(this._listeners[i],this.mouseLeave);
    }
}


GuiComponent.prototype.getActive = function()
{
    return this._active;
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
GuiComponent.prototype.setSize = function(val)
{
    this._size = val;
}
