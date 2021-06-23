class Bomber extends Enemy
{
    constructor(pos,size,velocity,fp)
    {
        super(pos,size,velocity);
        this._flockPoint = fp;
        this._acceleration = new Vec2(0,0);
        this._maxSpeed = 1;
        this._maxForce = 1;
        this._attackTimer = 0;
        this._reloadTimer = 5;
        this._maxBulletSpeed = 4;
        this._bullets = new Array();
        this._seek = new Vec2(0,0);
        this._health = 100;
    }
    static collisionDamage = 40;
    static bomberImage = document.getElementById("bomber");
   
    move (dt,playerPos) 
    {
        this.generateFlockPoint();
        this.attack(playerPos);

        this._seek = this.seek();
        
        this._acceleration.x = this._seek.x;
        this._acceleration.y = this._seek.y;

        this._velocity.x += this._acceleration.x;
        this._velocity.y += this._acceleration.y;
        
        this._velocity.x = this._velocity.x * dt;
        this._velocity.y = this._velocity.y * dt;
       
        this._velocity.setMagnitude = this._maxSpeed;
        
        //rotate object back to origin
        this._rect.setAngle(-this._rect.getAngle());
        this._rect.rotate();
        //rotate points by direction of
        this._rect.setAngle(Math.atan2(this._velocity.y,this._velocity.x) * 180 / Math.PI);
        //rotate object in direction of velocity
        this._rect.rotate(); 
            
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
        //Get direction from player to target
        let steering = new Vec2(this._flockPoint.x - this._rect.getOrigin().x, this._flockPoint.y - this._rect.getOrigin().y);
        //normalise vector and multiply by sacalar
        steering.setMagnitude = this._maxSpeed;
        //calcualte desired velocity by subtracting current velocity form diesred vel
        steering = Vec2.subtractVec(steering, this._velocity);
        return steering;
    }

    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
        ctx.rotate(this._rect.getAngle() * Math.PI/180);
        ctx.drawImage(Bomber.bomberImage,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
        ctx.closePath();
        ctx.restore();

        this._rect.draw(ctx,cameraPos,'green');
    }

    static ttl = 5;
    static bulletDamage = 30;

    get getMaxBulletSpeed()
    {
        return this._maxBulletSpeed;
    }
}