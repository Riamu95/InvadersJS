const Circle = function(pos,radius)
{
    this._pos = new Vec2(pos.x,pos.y);
    this._radius = radius;
}
Circle.prototype.getPos = function()
{
    return this._pos;
}
Circle.prototype.getRadius = function()
{
    return this._radius;
}