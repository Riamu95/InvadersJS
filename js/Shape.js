export { Shape };

const Shape = function(pos,size)
{
    this._size = size;
    this._origin =  pos;
    this._points = [];
    this._angle = 0;
}

Shape.prototype.addPoint = function(point)
{
    this._points.push(point);
}

Shape.prototype.getPoints = function()
{
    return this._points;
}

Shape.prototype.getOrigin = function()
{
    return this._origin;
}

Shape.prototype.setOrigin = function(pos)
{
    this._origin.x = pos.x;
    this._origin.y = pos.y;
}

Shape.prototype.getSize = function()
{
    return this._size;
}

Shape.prototype.getAngle = function()
{
    return this._angle;
}

Shape.prototype.setAngle = function(_val)
{
   this._angle = _val;
}

Shape.prototype.addAngle = function(_val)
{
   this._angle += _val;
}

Shape.prototype.rotate = function(angle = (Math.PI/180) * this._angle )
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

Shape.prototype.updatePoints = function(velocity)
{
    this._origin.x += velocity.x;
    this._origin.y += velocity.y;

    this._points.forEach(point =>
    {
        point.x += velocity.x;
        point.y += velocity.y;
    })
}

Shape.prototype.draw = function(ctx,cameraPos,color)
{
    ctx.beginPath();
    ctx.strokeStyle = color;

    ctx.moveTo(this._points[0].x - cameraPos.x, this._points[0].y  - cameraPos.y);
    for( let i = 1; i < this._points.length; i++)
    {
        ctx.lineTo(this._points[i].x - cameraPos.x, this._points[i].y - cameraPos.y);
    }
    ctx.lineTo(this._points[0].x - cameraPos.x, this._points[0].y - cameraPos.y);
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.beginPath();
    ctx.translate(this._origin.x - cameraPos.x, this._origin.y  - cameraPos.y);
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}
