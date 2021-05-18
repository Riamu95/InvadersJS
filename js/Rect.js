const Rect = function(pos,size)
{   

    Shape.call(this,pos,size);

    this._points.push(new Vec2(this._pos.x,this._pos.y));
    this._points.push(new Vec2(this._pos.x + this._size.x,this._pos.y));
    this._points.push(new Vec2(this._pos.x + this._size.x,this._pos.y + this._size.y));
    this._points.push(new Vec2(this._pos.x,this._pos.y + this._size.y));
}
Rect.prototype = Object.create(Shape.prototype);

Rect.prototype.contains = function(rect)
{
    return rect._pos.x > this._pos.x && rect._pos.x + rect._size.x < this._pos.x + this._size.x
        && rect._pos.y > this._pos.y && rect._pos.y + rect._size.y < this._pos.y + this._size.y;
}

Rect.prototype.intersects = function(rect)
{
    return !(rect._origin.x - rect._size.x / 2 > this._origin.x + this._size.x / 2 ||
             rect._origin.x + rect._size.x / 2 < this._origin.x - this._size.x / 2 ||
             rect._origin.y - rect._size.y / 2 > this._origin.y + this._size.y / 2 ||
             rect._origin.y + rect._size.y / 2 < this._origin.y - this._size.y / 2);
}

Rect.prototype.getRect = function()
{
    return this._points;
}


