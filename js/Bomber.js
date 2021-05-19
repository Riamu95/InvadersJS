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
        this._attackDistance = 500;
        this._attack = false;
        this._attackTimer = 0;
        this._reloadTimer = 5;
        this._previousflockPoint = new Vec2(0,0);
        this._previousAngle = 0;
        this._maxBulletSpeed = 2;
        this._bullets = new Array();
    }

   
    move (dt,playerPos) 
    {
        this.generateFlockPoint();
        this.attack(playerPos);
        let seek = this.seek();
        this._acceleration.addVec = seek;

        this._velocity.addVec = this._acceleration;
        
        this._velocity.x += this._velocity.x * dt;
        this._velocity.y += this._velocity.y * dt;

        this._velocity.setMagnitude = this._maxSpeed;
        //rotate object back to origin
        this._rect.rotate(-this._rect.getAngle() * Math.PI/180);
        //rotate points by direction of
        this._rect.setAngle(Math.atan2(this._velocity.y,this._velocity.x) * 180 / Math.PI);
        //rotate object in direction of velocity
        this._rect.rotate(this._rect.getAngle() * Math.PI/180);
            

        //this._rect.getPos().addVec = this._velocity;
        this._rect.updatePoints(this._velocity);
        this._acceleration = new Vec2(0,0);
    }

    generateFlockPoint()
    {
        if(Vec2.distance(this._rect.getOrigin(), this._flockPoint) < 50) 
        { 
            this._flockPoint = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
        }
    }

    attack(playerPos)
    {
        if (!(Vec2.distance(this._rect.getOrigin(), playerPos) <= this._attackDistance))
        {
            return;
        }
       
        //if we have already shot. If the reload timer has passed, set shoot to true
        if (this._attackTimer != 0)
        {
            if(Math.round((performance.now() - this._attackTimer) /1000) >= this._reloadTimer)
            {
                this._attack = true;
            }
        }//if we have not already shot, set shoot to true
        else
        {
            this._attack = true;
        }
       
        //if we can shoot, create a bullet, update timer and set it so we cant attack again
        if (this._attack) 
        { 
            let tempBullet = new Bullet(new Vec2(this._rect.getOrigin().x,this._rect.getOrigin().y),new Vec2(69,69),Math.atan2(playerPos.y - this._rect.getOrigin().y, playerPos.x - this._rect.getOrigin().x),this._maxBulletSpeed);
            this._bullets.push(tempBullet);
            this._attackTimer = performance.now();
            this._attack = false;
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

    draw(ctx,cameraPos, BOMBER_IMAGE)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate((this._rect._origin.x) - cameraPos.x,(this._rect._origin.y) - cameraPos.y);
        ctx.rotate(this._rect.getAngle() * Math.PI/180);
        ctx.drawImage(BOMBER_IMAGE,0,0,this._rect._size.x,this._rect._size.y,-this._rect._size.x/2,-this._rect._size.y/2,this._rect._size.x,this._rect._size.y);
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos,'green');
    }

    static ttl = 5;

    get getTTL()
    {
        return this._ttl;
    }

    get getMaxBulletSpeed()
    {
        return this._maxBulletSpeed;
    }
}


/*
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
        this._attackDistance = 500;
        this._attack = false;
        this._attackTimer = 0;
        this._reloadTimer = 5;
        this._previousflockPoint = new Vec2(0,0);
        this._previousAngle = 0;
        this._maxBulletSpeed = 2;

    }

   
    move (dt,playerPos,cameraPos) 
    {
        this.generateFlockPoint();
        this.attack(playerPos,cameraPos);
        let seek = this.seek();
        this._acceleration.addVec = seek;

        this._velocity.addVec = this._acceleration;
        
        this._velocity.x += this._velocity.x * dt;
        this._velocity.y += this._velocity.y * dt;

        this._velocity.setMagnitude = this._maxSpeed;
        //rotate object back to origin
        this._rect.rotate(-this.m_angle * Math.PI/180);
        //rotate points by direction of
        this.m_angle = Math.atan2(this._velocity.y,this._velocity.x) * 180 / Math.PI;
        //rotate object in direction of velocity
        this._rect.rotate(this.m_angle * Math.PI/180);
            

        this._rect.getPos().addVec = this._velocity;
        this._rect.updatePoints(this._velocity);
        this._acceleration = new Vec2(0,0);
    }

    generateFlockPoint()
    {
        if(Vec2.distance(this._rect.getOrigin(), this._flockPoint) < 50) 
        { 
            this._flockPoint = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
        }
    }

    attack(playerPos,cameraPos)
    {
        if (!(Vec2.distance(this._rect.getOrigin(), playerPos) <= this._attackDistance))
        {
            return;
        }
       
        //if we have already shot. If the reload timer has passed, set shoot to true
        if (this._attackTimer != 0)
        {
            if(Math.round((performance.now() - this._attackTimer) /1000) >= this._reloadTimer)
            {
                this._attack = true;
            }
        }//if we have not already shot, set shoot to true
        else
        {
            this._attack = true;
        }
       
        //if we can shoot, create a bullet, update timer and set it so we cant attack again
        if (this._attack) 
        { 
            let tempBullet = new Bullet(this._rect._origin,69,Math.atan2(playerPos.y - this._rect._origin.y, playerPos.x - this._rect._origin.x),this._maxBulletSpeed);
            this._bullets.push(tempBullet);
            this._attackTimer = performance.now();
            this._attack = false;
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
        ctx.translate((this._rect._origin.x) - cameraPos.x,(this._rect._origin.y) - cameraPos.y);
        ctx.rotate(this.m_angle * Math.PI/180);
        //this._rect.rotate(this.m_angle * Math.PI/180);
        ctx.drawImage(enemyOne,0,0,this._rect._size.x,this._rect._size.y,-this._rect._size.x/2,-this._rect._size.y/2,this._rect._size.x,this._rect._size.y);
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos, this.m_color);
    }

    static ttl = 5;

    get getTTL()
    {
        return this._ttl;
    }

    get getMaxBulletSpeed()
    {
        return this._maxBulletSpeed;
    }
}
*/