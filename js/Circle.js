export { Circle }; 

class Circle 
{
    constructor(pos, radius)
    {
        this._pos = pos;
        this._radius = radius;
    }

    getPos()
    {
        return this._pos;
    }
    getRadius()
    {
        return this._radius;
    }

}