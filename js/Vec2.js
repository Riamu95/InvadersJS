
class Vec2 
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
    get getVec2()
    {
        return this;
    }
    set addVec(vec)
    {
        this.x += vec.x;
        this.y += vec.y;
    }
    set div(value)
    {
        this.x /= value;
        this.y /= value;
    }
    set setMagnitude(value)
    {
        let mag = Vec2.length(this);
        this.x = this.x * value / mag;
        this.y = this.y * value / mag;
    }
    static subtractVec(one, two)
    {
        return new Vec2(one.x - two.x,one.y - two.y); 
    }

    set multiply(value)
    {
        this.x *= value;
        this.y *= value;
    }

    static limit(vec,value)
    {
        let msq = vec.x * vec.x +  vec.y * vec.y;
    
        if(msq > value * value)
        {
            vec.div = Math.sqrt(msq);
            vec.x *= value;
            vec.y *= value;
        }
        return vec;
    }

    static length(vec)
    {
        let length = vec.x* vec.x + vec.y * vec.y;
        return Math.sqrt(length);
    }
    static distance(a, b)
    {
        let  distance = new Vec2(a.x - b.x , a.y - b.y);
        return  Vec2.length(distance);
    }
    static normalise(vec)
    {
        let len = this.length(vec);
        if( len > 0)
             vec = new Vec2(vec.x/len,vec.y/len);

        return vec;
    }
    static dotProduct(vec1, vec2)
    {
       return vec1.x * vec2.x + vec1.y * vec2.y;
    }
}