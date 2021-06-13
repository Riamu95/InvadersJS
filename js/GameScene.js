class GameScene extends Scene 
{
    constructor(scene)
    {
        super();
        this._scenes = scene;
        this._bullets = [];
        this._enemies = [];
        this._minions = [];
        this._flockPoints = [];
        this._bombers = [];
        this._asteroids = [];
        this._blackHoles = [];
        this._pressedKeys = new Set();
        this.powerUps = [];
        this._collisionManager = new CollisionManager();
        this._player = new Player(new Vec2(WORLD_WIDTH/2,WORLD_HEIGHT/2),new Vec2(127,130));
        this._camera = new Camera(this._player.getShape.getOrigin().x - CANVAS_WIDTH/2,this._player.getShape.getOrigin().y - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);
        //let qt = new QuadTree(new Vec2(0,0),new Vec2(WORLD_WIDTH,WORLD_HEIGHT), 5);
        this._animationManager = new AnimationManager();
        this._waveManager = new WaveManager();
    
        this.init();
    
    
    }

    init()
    {
        this.spawn();
        /*Insertthis._minions into quad tree 
        for(let row = 0; row <this._minions.length; row++ ) 
        {
            for(let col = 0; col <this._minions[row].length; col++)
            {
                qt.insert(this._minions[row][col].getRect);
            }
        }*/

        document.addEventListener('keydown', (event) =>
        { 
            if (event.key == 'w' || event.key == 'd' || event.key == 's' ||
                event.key == 'a' || event.key == ' ' || event.key == 'e')
            {
                this._pressedKeys[event.key] = true;
                if( event.key == ' ' && !this._player.getFired())
                {
                    this._player.setFired(true);
                    this._player.setFireTimer(performance.now()); 
                }
            }
        });

        document.addEventListener('keyup', (event) =>
        {
            if (event.key == 'w' || event.key == 'd' || event.key == 's' ||
            event.key == 'a' || event.key == ' ' || event.key == 'e')
            {
                this._pressedKeys[event.key] = false;
            }
        });
    }

    spawn()
    {
            for(let row = 0; row < this._minions.length; row++)
            {
               if(this._minions[row].length > 0 )
                {
                    return;
                }
            }

            if (this._bombers.length > 0)
            {
                return; 
            }
            //short circuits on the first falsey value
            this._blackHoles.length > 0 &&  this._blackHoles.splice(0, this._blackHoles.length -1);
            this._asteroids.length > 0 && this._asteroids.splice(0,this._asteroids.length -1);
            this.powerUps.length > 0 && this.powerUps.splice(0,this.powerUps.length -1);

            this._waveManager.nextWave();
            
            //create Power Ups
            for(let i = 0; i < this._waveManager.getPowerUpCount(); i++)
            {
                let  temp = new PowerUp(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT), new Vec2(300,300),"shield",  Math.random() * 30);
                this.powerUps.push(temp);
            }

              /* Create Black Holes*/
              for(let i = 0; i < this._waveManager.getBlackHoleCount(); i++)
              {
                  let pos = this._waveManager.getSpawnPoint(Math.trunc(Math.random() * SPAWN_POINTS));
                  let  temp = new BlackHole(new Vec2(pos.x, pos.y), new Vec2(643,480));
                  this._blackHoles.push(temp);
              }
              /* Createthis._asteroids */
              for(let i = 0; i < this._waveManager.getAsteroidCount(); i++)
              {
                  let pos = this._waveManager.getSpawnPoint(Math.trunc(Math.random() * SPAWN_POINTS));
                  let  temp = new Asteroid(new Vec2(pos.x, pos.y), new Vec2(98,99));
                  this._asteroids.push(temp);
              }
              /* Createthis._minions*/
              for(let row = 0; row < this._waveManager.getFlockCount(); row++)
              {
                  let pos = this._waveManager.getSpawnPoint(Math.trunc(Math.random() * SPAWN_POINTS));
                  let tempMinions = [];
                  //let flockPoint = new Vec2(Math.random() * (WORLD_WIDTH - MINION_SPAWN_XOFFSET), Math.random() * (WORLD_HEIGHT - MINION_SPAWN_YOFFSET));
                  for(let col = 0; col < this._waveManager.getMininonCount(); col++)
                  {
                      let tempMinion = new EnemyMinion(new Vec2(pos.x + (col * 20), pos.y + (row * 20)), new Vec2(90, 102) ,new Vec2(Math.random(1) + -1, Math.random(1) + -1));
                      tempMinions.push(tempMinion);
                  }
                  this._minions.push(tempMinions);
                  this._flockPoints.push(new Vec2(Math.random() * (WORLD_WIDTH - MINION_SPAWN_XOFFSET), Math.random() * (WORLD_HEIGHT - MINION_SPAWN_YOFFSET)));
              }
              /* Create this._bombers*/
              for(let i = 0; i < this._waveManager.getBomberCount(); i++)
              {
                  let pos = this._waveManager.getSpawnPoint(Math.trunc(Math.random() * SPAWN_POINTS));
                  let flockPoint = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
                  let tempBomber = new Bomber(new Vec2(pos.x,pos.y), new Vec2(128,158), new Vec2(0,0),flockPoint);
                  this._bombers.push(tempBomber);
              }
              
    }

    update(dt)
    {
        this._bullets.forEach(bullet =>
        {
            bullet.move(dt);
        })
    
        //for every array, allocate seek point and move the flock
        for( let row = 0; row < this._minions.length; row++)
        {
            EnemyMinion.generateFlockPoint(this._minions[row], this._player.getShape.getOrigin(), this._flockPoints[row], dt);
        }
    
        /* Bomber and bomber bullet MOVE */
        for(let i = 0; i <  this._bombers.length; i++ )
        {
            this._bombers[i].move(dt, this._player.getShape.getOrigin());
    
            for(let b = 0; b <  this._bombers[i]._bullets.length; b++)
            {
                this._bombers[i]._bullets[b].seek(dt, this._player.getShape.getOrigin());
            } 
        }
        /* Black Holes update */
        this._blackHoles.forEach( bh =>
        {
            bh.update(dt);
            let [force, teleport] = bh.attract( this._player.getShape.getOrigin(), this._player.getMass);
            if (!teleport)
            {
                this._player.getAcceleration.addVec = force;
            }
            else
            {
                this._player.getShape.setOrigin(force);
                this._player.setShapePosition();
                //animate here apply initiala impulsesss
            }
        });


        this.powerUps.forEach( pu =>
        {
            pu.update(dt);
        });

        this._player.getShield().getActive() &&  this._player.getShield().update(dt);
           

        /* this._asteroids update */
        this._asteroids.forEach(ast =>
        {
            ast.update(dt);
        })

        if(this._player.getUsingPowerUp())
        {                                          
           let time  = Math.round((performance.now() - PowerUp.prototype.currentPowerUpTimer)/1000);  
            switch(this._player.getPowerUpType()) 
            {
                case PowerUpType.HEALTH:
                   this._player.setHealth = -0.1;
                   this._player.resetPowerUp();
                    break;
                case  PowerUpType.FIRE_RATE: 
                    if (time >= PowerUp.prototype.fireRateTimer)
                    {
                        this._player.setFireRate = 0.5;
                        this._player.resetPowerUp();
                    }  
                    break;
                case  PowerUpType.SHIELD:
                    //if timer >= 10, take 16 health , reset timer, 
                    //if health < = 0 de activate health
                    if(time >= PowerUp.prototype.shieldTimer)
                    {
                        this._player.getShield().setActive(false);
                        this._player.resetPowerUp();
                    }  
                    break;
            }

            if (this._player.getCurrentPowerUp() == null && this._player.getNextPowerUp() != null)
            {
                this._player.setCurrentPowerUp(this._player.getNextPowerUp());
                this._player.setNextPowerUp(null);
            }
        }

        this.inputHandling(dt);
        this.collisions();

        if(this._player.getHealth < 0)
            this.NextScene();
    }
    

    inputHandling(dt)
    {
        if(this._pressedKeys['w'])
        {
            if( this._player.getSpeed() <=  this._player.getMaxAcceleration)
            {
                this._player.addSpeed( this._player.getAccelerationRate);
            } 
            this._player.move(dt); 
            this._camera.update( this._player.getShape.getOrigin()); 
        }
        else if(this._pressedKeys['s'])
        {
            if( this._player.getSpeed() >= - this._player.getMaxAcceleration)
            {
                this._player.addSpeed(- this._player.getAccelerationRate);
            }  
            this._player.move(dt); 
            this._camera.update( this._player.getShape.getOrigin());  
        }
        else if(!this._pressedKeys['w'] && !this._pressedKeys['s'])
        {
            if(this._player.getSpeed() > 0)
            {
                this._player.addSpeed(-this._player.getDeccelerationRate);
            }
            else if(this._player.getSpeed() < 0)
            {
                this._player.addSpeed(this._player.getDeccelerationRate);
            }
           
            this._player.move(dt); 
            this._camera.update(this._player.getShape.getOrigin());  
        }
        if(this._pressedKeys['d'])
        {
            this._player.setSpriteAngle = this._player.getRotationSpeed;
            this._player.getShape.setAngle(this._player.getRotationSpeed);
            this._player.getShape.rotate();
        }
        if(this._pressedKeys['a'])
        {
            this._player.setSpriteAngle = -this._player.getRotationSpeed;
            this._player.getShape.setAngle(-this._player.getRotationSpeed);
            this._player.getShape.rotate();
        }

        if(this._player.getFired() && (performance.now() - this._player.getFireTimer) /1000 >= this._player.getFireRate)
        {
            let tempBullet = new Bullet(new Vec2(this._player.getShape.getOrigin().x, this._player.getShape.getOrigin().y),new Vec2(30,30),
            this._player.getSpriteAngle * Math.PI/180,this._player.getMaxBulletSpeed);
            this._bullets.push(tempBullet);
            this._player.setFired(false);
        }

        if(this._pressedKeys['e']  && this._player.getCurrentPowerUp() != null)
        {
            this._player.setUsingPowerUp(true);
            PowerUp.prototype.currentPowerUpTimer = performance.now();
            
            switch(this._player.getCurrentPowerUp()) 
            {
                case PowerUpType.HEALTH:
                    this._player.setPowerUpType(PowerUpType.HEALTH);
                    break;
                case  PowerUpType.FIRE_RATE:
                    this._player.setFireRate = 0.25;   
                    this._player.setPowerUpType(PowerUpType.FIRE_RATE);
                    break;
                case  PowerUpType.SHIELD:
                    this._player.setPowerUpType(PowerUpType.SHIELD);
                    this._player.getShield().setActive(true);
                    break;
            }
            this._pressedKeys['e'] = false;
        }
    }

    collisions()
    {
           this.objectCollisions();
           this.bulletCollisions();
    }

    objectCollisions()
    {
        // Player and power ups 
        for( let i = 0; i < this.powerUps.length; i++)
        {
            if(!this.powerUps[i].getActive())
            {
                continue;
            }

            if(CollisionManager.SATCollision(this.powerUps[i].getRect().getPoints(), this._player._shape.getPoints()))
            {
                switch(this.powerUps[i].getType()) 
                {
                    case PowerUpType.HEALTH:
                        this._player.getCurrentPowerUp() == null ? this._player.setCurrentPowerUp(PowerUpType.HEALTH) : this._player.setNextPowerUp(PowerUpType.HEALTH);
                      break;//timer based power up
                    case  PowerUpType.FIRE_RATE:   
                        this._player.getCurrentPowerUp() == null ? this._player.setCurrentPowerUp(PowerUpType.FIRE_RATE) : this._player.setNextPowerUp(PowerUpType.FIRE_RATE);
                      break;//timer based power up/ healthbased
                    case  PowerUpType.SHIELD:
                        this._player.getCurrentPowerUp() == null ? this._player.setCurrentPowerUp(PowerUpType.SHIELD) : this._player.setNextPowerUp(PowerUpType.SHIELD);
                      break;
                }

                this.powerUps[i].setActive(false);
                this.powerUps[i].setInactiveTimer(performance.now());
                //Make power up not active, once power up depleted remove power up
                //destroy power up + animation
            }
        }

          /*  Mininons and player */
        for(let row = 0; row < this._minions.length; row++)
        {
            for(let col = this._minions[row].length -1; col >= 0 ; col--)
            {  
            //quad tree detection
                if(CollisionManager.SATCollision(this._minions[row][col]._rect.getPoints(), this._player._shape.getPoints()))
                {
                    this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._minions[row].splice(col,1);
                    this._player.setHealth = 0.1;
                    this.spawn();
                }
            }
        }
        /* Player Bomber */
        for( let b = 0; b < this._bombers.length; b++)
        {
            if(CollisionManager.SATCollision(this._bombers[b].getRect.getPoints(),this._player.getShape.getPoints()))
            {
                this._player.setHealth = 0.25;
                this.spawn();
                //impulse
                //Reduce player and bomber health
                //animation/particle affects
                //check if player and bomber are still alive
            }
        }
        
        //this._bombers anddthis._minions
        loop1:
        for( let b = this._bombers.length -1; b >= 0; b--)
        {
            loop2:
            for (let row = this._minions.length -1; row >= 0; row --)
            {
                loop3:
                for(let col = this._minions[row].length -1; col >= 0; col --)
                {
                    if(CollisionManager.SATCollision(this._bombers[b].getRect.getPoints(),this._minions[row][col].getRect.getPoints()))
                    {
                        this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._minions[row].splice(col,1);

                        this._bombers[b].setHealth = -10;
                        this._bombers[b].getHealth <= 0 && this._bombers.splice(b,1);

                        this.spawn();

                        if(this._bombers.length <= 0)
                            break loop1;
                        //break out  here 
                        //play explostion this._animation
                    }
                }
            }
        }

        /* Asteroid/Player Collision */
        for( let a = this._asteroids.length - 1; a >= 0; a--)
        {
            if(CollisionManager.SATCollision(this._asteroids[a].getRect().getPoints(),this._player.getShape.getPoints()))
            {
                this._animationManager.addAnimation(5,0.5,this._asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                this._asteroids.splice(a,1);
                this._player.setHealth = 0.4;
                this.spawn();
                //  startFrame,endFrame,transitionTime,pos,animate,image, width,height
            }
        }

        //Asteroids and this._bombers
        /* for( let b = this._bombers.length -1; b >= 0; b--)
        {
                for( let a =this._asteroids.length - 1; a >= 0; a--)
                {
                    if(CollisionManager.SATCollision(asteroids[a].getRect().getPoints(),this._bombers[b].getRect.getPoints()))
                    {
                        //MTV 
                        this._bombers[b].setHealth = -20;
                       this._asteroids[a].setHealth(-20);
                        //colliison this._animation/Particle affects.

                        //checkif bomber or asteroid is still alive.
                        //&& shorT cirucits upon first falsey value , so if there's still health, object is not deleted.
                        //blow up this._animation?
                    this._bombers[b].getHealth <= 0 && this._bombers.splice(b,1);
                   this._asteroids[a].getHealth() <= 0 && this._bombers.splice(a,1);
                    }
                }
        }*/

        //Asteroids andthis._minions
        loop1:
        for( let a = this._asteroids.length -1; a >= 0; a --)
        {
            loop2:
            for (let row = this._minions.length -1; row >= 0; row --)
            {
                loop3:
                for(let col = this._minions[row].length -1; col >= 0; col --)
                {
                    if(CollisionManager.SATCollision(this._asteroids[a].getRect().getPoints(),this._minions[row][col].getRect.getPoints()))
                    {
                        this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._minions[row].splice(col,1);

                       this._asteroids[a].setHealth(-10);
                       this._asteroids[a].getHealth() <= 0 && this._asteroids.splice(a,1);
                        //same issue here when inions collide with last aasteroid, need to break
                       this.spawn();
                       if(this._asteroids.length <= 0)
                            break loop1;
                        //asteroid blow up this._animation
                    }
                }
            }
        }

        // Asteroid on Asteroid 
        for(let a = 0; a < this._asteroids.length -1; a++)
        {
            for(let b = a + 1; b < this._asteroids.length; b++)
            {
                if (CollisionManager.SATCollision(this._asteroids[a].getRect().getPoints(),this._asteroids[b].getRect().getPoints()))
                {
                    this._animationManager.addAnimation(5,0.5,this._asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._animationManager.addAnimation(5,0.5,this._asteroids[b].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._asteroids.splice(b,1);
                    this._asteroids.splice(a,1);
                    this.spawn();
                    break;
                }
            }
        }
        
        //Bomber on Bomber 
        for(let a = 0; a < this._bombers.length -1; a++)
        {
            for(let b = a + 1; b < this._bombers.length; b++)
            {
                if (CollisionManager.SATCollision(this._bombers[a].getRect.getPoints(),this._bombers[b].getRect.getPoints()))
                {
                        //MTV
                }
            }
        }
    }


    bulletCollisions()
    {
            /* Minion Player bullet collision */
        for( let row = 0; row < this._minions.length; row++)
        {
            for( let col = this._minions[row].length -1; col >= 0; col--)
            {  
                for(let b = this._bullets.length -1 ; b >= 0; b--)
                {
                    if(CollisionManager.SATCollision(this._bullets[b].getRect.getPoints(),this._minions[row][col].getRect.getPoints()))
                    {
                        this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._minions[row].splice(col,1);
                
                        this._animationManager.addAnimation(5,0.5,this._bullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                        this._bullets.splice(b,1);
                        this.spawn();
                        if (this._bullets.length > 0)
                                break;
                    }
                }
            }
        }
        /*collision between Playerthis._bullets and bomber. */
        for(let b = this._bullets.length -1; b >= 0; b--)
        {
            for(let i = this._bombers.length -1; i >= 0; i--)
            {
                if(CollisionManager.SATCollision(this._bullets[b].getRect.getPoints(), this._bombers[i].getRect.getPoints()))
                {
                    //decrease bomber health   
                    this._bombers[i].setHealth = -10;
                    if(this._bombers[i].getHealth <= 0)
                    {
                        this._animationManager.addAnimation(5,0.5,this._bombers[i].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._bombers.splice(i,1);
                    }
                    this._animationManager.addAnimation(5,0.5,this._bullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                    this._bullets.splice(b,1);  
                    this.spawn();
                    if (this._bullets.length == 0 || b >= this._bullets.length)     
                        break;
                }
            }
        }
        /*collision between Playerthis._bullets and Asteroid. */
        for(let b = this._bullets.length -1; b >= 0; b--)
        {
            for(let i = this._asteroids.length -1; i >= 0; i--)
            {
                if(CollisionManager.SATCollision(this._bullets[b].getRect.getPoints(), this._asteroids[i].getRect().getPoints()))
                {
                    //decrease bomber health
                    this._asteroids[i].setHealth(-35);
                    if(this._asteroids[i].getHealth() <= 0)
                    {
                        this._animationManager.addAnimation(5,0.5,this._asteroids[i].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._asteroids.splice(i,1);
                    }
                    this._animationManager.addAnimation(5,0.5,this._bullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                    this._bullets.splice(b,1);
                    this.spawn();
                    if (this._bullets.length == 0 || b >=this._bullets.length)     
                            break;   
                }
            }
        }
        /*  For all this._bombersthis._bullets/player collision */
        for(let i = this._bombers.length -1; i >= 0; i--)
        {
            for(let b = this._bombers[i]._bullets.length -1; b >= 0 ; b--)
            {
                if(CollisionManager.SATCollision(this._bombers[i]._bullets[b].getRect.getPoints(),this._player.getShape.getPoints()))
                {
                    this._animationManager.addAnimation(5,0.5,this._bombers[i]._bullets[b].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._bombers[i]._bullets.splice(b,1);
                    this._player.setHealth = 0.5;
                    //implode bomb
                    //delete bomb

                    //reduce player health
                }
            }
        }
        /* Player Bullet timer Collision */
        for(let i = this._bullets.length -1 ; i >= 0; i--)
        {
           let  time = Math.round((performance.now() -this._bullets[i].getTTL())/1000);
            if (time >= this._player.getTTL)
            {
                this._animationManager.addAnimation(5,0.5,this._bullets[i].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                this._bullets.splice(i,1);
            }
        }

        /*  For all this._bombersthis._bullets check bullet ttl */
        for(let i = 0; i < this._bombers.length; i++)
        {
            for(let b = this._bombers[i]._bullets.length -1; b >= 0; b--)
            {
                let  time = Math.round((performance.now() - this._bombers[i]._bullets[b].getTTL())/1000);

                if (time >= Bomber.ttl)
                {
                    //implode bomb
                    this._animationManager.addAnimation(5,0.5,this._bombers[i]._bullets[b].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._bombers[i]._bullets.splice(b,1);
                }
            }
        }
    }

    draw(ctx)
    {
        ctx.clearRect(0,0,this.canvas_width,this.canvas_height);
        this._camera.draw(ctx);
        //qt.draw(ctx,camera.getPos);
        /* Draw Black Holes */
        
        this._blackHoles.forEach( bh =>
        {
            bh.draw(ctx,this._camera.getPos)
        });
        /* Draw Asteroids */
        this._asteroids.forEach( ast =>
        {
            ast.draw(ctx,this._camera.getPos)
        });
        /* Draw Player Bullets */
        this._bullets.forEach(bullet =>
        {
            bullet.draw(ctx,this._camera.getPos,PLAYER_BULLET_IMAGE);
        }); 
        /* Draw bombers and bomber Bullets*/
        for(let i =0; i < this._bombers.length; i ++)
        {
            this._bombers[i].draw(ctx,this._camera.getPos,BOMBER_IMAGE);
            for(let b = 0; b < this._bombers[i]._bullets.length; b++)
            {
                this._bombers[i]._bullets[b].draw(ctx,this._camera.getPos,BOMBER_BULLET_IMAGE);
            } 
        };

        this._player.draw(ctx,this._camera.getPos);

        this._player.getShield().getActive() && this._player.getShield().draw(ctx,this._camera.getPos);

        /* Draw all minions*/
        this._minions.forEach(array => 
        {
            array.forEach(minion =>
            {
                minion.draw(ctx,this._camera.getPos);
            }); 
        });

        this.powerUps.forEach( pu =>
        {
            pu.draw(ctx,this._camera.getPos)
        });

        //Scale health bar 
        if(this._player.getHealth > 0)
        {
            ctx.drawImage(heart,0,0,HEART_SIZE.x,HEART_SIZE.y,(this._camera.getPos.x + (this._camera.getSize.x * 0.75)) - this._camera.getPos.x,(this._camera.getPos.y +  (this._camera.getSize.x / 30)) - this._camera.getPos.y,HEART_SIZE.x,HEART_SIZE.y);
            //heartBar
            //ctx.drawImage(healthBar,0,0,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y,(camera.getPos.x + (camera.getSize.x * 0.81)) - camera.getPos.x,(camera.getSize.y +  (camera.getSize.x / 30)) - camera.getPos.y,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y);
            //heartValue
            //render width based off health
            ctx.drawImage(healthValue,0,0,HEALTHVALUE_SIZE.x,HEALTHVALUE_SIZE.y,(this._camera.getPos.x + (this._camera.getSize.x * 0.81)) - this._camera.getPos.x,(this._camera.getPos.y +  (this._camera.getSize.x / 30.1)) - this._camera.getPos.y,HEALTHVALUE_SIZE.x * this._player.getHealth,HEALTHVALUE_SIZE.y);
        }
        ctx.fillStyle = 'blue';
        ctx.fillText(`fps : ${this._waveManager.getWave()}`, (this._camera.getPos.x + 100) - this._camera.getPos.x,(this._camera.getPos.y + 50) - this._camera.getPos.y);  
        this._animationManager.draw(ctx,this._camera.getPos);    
    }

    NextScene()
    {
        let gameOverScene = new GameOverScene(this._scenes);
        this._scenes.push(gameOverScene);
        this._scenes.shift();
    }
}