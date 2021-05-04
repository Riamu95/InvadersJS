class EnemyMinion extends Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
    {
        super(_x, _y,_width, _height, _xVel,_yVel);
      
        this._alignmentDistance = 50;
        this._cohesionDistance = 450;
        this._seperationDistance = 90;

        this._acceleration = new Vec2(0,0);
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
        this.m_color = 'blue';
    }


    static generateFlockPoint(minions, playerPos , flockPoint, dt)
    {    
        let avgPos = new Vec2(0,0);
        //we know the tally of the array, remove and replace with array.length?
        let tally = 0;
    
        minions.forEach(minion => 
        {
            avgPos.addVec = minion.getPos;
            tally++;   
        });

        if( tally > 0)
        avgPos.div = tally;

         // if not chasing and average flock pos is less than 50. generate new flockpoint
         if(Vec2.distance(avgPos, flockPoint) < 50) 
         { 
             flockPoint.x = Math.random() * WORLD_WIDTH;
             flockPoint.y = Math.random() * WORLD_HEIGHT;
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
                flockPoint.x = Math.random() * WORLD_WIDTH;
                flockPoint.y = Math.random() * WORLD_HEIGHT;
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
       
       this._velocity.x += this._velocity.x * dt;
       this._velocity.y += this._velocity.y * dt;

       this._velocity.setMagnitude = this._maxSpeed;

       this._pos.addVec = this._velocity;
       this._rect.updatePoints(this._velocity);
       this._acceleration = new Vec2(0,0);
    }


    seek(pos)
    {
        let steering = new Vec2(0,0);
        let direction = new Vec2(pos.x - this._pos.x, pos.y - this._pos.y);
        steering = Vec2.normalise(direction);
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
            distance = Vec2.distance( this._pos,minion.getPos);

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
            distance = Vec2.distance( this._pos,minion.getPos);

            if( minion != this && distance < this._cohesionDistance)
            {
                steering.addVec = minion._pos;
                tally++;
            }
        });

        if(tally > 0)
        {   
            steering.div = tally;
            steering = Vec2.subtractVec(steering,this._pos);
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
            distance = Vec2.distance( this._pos,minion.getPos);
            
            if( minion != this && distance < this._seperationDistance)
            {
                // GET VECTOR POINTING AWAY FROM NEIGHBOUR
                let diff = new Vec2(this._pos.x - minion._pos.x, this._pos.y - minion._pos.y);
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

    draw(cameraPos)
    {
        c.beginPath();
        c.drawImage(enemyMinionImage,0,0,this._size.x,this._size.y,this._pos.x - cameraPos.getVec2.x,this._pos.y - cameraPos.getVec2.y,this._size.x,this._size.y);
        c.closePath();
        this._rect.draw(c,cameraPos, this.m_color);
    }
}