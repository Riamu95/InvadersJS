class Particle
{
    constructor(particle)
    {
        this._beginSize = new Vec2(particle.size.x,particle.size.y);
        this._rect =  new Rect(particle.pos,particle.size);
        this._velocity =  new Vec2(particle.velocity.x, particle.velocity.y);
        this._colourEnd = particle.colourEnd;
        this._colourBegin =  [particle.colourBegin[0],particle.colourBegin[1],particle.colourBegin[2],particle.colourBegin[3]];
        this._colour =  [particle.colourBegin[0],particle.colourBegin[1],particle.colourBegin[2],particle.colourBegin[3]];
        this._active = particle.active;
        this._remainingLife = particle.remainingLife;
        this._ttl = particle.ttl;
        this._totalLifeTime = particle.totalLifeTime;
        //this._beginAngle = particle.beginAngle;
       // this._endAngle = particle.endAngle;
        this._angle = particle.angle;
        this._maxSpeed = particle.maxSpeed;
        this._speed = this._maxSpeed;
    }

    getRect()
    {
        return this._rect;
    }

    getMaxSpeed()
    {
        return this._maxSpeed;
    }

    getCurrentSpeed()
    {
        return this._speed;
    }

    getPoints()
    {
        return this._rect.getPoints();
    }

    getBeginSize()
    {
        return this._beginSize;
    }

    getColour()
    {
        return this._colour;
    }

    getColourEnd()
    {
        return this._colourEnd;
    }

    getColourBegin()
    {
        return this._colourBegin;
    }

    getSize()
    {
        return this._rect.getSize();
    }

    getOrigin()
    {
        return this._rect.getOrigin();
    }

    getVelocity()
    {
        return this._velocity;
    }

    getTTL()
    {
        return this._ttl;
    }

    getTotalLifeTime()
    {
        return this._totalLifeTime;
    }

    setTotalLifeTime(val)
    {
        this._totalLifeTime = val;
    }

    getRemainingLife()
    {
        return this._remainingLife;
    }

    setMaxSpeed(val)
    {
        this._maxSpeed = val;
    }

    setCurrentSpeed(val)
    {
        this._speed = val;
    }

    setVelocity(dt)
    {   
        this._velocity.x = Math.cos(this._angle  * Math.PI / 180);
        this._velocity.y = Math.sin(this._angle  * Math.PI / 180);

        this._velocity.setMagnitude = this._speed;

        this._velocity.x = this._velocity.x * dt;
        this._velocity.y = this._velocity.y * dt;
    }

    setColourBegin(val)
    {
        this._colourBegin[0] = val[0];
        this._colourBegin[1] = val[1];
        this._colourBegin[2] = val[2];
        this._colourBegin[3] = val[3];
    }

    setColour()
    {
        this._colour[0] = this._colourBegin[0];
        this._colour[1] = this._colourBegin[1];
        this._colour[2] = this._colourBegin[2];
        this._colour[3] = this._colourBegin[3];
    }

    setColourEnd(val)
    {
        this._colourEnd[0] = val[0];
        this._colourEnd[1] = val[1];
        this._colourEnd[2] = val[2];
        this._colourEnd[3] = val[3];
    }

    setTTl(val)
    {
        this._ttl -= val;
        this._remainingLife = performance.now();
    }

    initTTL(val)
    {
        this._ttl = val;
    }

    setActive(val)
    {
        if(!val)
        {
            this._active = false;
        }
        else
        {
            this._active = true;
            this._remainingLife = performance.now();
        }   
    }

    setRemainingLife(val)
    {
        this._remainingLife = val
    }

    setAngle(val)
    {
        this._angle = val;
    }
}