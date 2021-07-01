const ParticleProps = function(...properties)
{
    this.pos = properties[0],
    this.size =  properties[1],
    this.velocity = properties[2],
    this.colourBegin = properties[3],
    this.colourEnd = properties[4],
    this.active = properties[5],
    this.ttl = properties[6],
    this.totalLifeTime = properties[6],
    this.remainingLife = 0,
    this.angle = properties[7],
    this.maxSpeed = properties[8];
}

class ParticleSystem
{
    constructor()
    {
        this._particles = [];
        this.init();
    }
    static particleCount = 1000;
    static currentIndex = 999;

    init()
    {
        for(let i = 0; i < ParticleSystem.particleCount; i++)
        {
            this._particles.push(new Particle(new ParticleProps(new Vec2(0,0), new Vec2(15,15),
            new Vec2(0,0), [0,0,0, 0],[0, 0, 0,0],false,0,0,0)));
        }
    }

    emit(particleProp)
    {
        this._particles[ParticleSystem.currentIndex].setActive(true);
        this._particles[ParticleSystem.currentIndex].initTTL(particleProp.ttl);
        this._particles[ParticleSystem.currentIndex].setTotalLifeTime(particleProp.totalLifeTime);
        this._particles[ParticleSystem.currentIndex].getRect().setRect(particleProp.pos);
        this._particles[ParticleSystem.currentIndex].setColourBegin(particleProp.colourBegin);
        this._particles[ParticleSystem.currentIndex].setColourEnd(particleProp.colourEnd);
        this._particles[ParticleSystem.currentIndex].setColour();
        this._particles[ParticleSystem.currentIndex].setAngle(particleProp.angle);
        this._particles[ParticleSystem.currentIndex].setMaxSpeed(particleProp.maxSpeed);

        ParticleSystem.currentIndex > 0 ?  ParticleSystem.currentIndex = --ParticleSystem.currentIndex % this._particles.length :  ParticleSystem.currentIndex = this._particles.length - 1;
    }

    update(dt)
    {
        for(let i = this._particles.length - 1; i >= 0; i--)
        {
            if(!this._particles[i]._active)
                    continue;
            
            this._particles[i].setTTl((performance.now() - this._particles[i].getRemainingLife()) /1000);
            
            if(this._particles[i].getTTL() < 0)
            {
                this._particles[i].setActive(false);
                continue;
            }
            this._particles[i].getRect().setAngle(1);
             //lerp all values here
            this.adjustProperties(i,dt);
        }
    }

    adjustProperties(i,dt)
    {
        let  value = (this._particles[i].getTotalLifeTime() - this._particles[i].getTTL())/this._particles[i].getTotalLifeTime();

        this._particles[i].setCurrentSpeed(Lerp.LerpFloat(this._particles[i].getMaxSpeed(),0,value));
        this._particles[i].setVelocity(dt);
        
        this._particles[i].getRect().updatePoints(new Vec2(this._particles[i].getVelocity().x, this._particles[i].getVelocity().y));
       
        //this._particles[i].getRect().setSize(Lerp.LerpVec(this._particles[i].getBeginSize(), new Vec2(0,0), value));
        //this._particles[i].getRect().setSizes();
        //console.log( this._particles[i].getRect().getSize());

        this._particles[i].getColour()[0] = Lerp.LerpFloat(this._particles[i].getColourBegin()[0], this._particles[i].getColourEnd()[0], value);
        this._particles[i].getColour()[1] = Lerp.LerpFloat(this._particles[i].getColourBegin()[1], this._particles[i].getColourEnd()[1], value);
        this._particles[i].getColour()[2] = Lerp.LerpFloat(this._particles[i].getColourBegin()[2], this._particles[i].getColourEnd()[2], value);
        this._particles[i].getColour()[3] = Lerp.LerpFloat(this._particles[i].getColourBegin()[3], 0, value);
        
    }

    render(ctx, cameraPos)
    {
       for(let p =  this._particles.length - 1; p >= 0; p--)
       {
            if(!this._particles[p]._active)
                 continue;

            ctx.beginPath();
            ctx.fillStyle = `rgba(${this._particles[p]._colour[0]}, ${this._particles[p]._colour[1]},${this._particles[p]._colour[2]}, ${this._particles[p]._colour[3]})`;
    
            this._particles[p].getRect().rotate();
            ctx.moveTo(this._particles[p].getPoints()[0].x - cameraPos.x , this._particles[p].getPoints()[0].y - cameraPos.y);
        
            for( let i = 1; i < this._particles[p].getPoints().length; i++)
            {
                ctx.lineTo(this._particles[p].getPoints()[i].x - cameraPos.x, this._particles[p].getPoints()[i].y - cameraPos.y);
            }

            ctx.lineTo(this._particles[p].getPoints()[0].x  - cameraPos.x, this._particles[p].getPoints()[0].y - cameraPos.y);

            ctx.fill();
            ctx.closePath();
       }   
    }
}