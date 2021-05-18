const Circle = function(pos,radius)
{
    this._pos = new Vec2(pos.x,pos.y);
    this._radius = radius;
    this._angle = 0;
}

Circle.prototype.getAngle = function()
{
    return this._angle;
}
Circle.prototype.setAngle = function(_val)
{
    return this._angle = _val;
}
Circle.prototype.addAngle = function(_val)
{
    return this._angle += _val;
}

Circle.prototype.getPos = function()
{
    return this._pos;
}
Circle.prototype.getRadius = function()
{
    return this._radius;
}