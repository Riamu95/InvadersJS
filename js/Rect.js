const Rect = function(pos,size)
{
    //refers to top left point
    this._pos = pos;
    this._size = size;
    this._origin = new Vec2(this._pos.x + this._size.x/2,this._pos.y + this._size.y/2);
    this._points = [];
    this._angle = 0;
    this._points.push(new Vec2(this._pos.x,this._pos.y));
    this._points.push(new Vec2(this._pos.x + this._size.x,this._pos.y));
    this._points.push(new Vec2(this._pos.x + this._size.x,this._pos.y + this._size.y));
    this._points.push(new Vec2(this._pos.x,this._pos.y + this._size.y));
}

Rect.prototype.getPoints = function()
{
    return this._points;
}
Rect.prototype.getOrigin = function()
{
    return this._origin;
}

Rect.prototype.getPos = function()
{
    return this._pos;
}

Rect.prototype.rotate = function(angle,previousAngle)
{
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        this._points.forEach(point =>
        {
        //translate point to origin
        let translated_x = point.x - this._origin.x;
        let translated_y = point.y - this._origin.y;
        //apply rotation to point and re translate
        point.x = translated_x * cos - translated_y * sin + this._origin.x;
        point.y = translated_x * sin + translated_y * cos + this._origin.y;
        });
}

Rect.prototype.setPos = function(pos)
{
    this._pos = pos;
    this._origin.x = this._pos.x + this._size.x/2;
    this._origin.y = this._pos.y + this._size.y/2;
}

Rect.prototype.updatePoints = function(velocity)
{
    this._origin.x += velocity.x;
    this._origin.y += velocity.y;

    this._points[0].x += velocity.x;
    this._points[0].y += velocity.y;

    this._points[1].x += velocity.x;
    this._points[1].y += velocity.y;

    this._points[2].x += velocity.x;
    this._points[2].y += velocity.y;

    this._points[3].x += velocity.x;
    this._points[3].y += velocity.y;

}

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

Rect.prototype.draw = function(ctx,cameraPos,color)
{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(this._points[0].x - cameraPos.x, this._points[0].y  - cameraPos.y);
    ctx.lineTo(this._points[1].x - cameraPos.x, this._points[1].y - cameraPos.y);
    ctx.lineTo(this._points[2].x - cameraPos.x, this._points[2].y - cameraPos.y);
    ctx.lineTo(this._points[3].x - cameraPos.x, this._points[3].y - cameraPos.y);
    ctx.lineTo(this._points[0].x - cameraPos.x, this._points[0].y - cameraPos.y);
    ctx.stroke();
    ctx.closePath();
}
