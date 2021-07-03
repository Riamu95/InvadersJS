const ParticleProps = function(...properties)
{
    this.pos = properties[0],
    this.size =  properties[1],
    this.velocity = properties[2],
    this.dirVel = properties[3],
    this.colourBegin = properties[4],
    this.colourEnd = properties[5],
    this.active = properties[6],
    this.ttl = properties[7],
    this.totalLifeTime = properties[7],
    this.remainingLife = 0,
    this.angle = properties[8],
    this.maxSpeed = properties[9];
    this.startingOpacity = 1;
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
            this._particles.push(new Particle(new ParticleProps(new Vec2(0,0), new Vec2(15,15),new Vec2(0,0),
            new Vec2(0,0), [0,0,0, 0],[0, 0, 0,0],false,0,0,0)));
        }
    }

    emit(pos, direction, colourBegin, colourEnd, ttl, angle = 0 , maxSpeed)
    {
        if(!this._particles[ParticleSystem.currentIndex].getActive())
        {
            this._particles[ParticleSystem.currentIndex].setActive(true);
            this._particles[ParticleSystem.currentIndex].initTTL(ttl);
            this._particles[ParticleSystem.currentIndex].setTotalLifeTime(ttl);
            this._particles[ParticleSystem.currentIndex].getRect().setRect(pos);
            this._particles[ParticleSystem.currentIndex].setColourBegin(colourBegin);
            this._particles[ParticleSystem.currentIndex].setColourEnd(colourEnd);
            this._particles[ParticleSystem.currentIndex].setColour();
            this._particles[ParticleSystem.currentIndex].setAngle(angle);
            this._particles[ParticleSystem.currentIndex].setMaxSpeed(maxSpeed);
            this._particles[ParticleSystem.currentIndex].setDirectionalVelocity(direction); 
         }
        ParticleSystem.currentIndex > 0 ?  ParticleSystem.currentIndex = --ParticleSystem.currentIndex % this._particles.length :  ParticleSystem.currentIndex = this._particles.length - 1;
    }

    update(dt)
    {
        for(let i = this._particles.length - 1; i >= 0; i--)
        {
            if(!this._particles[i].getActive())
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
        this._particles[i].setOpacity(Lerp.LerpFloat(this._particles[i].getStartingOpacity(), 0, value));
        this._particles[i].getRect().rotate();
    }

    render(ctx, cameraPos)
    {
        ctx.save();
        for(let p =  this._particles.length - 1; p >= 0; p--)
        {
                if(!this._particles[p].getActive())
                    continue;

                ctx.beginPath();
               // ctx.fillStyle = `rgba(${this._particles[p]._colour[0]}, ${this._particles[p]._colour[1]},${this._particles[p]._colour[2]}, ${this._particles[p]._colour[3]})`;
               // ctx.fillRect(this._particles[p].getRect().getOrigin().x - cameraPos.x,this._particles[p].getRect().getOrigin().y - cameraPos.y,this._particles[p].getRect().getSize().x,this._particles[p].getRect().getSize().y);
                ctx.moveTo(this._particles[p].getPoints()[0].x - cameraPos.x , this._particles[p].getPoints()[0].y - cameraPos.y);
            
                for( let i = 1; i < this._particles[p].getPoints().length; i++)
                {
                    ctx.lineTo(this._particles[p].getPoints()[i].x - cameraPos.x, this._particles[p].getPoints()[i].y - cameraPos.y);
                }

                ctx.lineTo(this._particles[p].getPoints()[0].x  - cameraPos.x, this._particles[p].getPoints()[0].y - cameraPos.y);

                ctx.fillStyle = `rgba(${this._particles[p]._colour[0]}, ${this._particles[p]._colour[1]},${this._particles[p]._colour[2]}, ${this._particles[p].getOpacity()})`;
                ctx.fill();
               // ctx.fill([this._particles[p]._colour[0]}, ${this._particles[p]._colour[1]},${this._particles[p]._colour[2]}, ${this._particles[p]._colour[3]]);
                ctx.closePath();
        }  
        
        ctx.restore(); 
    }


}