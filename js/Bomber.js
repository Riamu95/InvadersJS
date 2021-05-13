class Bomber extends Enemy
{
    constructor(pos,size,velocity,fp)
    {
        super(pos,size,velocity);
        this._flockPoint = fp;
        this._acceleration = new Vec2(0,0);
        this._VelocityLength = 0;
        this._maxSpeed = 0.5;
        this._maxForce = 1;
    }

   

    move (dt) 
    {
        this.generateFlockPoint();
        let seek = this.seek();
        this._acceleration.addVec = seek;

        this._velocity.addVec = this._acceleration;
        
       this._velocity.x += this._velocity.x * dt;
       this._velocity.y += this._velocity.y * dt;

       this._velocity.setMagnitude = this._maxSpeed;
       this.m_angle = Math.atan2(this._velocity.y,this._velocity.x) * 180 / Math.PI;
       this._rect.getPos().addVec = this._velocity;
       this._rect.updatePoints(this._velocity);
       this._acceleration = new Vec2(0,0);
       
      
    }

    generateFlockPoint()
    {
        if(Vec2.distance(this._rect.getOrigin(), this._flockPoint) < 50) 
        { 
            this._flockPoint = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
            console.log(this._velocity);
            console.log(this.m_angle);
        }
    }

    seek()
    {
        let steering = new Vec2(0,0);
        let direction = new Vec2(this._flockPoint.x - this._rect.getOrigin().x, this._flockPoint.y - this._rect.getOrigin().y);
        steering = Vec2.normalise(direction);
        steering = Vec2.subtractVec(steering, this._velocity);
        steering.setMagnitude = this._maxSpeed;
        
        return steering;
    }


    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate((this._rect._pos.x + this._rect._size.x/2) - cameraPos.x,(this._rect._pos.y + this._rect._size.y/2) - cameraPos.y);
        ctx.rotate(this.m_angle * Math.PI/180);
        ctx.drawImage(enemyOne,0,0,this._rect._size.x,this._rect._size.y,0,0,this._rect._size.x,this._rect._size.y);
        ctx.closePath();
        ctx.restore();
    }
}