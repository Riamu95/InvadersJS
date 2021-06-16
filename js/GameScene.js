class GameScene extends Scene 
{
    constructor(scene)
    {
        super();
        this._scenes = scene;
        this._enemies = [];
        this._minions = [];
        this._flockPoints = [];
        this._bombers = [];
        this._asteroids = [];
        this._blackHoles = [];
        this._pressedKeys = new Set();
        this._buttons = ['w','a','s','d','e','1','2','3'];
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
    
        document.addEventListener('keydown', (event) =>
        { 
           if (this._buttons.includes(event.key))
                this._pressedKeys[event.key] = true;
        });   

        document.addEventListener('keyup', (event) =>
        {
            if(this._buttons.includes(event.key))
                this._pressedKeys[event.key] = false;
        });

        document.addEventListener('click', () =>
        {
            if(!this._player.getFired())
            {
                this._player.setFired(true);
                this._player.setFireTimer(performance.now()); 
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
                let  temp = new PowerUp(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT), new Vec2(300,300),"autoTurret",  Math.random() * 30);
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
                  let  temp = new Asteroid(new Vec2(pos.x, pos.y), new Vec2(99,99));
                  this._asteroids.push(temp);
              }
              /* Createthis._minions*/
              for(let row = 0; row < this._waveManager.getFlockCount(); row++)
              {
                  let pos = this._waveManager.getSpawnPoint(Math.trunc(Math.random() * SPAWN_POINTS));
                  let tempMinions = [];
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
        for( let i = 0; i < this._player.getWeapons().length; i++)
        {
            this._player.getWeapons()[i].update(dt);
        }  
    
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
            pu.update();
        });

        this._player.getAutoTurret().getActive() &&  this._player.getAutoTurret().update(dt);
           

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
                case  PowerUpType.AUTOTURRET:
                    if(time >= PowerUp.prototype.AutoTurretTimer)
                    {
                        this._player.getAutoTurret().setActive(false);
                        this._player.resetPowerUp();
                        //explosion animation for all remaining bullets
                        for(let value of this._player.getAutoTurret().getBullets().values())
                        {
                            if (value[1] == true)
                            {
                                this._animationManager.addAnimation(5,0.5,value[0].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));    
                            }
                        }
                        this._player.getAutoTurret().clear();
                    }  
                    break;
                case PowerUpType.SPEED:
                    if(time >= PowerUp.prototype.speedTimer)
                    { 
                        this._player.setMaxAcceleration(0.5);
                        this._player.setSpeed(0.5);
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
        //dont check this here, check on every collision
        if(this._player.getHealth < 0)
            this.NextScene();
    }
    

    inputHandling(dt)
    {
        if(this._pressedKeys['w'])
        {
            if( this._player.getSpeed() <=  this._player.getMaxAcceleration)
            {
                this._player.addSpeed(this._player.getAccelerationRate);
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

        if(this._player.getFired() && (performance.now() - this._player.getFireTimer) /1000 >= this._player.getFireRate && this._player.getCurrentWeapon().getAmmoCount() > 0)
        {
            
            this._player.getCurrentWeapon().addBullet(this._player.getShape.getOrigin(),this._player.getCurrentWeapon().getBulletSize(),this._player.getSpriteAngle * Math.PI/180,this._player.getMaxBulletSpeed);
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
                case  PowerUpType.AUTOTURRET:
                    this._player.setPowerUpType(PowerUpType.AUTOTURRET);
                    this._player.getAutoTurret().setActive(true);
                    break;
                case  PowerUpType.SPEED:
                    this._player.setMaxAcceleration(1);
                    this._player.setPowerUpType(PowerUpType.SPEED);
                    break;
            }
            this._pressedKeys['e'] = false;
        }
        if (this._pressedKeys['1'])
        {
            this._player.setCurrentWeapon(0);    
        }
        else if (this._pressedKeys['2'])
        {
            this._player.setCurrentWeapon(1); 
        }
        else if (this._pressedKeys['3'])
        {
            this._player.setCurrentWeapon(2); 
        }
    }

    collisions()
    {
           this.objectCollisions();
           this.bulletCollisions();
    }

    objectCollisions()
    {

        //this should be inanother function?
        if(this._player.getAutoTurret().getActive())
        {
            for (let row = 0; row < this._minions.length; row ++)
            {
                for(let col = 0; col < this._minions[row].length; col ++)
                {
                    if(Vec2.distance(this._player.getAutoTurret().getRect().getOrigin(),this._minions[row][col].getRect.getOrigin()) < this._player.getAutoTurret().getActiveDistance())
                    {
                        this._player.getAutoTurret().addBullet(this._minions[row][col].getRect.getOrigin());
                    }
                }
            }

            for(let i = this._bombers.length -1; i >= 0; i--)
            {
                if(Vec2.distance(this._player.getAutoTurret().getRect().getOrigin(),this._bombers[i].getRect.getOrigin()) < this._player.getAutoTurret().getActiveDistance())
                {
                    this._player.getAutoTurret().addBullet(this._bombers[i].getRect.getOrigin());
                }
            }

            for(let i = this._asteroids.length -1; i >= 0; i--)
            {
                if(Vec2.distance(this._player.getAutoTurret().getRect().getOrigin(),this._asteroids[i].getRect().getOrigin()) < this._player.getAutoTurret().getActiveDistance())
                {
                    this._player.getAutoTurret().addBullet(this._asteroids[i].getRect().getOrigin());
                }
            }
        }

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
                    case  PowerUpType.AUTOTURRET:
                        this._player.getCurrentPowerUp() == null ? this._player.setCurrentPowerUp(PowerUpType.AUTOTURRET) : this._player.setNextPowerUp(PowerUpType.AUTOTURRET);
                      break;
                    case  PowerUpType.SPEED:
                        this._player.getCurrentPowerUp() == null ? this._player.setCurrentPowerUp(PowerUpType.SPEED) : this._player.setNextPowerUp(PowerUpType.SPEED);
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
                    this._player.setHealth = -EnemyMinion.collisionDamage;
                    this._minions[row][col].setHealth = -this._player.getCollisionDamage();

                    this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    if(this._player.getAutoTurret().getBullets().keys(this._minions[row][col].getRect.getOrigin()) != undefined)
                    {
                        this._player.getAutoTurret().getBullets().delete(this._minions[row][col].getRect.getOrigin());
                    }

                    this._minions[row][col].checkHealth() &&  this._minions[row].splice(col,1);
                    this._player.checkHealth() && this.NextScene();
        
                    this.spawn();
                }
            }
        }
        /* Player Bomber */
        for( let b = this._bombers.length -1; b >= 0; b--)
        {
            if(CollisionManager.SATCollision(this._bombers[b].getRect.getPoints(),this._player.getShape.getPoints()))
            {
                this._player.setHealth = -Bomber.collisionDamage;
                this._bombers[b].setHealth = -this._player.getCollisionDamage();
                
                this._bombers[b].checkHealth() && this._bombers.splice(b,1);
                this._player.checkHealth() &&  this.NextScene();
                
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

                        this._bombers[b].setHealth = -EnemyMinion.collisionDamage;
                        this._minions[row][col].setHealth = -Bomber.collisionDamage;


                        this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));

                       
                        this._bombers[b].checkHealth() && this._bombers.splice(b,1);
                        if(this._minions[row][col].checkHealth())
                        {
                          this._minions[row].splice(col,1);
                        }
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
                this._asteroids[a].setHealth(-this._player.getCollisionDamage());
                this._player.setHealth = - Asteroid.collisionDamage;

                if(this._player.getAutoTurret().getBullets().keys(this._asteroids[a].getRect().getOrigin()) != undefined)
                {
                    this._player.getAutoTurret().getBullets().delete(this._asteroids[a].getRect().getOrigin());
                    //if bullet is active exploding animation??
                }
                if (this._asteroids[a].checkHealth())
                {
                    this._animationManager.addAnimation(5,0.5,this._asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._asteroids.splice(a,1);
                }

                if(this._player.checkHealth())
                {
                   this.NextScene();
                }
                this.spawn();
            }
        }

        //Asteroids and this._bombers
         for( let b = this._bombers.length -1; b >= 0; b--)
        {
            for( let a = this._asteroids.length - 1; a >= 0; a--)
            {
                if(CollisionManager.SATCollision(this._asteroids[a].getRect().getPoints(),this._bombers[b].getRect.getPoints()))
                {
                    //MTV 
                    this._asteroids[a].setHealth(-Bomber.collisionDamage);
                    this._player.setHealth = -Asteroid.collisionDamage;

                    if(this._bombers[b].checkHealth())
                    {
                        this._bombers.splice(b,1);
                    } 
                    if(this._asteroids[a].checkHealth())
                    {
                        this._asteroids.splice(a,1);
                    } 
                }
            }
        }

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
                        this._asteroids[a].setHealth(-EnemyMinion.collisionDamage);
                        this._minions[row][col].setHealth = -Asteroid.collisionDamage;

                        if(this._minions[row][col].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                            this._minions[row].splice(col,1);
                        }
                        if(this._asteroids[a].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                            this._asteroids.splice(a,1);
                            break loop1;
                           
                        }
                        //same issue here when minions collide with last aasteroid, need to break
                       this.spawn();

                       if(this._asteroids.length <= 0)
                            break loop1;
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

        this.turretCollisions();
       // let playerBullets = this._player.getCurrentWeapon().getBullets();
        //for all the players weapons // check bullets against game objects
        for(let w = 0; w < this._player.getWeapons().length; w++)
        {
            let playerBullets = this._player.getWeapons()[w].getBullets();
             /* Minion Player bullet collision */
            for( let row = 0; row < this._minions.length; row++)
            {
                for( let col = this._minions[row].length -1; col >= 0; col--)
                {  
                    for(let b = playerBullets.length -1 ; b >= 0; b--)
                    {
                        if(CollisionManager.SATCollision(playerBullets[b].getRect.getPoints(),this._minions[row][col].getRect.getPoints()))
                        {
                            this._minions[row][col].setHealth = -this._player.getWeapons()[w].getDamage();
                            if(this._minions[row][col].checkHealth())
                            {
                                this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                                this._minions[row].splice(col,1);
                            }
                    
                            this._animationManager.addAnimation(5,0.5,playerBullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                            playerBullets.splice(b,1);
                            this.spawn();
                            if (playerBullets.length > 0)
                                    break;
                        }
                    }
                }
            }
            /*collision between Playerthis._bullets and bomber. */
            for(let b = playerBullets.length -1; b >= 0; b--)
            {
                for(let i = this._bombers.length -1; i >= 0; i--)
                {
                    if(CollisionManager.SATCollision(playerBullets[b].getRect.getPoints(), this._bombers[i].getRect.getPoints()))
                    {
                        //decrease bomber health   
                        this._bombers[i].setHealth = -this._player.getWeapons()[w].getDamage();
                        if(this._bombers[i].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._bombers[i].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                            this._bombers.splice(i,1);
                        }
                        this._animationManager.addAnimation(5,0.5,playerBullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                        playerBullets.splice(b,1);  
                        this.spawn();
                        if (playerBullets.length == 0 || b >= playerBullets.length)     
                            break;
                    }
                }
            }
            /*collision between Playerthis._bullets and Asteroid. */
            for(let b = playerBullets.length -1; b >= 0; b--)
            {
                for(let i = this._asteroids.length -1; i >= 0; i--)
                {
                    if(CollisionManager.SATCollision(playerBullets[b].getRect.getPoints(), this._asteroids[i].getRect().getPoints()))
                    {
                        this._asteroids[i].setHealth(-this._player.getWeapons()[w].getDamage());
                        if(this._asteroids[i].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._asteroids[i].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                            this._asteroids.splice(i,1);
                        }
                        this._animationManager.addAnimation(5,0.5,playerBullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                        playerBullets.splice(b,1);
                        this.spawn();
                        if (playerBullets.length == 0 || b >= playerBullets.length)     
                                break;   
                    }
                }
            }
            /* Player Bullet timer Collision */
            for(let i = playerBullets.length -1 ; i >= 0; i--)
            {
                let  time = Math.round((performance.now() - playerBullets[i].getTimer())/1000);
                if (time >= this._player.getWeapons()[w].getTTL())
                {
                    this._animationManager.addAnimation(5,0.5,playerBullets[i].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                    playerBullets.splice(i,1);
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
                    
                    this._player.setHealth = -Bomber.bulletDamage;
                    if(this._player.checkHealth())
                    {
                        this.NextScene();
                    }
        
                    //implode bomb
                    //delete bomb

                    //reduce player health
                }
            }
        }

        //  For all this._bombersthis._bullets check bullet ttl
        for(let i = 0; i < this._bombers.length; i++)
        {
            for(let b = this._bombers[i]._bullets.length -1; b >= 0; b--)
            {
                let  time = Math.round( ( performance.now() - this._bombers[i]._bullets[b].getTimer())/1000);
                if (time >= Bomber.ttl)
                {
                    //implode bomb
                    this._animationManager.addAnimation(5,0.5,this._bombers[i]._bullets[b].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    this._bombers[i]._bullets.splice(b,1);
                }
            }
        }
    }

    turretCollisions()
    {
        if (this._player.getAutoTurret().getBullets().size == 0)
        {
            return;    
        }
        
        let turretBullets = this._player.getAutoTurret().getBullets();
        //turret bullets and minions
        for( let [key,value] of turretBullets.entries())
        {
            let  time = Math.round((performance.now() - value[0].getTimer())/1000);

            if (time >= this._player.getAutoTurret().getTTL())
            {
                this._animationManager.addAnimation(5,0.5,value[0].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));    
                turretBullets.delete(key);
            }
        }

        for( let row = 0; row < this._minions.length; row++)
        {
            for( let col = this._minions[row].length -1; col >= 0; col--)
            {  
                for(let [target,bullet]  of turretBullets.entries())
                {
                    if(CollisionManager.SATCollision(bullet[0].getRect.getPoints(),this._minions[row][col].getRect.getPoints()))
                    {
                        this._minions[row][col].setHealth = -this._player.getAutoTurret().getBulletDamage();
                        this._animationManager.addAnimation(5,0.5,bullet[0].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                        turretBullets.delete(target);
                         //if there's still a bullet targetting the minion(inaccurate collision/ remove that bullet)
                        if(turretBullets.keys(this._minions[row][col].getRect.getOrigin()) != undefined)
                        {
                            turretBullets.delete(this._minions[row][col].getRect.getOrigin());
                        }
                        if(this._minions[row][col].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));                 
                            this._minions[row].splice(col,1);
                        }
 
                        this.spawn();
                        if (turretBullets.size > 0)
                                break;
                    }
                }
            }
        }


        for(let [target,bullet]  of turretBullets.entries())
        {
            for(let i = this._bombers.length -1; i >= 0; i--)
            {
                if(CollisionManager.SATCollision(bullet[0].getRect.getPoints(), this._bombers[i].getRect.getPoints()))
                {
                    this._bombers[i].setHealth = -this._player.getAutoTurret().getBulletDamage();
                    this._animationManager.addAnimation(5,0.5,bullet[0].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                    turretBullets.delete(target);  
                    if(turretBullets.keys(this._bombers[i].getRect.getOrigin()) != undefined)
                    {
                        turretBullets.delete(this._bombers[i].getRect.getOrigin());
                    }

                    if(this._bombers[i].checkHealth())
                    {
                        this._animationManager.addAnimation(5,0.5,this._bombers[i].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._bombers.splice(i,1);
                    }
                  
                    this.spawn();

                    if (turretBullets.size == 0)     
                        break;
                }
            }
        }

        for(let [target,bullet]  of turretBullets.entries())
        {
            for(let i = this._asteroids.length -1; i >= 0; i--)
            {
                if(CollisionManager.SATCollision(bullet[0].getRect.getPoints(), this._asteroids[i].getRect().getPoints()))
                {
                    this._asteroids[i].setHealth(-this._player.getAutoTurret().getBulletDamage());
                    this._animationManager.addAnimation(5,0.5,bullet[0].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                    turretBullets.delete(target);  
                    if(turretBullets.keys(this._asteroids[i].getRect().getOrigin()) != undefined)
                    {
                        turretBullets.delete(this._asteroids[i].getRect().getOrigin());
                    }
                    if(this._asteroids[i].checkHealth())
                    {
                        this._animationManager.addAnimation(5,0.5,this._asteroids[i].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                        this._asteroids.splice(i,1);
                    }
                    if (turretBullets.size == 0)     
                        break;
                }
            }
        }


        //turret asteroid collision
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
        for(let i = 0; i < this._player.getWeapons().length; i++)
        {
            this._player.getWeapons()[i].draw(ctx,this._camera.getPos);
        }  
    
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

        this._player.getAutoTurret().getActive() && this._player.getAutoTurret().draw(ctx,this._camera.getPos);

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
            ctx.drawImage(healthValue,0,0,HEALTHVALUE_SIZE.x,HEALTHVALUE_SIZE.y,(this._camera.getPos.x + (this._camera.getSize.x * 0.81)) - this._camera.getPos.x,(this._camera.getPos.y +  (this._camera.getSize.x / 30.1)) - this._camera.getPos.y,HEALTHVALUE_SIZE.x * (this._player.getHealth/100),HEALTHVALUE_SIZE.y);
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