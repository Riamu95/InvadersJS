class EnemyMinion extends Enemy {

    constructor (pos,size,vel)
    {
        super(pos,size,vel);
        
        this._alignmentDistance = 50;
        this._cohesionDistance = 450;
        this._seperationDistance = 90;

       
        this._VelocityLength = 0;
        this._maxSpeed = 2;
        this._maxForce = 1;

        this._seperationWeight = 30;
        this._cohesionWieght = 2;
        this._alignmentWeight = 1;
        this._seekWeight = 1.5;

        this._alignment = new Vec2(0,0);
        this._cohesion = new Vec2(0,0);
        this._seperation = new Vec2(0,0);
        this._seek = new Vec2(0,0);
        this._color = 'blue';
        this._health = 10;
    }
    static collisionDamage = 10;
    static enemyMinionImage = document.getElementById("enemyMinion");

    static generateFlockPoint(minions, playerPos , flockPoint, dt,worldWidth,worldHeight)
    {    
        let avgPos = new Vec2(0,0);
        //we know the tally of the array, remove and replace with array.length?
        let tally = 0;
    
        minions.forEach(minion => 
        {
            avgPos.addVec = minion.getRect.getOrigin();
            tally++;   
        });

        if( tally > 0)
        avgPos.div = tally;

         // if not chasing and average flock pos is less than 50. generate new flockpoint
         if(Vec2.distance(avgPos, flockPoint) < 50) 
         { 
             flockPoint.x = Math.random() * worldWidth;
             flockPoint.y = Math.random() * worldHeight;
         }
         
        minions.forEach(minion => 
        {            
            if(Vec2.distance(avgPos, playerPos) < minion._attackDistance)
            {   
                if(!minion._attack)
                {
                    minion._attack = true;
                    //alter weight vlaues here
                }
                flockPoint.x = playerPos.x;
                flockPoint.y = playerPos.y;
            } //if chasing but the player gets away, seek  to new point set active to false
            else if(Vec2.distance(avgPos, playerPos) > minion._attackDistance && minion._attack)
            {
                //Being set for every minion, just needs to be set once
                flockPoint.x = Math.random() * worldWidth;
                flockPoint.y = Math.random() * worldHeight;
                minion._attack = false;
                //alter weight values here
            }
            minion.flock(minions,dt,flockPoint);
        });
    }

    flock(minions,dt, flockPoint)
    {     
      
       this._alignment = this.alignment(minions);
       this._cohesion = this.cohesion(minions);
       this._seperation = this.seperation(minions);
       this._seek = this.seek(flockPoint);
    
       this._acceleration.addVec = new Vec2(this._cohesion.x * this._cohesionWieght, this._cohesion.y * this._cohesionWieght);
       this._acceleration.addVec = new Vec2(this._alignment.x * this._alignmentWeight,this._alignment.y * this._alignmentWeight);
       this._acceleration.addVec =  new Vec2(this._seperation.x * this._seperationWeight, this._seperation.y * this._seperationWeight);
       this._acceleration.addVec =  new Vec2(this._seek.x * this._seekWeight, this._seek.y * this._seekWeight);
      
       this._velocity.addVec = this._acceleration;
       
       this._velocity.x = this._velocity.x * dt;
       this._velocity.y = this._velocity.y * dt;

       this._velocity.setMagnitude = this._maxSpeed;

       this._rect.updatePoints(this._velocity);
       this._acceleration = new Vec2(0,0);
    }


    seek(pos)
    {
        let steering = new Vec2(0,0);
        steering.x = pos.x - this._rect.getOrigin().x;
        steering.y =  pos.y - this._rect.getOrigin().y;
        steering = Vec2.subtractVec(steering, this._velocity);
        steering.setMagnitude = this._maxSpeed;

        return steering;
    }

    alignment(minions)
    {
        let distance = new Vec2(0,0);
        let tally = 0;
        let steering = new Vec2(0,0);

        minions.forEach(minion =>
        {
            distance = Vec2.distance(this._rect.getOrigin(),minion.getRect.getOrigin());

            if( minion != this && distance < this._alignmentDistance)
            {
                steering.addVec = minion._velocity;
                tally++;
            }
        });

        if(tally > 0)
        {
            steering.div = tally;  
            steering.setMagnitude = this._maxSpeed;
            steering = Vec2.subtractVec(steering, this._velocity);
        }
        return steering;
    }

    cohesion(minions)
    {
        let distance = new Vec2(0,0);
        let tally = 0;
        let steering = new Vec2(0,0);

        minions.forEach(minion =>
        {
            distance = Vec2.distance(this._rect.getOrigin(),minion.getRect.getOrigin());

            if( minion != this && distance < this._cohesionDistance)
            {
                steering.addVec = minion.getRect.getOrigin();
                tally++;
            }
        });

        if(tally > 0)
        {   
            steering.div = tally;
            steering = Vec2.subtractVec(steering,this._rect.getOrigin());
            steering.setMagnitude = this._maxSpeed;
            steering =  Vec2.subtractVec(steering,this._velocity);
            steering = Vec2.limit(steering,this._maxForce);
        }
        return steering;
    }

    seperation(minions)
    {
        let distance = new Vec2(0,0);
        let tally = 0;
        let steering = new Vec2(0,0);

        minions.forEach(minion =>
        {
            //GET DISTANCE BETWEEN NEIGBHOUR AND OBJECT
            distance = Vec2.distance(this._rect.getOrigin(),minion.getRect.getOrigin());
            
            if( minion != this && distance < this._seperationDistance)
            {
                // GET VECTOR POINTING AWAY FROM NEIGHBOUR
                let diff = new Vec2(this._rect.getOrigin().x - minion.getRect.getOrigin().x, this._rect.getOrigin().y - minion.getRect.getOrigin().y);
                diff = Vec2.normalise(diff);
                steering.addVec = diff;
                tally++;
            }
        });
        if(tally > 0)
        {
            steering.div = tally;
            steering = Vec2.subtractVec(steering, this._velocity);
        }
        return steering;
    }

   
    
    draw(ctx,cameraPos)
    {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
        ctx.drawImage(EnemyMinion.enemyMinionImage,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
        ctx.closePath();
        ctx.restore();
        this._rect.draw(ctx,cameraPos, this._color);
    }
}