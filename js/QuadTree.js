const QuadTree = function(pos,size,capacity)
{    
    this._rect = new Rect(pos,size);
    this._capacity = capacity;
    this._rectangles = [];
    this._divided = false;
}

QuadTree.prototype.insert = function(rect)
{
    if(!this._rect.intersects(rect))
    {
        return false;
    }

    if(this._rectangles.length <= this._capacity)
    {
        this._rectangles.push(rect);
       return true;
    }
    else
    {   
        if(!this._divided)
        {
            this.subdivide();
        }

        //north east gets insertion prefference
        if(this._northEast.insert(rect)) return true;
        if(this._northWest.insert(rect)) return true;
        if(this._southWest.insert(rect)) return true;
        if(this._southEast.insert(rect)) return true;
   }
  console.log(rect);
  return false;
}
QuadTree.prototype.subdivide = function()
{
        //split qudtree
        this._northEast = new QuadTree(new Vec2(this._rect._pos.x + this._rect._size.x/2,this._rect._pos.y,this._rect._size.x/2,this._rect._size.y/2),new Vec2(this._rect._size.x/2,this._rect._size.y/2),this._capacity);
        this._northWest = new QuadTree(new Vec2(this._rect._pos.x,this._rect._pos.y,this._rect._size.x/2,this._rect._size.y/2),new Vec2(this._rect._size.x/2,this._rect._size.y/2),this._capacity);
        this._southWest = new QuadTree(new Vec2(this._rect._pos.x,this._rect._pos.y + this._rect._size.y/2,this._rect._size.x/2,this._rect._size.y/2),new Vec2(this._rect._size.x/2,this._rect._size.y/2),this._capacity);
        this._southEast = new QuadTree(new Vec2(this._rect._pos.x + this._rect._size.x/2,this._rect._pos.y + this._rect._size.y/2,this._rect._size.x/2,this._rect._size.y/2),new Vec2(this._rect._size.x/2,this._rect._size.y/2),this._capacity);
        this._divided = true;
}

QuadTree.prototype.query = function (rect,objects) {
    
    //if its not intersecting
    if (!this._rect.intersects(rect)) 
    {
        return;
    }
    else
    {
        this._rectangles.forEach(obj =>
        {
            if (obj.intersects(rect)) {
                objects.push(obj);
                console.log('pushed');
            }
           
        });
    }   

    if(this._divided)
    {
        //when not intersecting returns undeifned which is added to array
       this._northEast.query(rect,objects);
       this._northWest.query(rect,objects);
       this._southWest.query(rect,objects);
       this._southEast.query(rect,objects);
    }
    
    return objects;
}

QuadTree.prototype.draw = function(ctx,cameraPos)
{
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 10;
    ctx.moveTo(this._rect._points[0].x - cameraPos.x, this._rect._points[0].y  - cameraPos.y);
    ctx.lineTo(this._rect._points[1].x - cameraPos.x, this._rect._points[1].y - cameraPos.y);
    ctx.lineTo(this._rect._points[2].x - cameraPos.x, this._rect._points[2].y - cameraPos.y);
    ctx.lineTo(this._rect._points[3].x - cameraPos.x, this._rect._points[3].y - cameraPos.y);
    ctx.lineTo(this._rect._points[0].x - cameraPos.x, this._rect._points[0].y - cameraPos.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    if(this._divided)
    {
        this._northEast.draw(ctx,cameraPos);
        this._northWest.draw(ctx,cameraPos);
        this._southWest.draw(ctx,cameraPos);
        this._southEast.draw(ctx,cameraPos);
    }
}





