class GameScene extends Scene 
{
    constructor(scene)
    {
        super();
        this._scenes = scene;
        this._minions = [];
        this._flockPoints = [];
        this._bombers = [];
        this._asteroids = [];
        this._blackHoles = [];
        this._pressedKeys = new Set();
        this._buttons = ['w','a','s','d','e','1','2','3'];
        this.powerUps = [];
        this.ammunition = [];
        this._collisionManager = new CollisionManager();
        this._player = new Player(new Vec2(WORLD_WIDTH/2,WORLD_HEIGHT/2),new Vec2(127,130));
        this._camera = new Camera(this._player.getShape.getOrigin().x - CANVAS_WIDTH/2,this._player.getShape.getOrigin().y - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);
        //let qt = new QuadTree(new Vec2(0,0),new Vec2(WORLD_WIDTH,WORLD_HEIGHT), 5);
        this._animationManager = new AnimationManager();
        this._waveManager = new WaveManager();
        this.gui = new Map();
        this.map = new MapGui("map",new Vec2(CANVAS_WIDTH/1.1,CANVAS_HEIGHT/6),new Vec2(1596,266),true,{"mouseenter": null},{"mouseleave": null});
        this.map.addNPCPos(this._bombers);
        this.map.addNPCPos(this._minions);
        this.map.addNPCPos(this._asteroids);
        this.map.addNPCPos(this._blackHoles);
        this._playerPowerUps = [];
        this.init();
    }

    init() 
    {
        this.spawn();
        this.loadGui();
        ctx.font = '24px serif';
        ctx.fillStyle = 'blue';

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

    loadGui()
    {
        this.gui.set("health",[new GuiComponent("healthGUI",new Vec2(164,105),new Vec2(328,105),true)]);
        
        this.gui.set("healthValue",[new GuiComponent("healthValueGUI",new Vec2(this.gui.get("health")[0].getPos().x + 43,this.gui.get("health")[0].getPos().y),new Vec2(222,59),true)]);
        
        this.gui.set("PowerUp",[new GuiComponent("PowerUpGui",new Vec2(this._camera.getSize.x/1.09,this._camera.getSize.y/1.25),new Vec2(253,138),true)]);

        this.gui.set("activePowerUp",[new GuiComponent("activePowerUpGui",new Vec2(this._camera.getSize.x/1.085,this._camera.getSize.y/1.235),new Vec2(253,138),false)]);
       
        this.gui.set("healthSymbol",[new GuiComponent("healthSymbolGui",new Vec2(WORLD_WIDTH * 2,WORLD_HEIGHT * 2),new Vec2(110,110),false),
                                                    new GuiComponent("healthSymbolGui",new Vec2(WORLD_WIDTH * 2,WORLD_HEIGHT * 2),new Vec2(110,110),false)]);
        
        this.gui.set("fireRate",[new GuiComponent("fireRateGui",new Vec2(WORLD_WIDTH * 2, WORLD_HEIGHT * 2),new Vec2(110,110),false),
                                                new GuiComponent("fireRateGui",new Vec2(WORLD_WIDTH * 2, WORLD_HEIGHT * 2),new Vec2(110,110),false)]);
        
        this.gui.set("speed",[new GuiComponent("speedGui",new Vec2(WORLD_WIDTH * 2, WORLD_HEIGHT * 2),new Vec2(110,110),false),
                                            new GuiComponent("speedGui",new Vec2(WORLD_WIDTH * 2, WORLD_HEIGHT * 2),new Vec2(110,110),false)]);
        
        this.gui.set("turret",[new GuiComponent("turretGui",new Vec2(WORLD_WIDTH * 2, WORLD_HEIGHT * 2),new Vec2(110,110),false),
                                             new GuiComponent("turretGui",new Vec2(WORLD_WIDTH * 2, WORLD_HEIGHT * 2),new Vec2(110,110),false)]);
        
        this.gui.set("nullPowerUp",[new GuiComponent("nullPowerUpGui",new Vec2(this._camera.getSize.x/1.035,this._camera.getSize.y/1.215),new Vec2(378,128),true),
                                             new GuiComponent("nullPowerUpGui",new Vec2(this._camera.getSize.x/0.975,this._camera.getSize.y/1.215),new Vec2(378,128),true)]);
        
        this.gui.set("ammo",[new GuiComponent("leftAmmoGui",new Vec2(this._camera.getSize.x/9.5,this._camera.getSize.y/1.25),new Vec2(378,128),true),
                                new GuiComponent("middleAmmoGui",new Vec2(this._camera.getSize.x/9.5,this._camera.getSize.y/1.25),new Vec2(378,128),false),
                                new GuiComponent("rightAmmoGui",new Vec2(this._camera.getSize.x/9.5,this._camera.getSize.y/1.25),new Vec2(378,128),false)]);
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
                let  temp = new PowerUp(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT), new Vec2(300,300),PowerUp.prototype.generateRandomType(Math.round(Math.random()* 2)),  Math.random() * 30);
                this.powerUps.push(temp);
            }

            Ammo.prototype.initAmmo(this.ammunition);
        

            /* Create Black Holes*/
            for(let i = 0; i < this._waveManager.getBlackHoleCount(); i++)
            {
                let  temp = new BlackHole(new Vec2(Math.random() * WORLD_WIDTH - 643,Math.random() * WORLD_HEIGHT - 480), new Vec2(643,480));
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

        this.ammunition.forEach( a =>
        {
            a.update(this._waveManager.getAmmoIntervalTimer());
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
            let index = 0;  
            switch(this._player.getPowerUpType()) 
            {
                case PowerUpType.HEALTH:
                    if(this._player.getHealth + PowerUp.prototype.healthIncreaseValue > 100)
                        PowerUp.prototype.healthIncreaseAmount = PowerUp.prototype.healthIncreaseValue - ((this._player.getHealth + PowerUp.prototype.healthIncreaseValue) - 100);
                    else
                        PowerUp.prototype.healthIncreaseAmount = 10;

                   index = this.gui.get("healthSymbol")[0].getActive() == true ? index = 0 : index = 1;

                   this._player.setHealth =  PowerUp.prototype.healthIncreaseAmount;
                   this.gui.get("healthValue")[0].getRenderSize().x += (this.gui.get("healthValue")[0].getRenderSize().x/100) *  PowerUp.prototype.healthIncreaseAmount;
                   this._player.resetPowerUp();
                   this.gui.get("healthSymbol")[index].setActive(false);  
                    break;
                case  PowerUpType.FIRE_RATE: 
                index = this.gui.get("fireRate")[0].getActive() == true ? index = 0 : index = 1;
                    if (time >= PowerUp.prototype.fireRateTimer)
                    {
                        this._player.setFireRate = 0.5;
                        this._player.resetPowerUp();
                        this.gui.get("fireRate")[index].setActive(false);
                    }  
                    break;
                case  PowerUpType.AUTOTURRET:
                    index = this.gui.get("turret")[0].getActive() == true ? index = 0 : index = 1;
                    if(time >= PowerUp.prototype.AutoTurretTimer)
                    {
                        
                        this._player.getAutoTurret().setActive(false);
                        this._player.resetPowerUp();
                        this.gui.get("turret")[index].setActive(false);
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
                    index = this.gui.get("speed")[0].getActive() == true ? index = 0 : index = 1;
                    if(time >= PowerUp.prototype.speedTimer)
                    { 
                        this._player.setMaxAcceleration(0.5);
                        this._player.setSpeed(0.5);
                        this._player.resetPowerUp();
                        this.gui.get("speed")[index].setActive(false);
                    }
                    break;
            }

            if (this._player.getCurrentPowerUp() == null && this._player.getNextPowerUp() != null)
            {
                this._player.setCurrentPowerUp(this._player.getNextPowerUp());
                this._player.setNextPowerUp(null);
                this.gui.get("activePowerUp")[0].setActive(false);
                for( let [powerUpGuiType,powerUpGuiSymbol] of this.gui.entries())
                {
                    if(powerUpGuiType == "healthSymbol" || powerUpGuiType =="fireRate" || powerUpGuiType == "speed" || powerUpGuiType == "turret")
                    {
                        for( let powerUpSymbol of powerUpGuiSymbol)
                        {
                            if(powerUpSymbol.getActive())
                            {
                                powerUpSymbol.setPos(new Vec2(this._camera.getSize.x/1.13,this._camera.getSize.y/1.255));
                                this._playerPowerUps.shift();
                                this.gui.get("nullPowerUp")[1].setActive(true);
                            }
                        }
                    }
                }
            }
            else if (this._player.getCurrentPowerUp() == null && this._player.getNextPowerUp() == null)
            {
                this.gui.get("nullPowerUp")[0].setActive(true);
                this.gui.get("activePowerUp")[0].setActive(false);
            }
        }

        this.map.update(this._animationManager,this._camera.getPos);

        this.inputHandling(dt);
        this.collisions();    
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
            this.gui.get("activePowerUp")[0].setActive(true);
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
            this.gui.get("ammo")[0].setActive(true);
            this.gui.get("ammo")[1].setActive(false);
            this.gui.get("ammo")[2].setActive(false);
        }
        else if (this._pressedKeys['2'])
        {
            this._player.setCurrentWeapon(1); 
            this.gui.get("ammo")[1].setActive(true);
            this.gui.get("ammo")[0].setActive(false);
            this.gui.get("ammo")[2].setActive(false);
        }
        else if (this._pressedKeys['3'])
        {
            this._player.setCurrentWeapon(2);
            this.gui.get("ammo")[2].setActive(true);
            this.gui.get("ammo")[0].setActive(false);
            this.gui.get("ammo")[1].setActive(false);
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
                //If player collides with a power up when we already have 2 power ups
                if(this._playerPowerUps.length == 2)
                {
                    //get the 2nd power up 
                    let powerUpIcon = this.gui.get(this._playerPowerUps[1]);
                    //if the both  power ups is active set the second one to false/ because we always set the first one to current!
                    if(powerUpIcon[0].getActive() && powerUpIcon[1].getActive())
                    {
                        powerUpIcon[1].setActive(false);
                    } //if the first of two power ups is active set the first one to false
                    else if (powerUpIcon[0].getActive() && !powerUpIcon[1].getActive())
                    {
                        powerUpIcon[0].setActive(false);
                    } //if the second of two power ups is active set the second one to false
                    else if (!powerUpIcon[0].getActive() && powerUpIcon[1].getActive())
                    {
                        powerUpIcon[1].setActive(false);
                    } 
                    //remove next power up
                    this._playerPowerUps.pop();
                }
                //left and right power up gui positions
                let powerupGuiLeft = new Vec2(this._camera.getSize.x/1.13,this._camera.getSize.y/1.255);
                let powerupGuiRight = new Vec2(this._camera.getSize.x/1.05,this._camera.getSize.y/1.255);
                let index = 0;

                switch(this.powerUps[i].getType()) 
                {
                    case PowerUpType.HEALTH:
                        //get current active healthSymbol ( there's 2)
                        this.gui.get("healthSymbol")[0].getActive() == false ? index = 0 : index = 1;
                        if (this._player.getCurrentPowerUp() == null )
                        {   //set current power up, set healthguipoweup to active and set it to the left powrupgui slot
                            this._player.setCurrentPowerUp(PowerUpType.HEALTH);
                            this.gui.get("healthSymbol")[index].setActive(true);
                            this.gui.get("healthSymbol")[index].setPos(powerupGuiLeft);
                            this._playerPowerUps[0] = "healthSymbol";
                        }
                        else
                        {   //set current power up, set healthguipoweup to active and set it to the right powrupgui slot
                            this._player.setNextPowerUp(PowerUpType.HEALTH);
                            this.gui.get("healthSymbol")[index].setActive(true);
                            this.gui.get("healthSymbol")[index].setPos(powerupGuiRight);
                            this._playerPowerUps[1] = "healthSymbol";
                        }
                      break;//timer based power up
                    case  PowerUpType.FIRE_RATE:
                    this.gui.get("fireRate")[0].getActive() == false ? index = 0 : index = 1;
                    if (this._player.getCurrentPowerUp() == null )
                    {
                        this._player.setCurrentPowerUp(PowerUpType.FIRE_RATE);
                        this.gui.get("fireRate")[index].setActive(true);
                        this.gui.get("fireRate")[index].setPos(powerupGuiLeft);
                        this._playerPowerUps[0] = "fireRate";
                    }
                    else
                    {
                        this._player.setNextPowerUp(PowerUpType.FIRE_RATE);
                        this.gui.get("fireRate")[index].setActive(true);
                        this.gui.get("fireRate")[index].setPos(powerupGuiRight);
                        this._playerPowerUps[1] = "fireRate";
                    }
                      break;//timer based power up/ healthbased
                    case  PowerUpType.AUTOTURRET:
                        this.gui.get("turret")[0].getActive() == false ? index = 0 : index = 1;
                        if (this._player.getCurrentPowerUp() == null )
                        {
                            this._player.setCurrentPowerUp(PowerUpType.AUTOTURRET);
                            this.gui.get("turret")[index].setActive(true);
                            this.gui.get("turret")[index].setPos(powerupGuiLeft);
                            this._playerPowerUps[0] = "turret";
                        }
                        else
                        {
                            this._player.setNextPowerUp(PowerUpType.AUTOTURRET);
                            this.gui.get("turret")[index].setActive(true);
                            this.gui.get("turret")[index].setPos(powerupGuiRight);
                            this._playerPowerUps[1] = "turret";
                        }
                      break;
                    case  PowerUpType.SPEED:
                        this.gui.get("speed")[0].getActive() == false ? index = 0 : index = 1;
                        if (this._player.getCurrentPowerUp() == null )
                        {
                            this._player.setCurrentPowerUp(PowerUpType.SPEED);
                            this.gui.get("speed")[index].setActive(true);
                            this.gui.get("speed")[index].setPos(powerupGuiLeft);
                            this._playerPowerUps[0] = "speed";
                        }
                        else
                        {
                            this._player.setNextPowerUp(PowerUpType.SPEED);
                            this.gui.get("speed")[index].setActive(true);
                            this.gui.get("speed")[index].setPos(powerupGuiRight);
                            this._playerPowerUps[1] = "speed";
                            
                        }
                      break;
                }

                if(this._playerPowerUps.length == 1)
                {
                    this.gui.get("nullPowerUp")[0].setActive(false);
                }
                else if(this._playerPowerUps.length == 2)
                {
                    this.gui.get("nullPowerUp")[1].setActive(false);
                }

                this.powerUps[i].setActive(false);
                this.powerUps[i].setInactiveTimer(performance.now());
                //Make power up not active, once power up depleted remove power up
                //destroy power up + animation
            }
        }

        for( let i = 0; i < this.ammunition.length; i++)
        {
            if(!this.ammunition[i].getActive())
                continue;

            if(CollisionManager.SATCollision(this.ammunition[i].getRect().getPoints(), this._player._shape.getPoints()))
            {
               
                if (this.ammunition[i].getType() == AmmoType.MINE)
                    this._player.getWeapons()[2].addAmmo(this.ammunition[i].getAmmount());
                else if (this.ammunition[i].getType() == AmmoType.SHOTGUN)
                    this._player.getWeapons()[1].addAmmo(this.ammunition[i].getAmmount());
               
                this.ammunition[i].setActive(false);
                this.ammunition[i].setTimer(performance.now());
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
                    this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * EnemyMinion.collisionDamage;
        
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
                this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * Bomber.collisionDamage;
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
                        
                        if(this._minions[row][col].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                            this._minions[row].splice(col,1);
                            this.spawn();
                        }
                        if(this._bombers[b].checkHealth())
                        {
                            this._animationManager.addAnimation(5,0.5,this._bombers[b].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                            this._bombers.splice(b,1);
                            this.spawn();
                            break loop1;
                        }
                        
                        if(this._bombers.length <= 0)
                            break loop1;
                    }
                }
            }
        }

        /* Asteroid/Player Collision */
        for( let a = this._asteroids.length - 1; a >= 0; a--)
        {
            if(CollisionManager.SATCollision(this._asteroids[a].getRect().getPoints(),this._player.getShape.getPoints()))
            {
                this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * Asteroid.prototype.collisionDamage;
                this._asteroids[a].setHealth(-this._player.getCollisionDamage());
                this._player.setHealth = -Asteroid.prototype.collisionDamage;

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
                    this._bombers[b].setHealth = -Asteroid.prototype.collisionDamage;

                    if(this._bombers[b].checkHealth())
                    {
                        this._bombers.splice(b,1);
                        break;
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
                        this._minions[row][col].setHealth = -Asteroid.prototype.collisionDamage;

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
            let noOfFrames = w == 2 ? 9 : 5;
            let bulletAnimation =  w == 2 ? MINE_EXPLOSION_IMAGE : BULLET_EXPLOSION_IMAGE;
            let animationSize = w == 2 ? new Vec2(210,210) : new Vec2(256,256);
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
                            //frames, transitiontime,pos,image,size,currentFrame,timer
                            this._animationManager.addAnimation(noOfFrames,0.5,playerBullets[b].getRect.getOrigin(),bulletAnimation,animationSize);
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
                        this._animationManager.addAnimation(noOfFrames,0.5,playerBullets[b].getRect.getOrigin(),bulletAnimation,animationSize);
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
                        this._animationManager.addAnimation(noOfFrames,0.5,playerBullets[b].getRect.getOrigin(),bulletAnimation,animationSize);
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
                    this._animationManager.addAnimation(noOfFrames,0.5,playerBullets[i].getRect.getOrigin(),bulletAnimation,animationSize);
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
                    this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * Bomber.bulletDamage;
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

        this.ammunition.forEach( a =>
        {
            if(a.getActive())
                a.draw(ctx,this._camera.getPos)
        });
        
        for (let value of this.gui.values())
        {
            value.forEach(val=> 
            {
                if(val.getActive())
                    val.draw(ctx, this._camera.getPos);
            });
        }
        
        this.map.drawMap(ctx,this._camera.getPos);
        this._animationManager.draw(ctx,this._camera.getPos);
        this.map.drawObjects(ctx,this._camera.getPos,this._player.getSpriteAngle,this._player.getShape.getOrigin());

       
       ctx.fillText('INF',((this._camera.getPos.x + this._camera.getSize.x/32) - this._camera.getPos.x),((this._camera.getPos.y + this._camera.getSize.y/1.183) - this._camera.getPos.y));
       ctx.fillText(this._player.getWeapons()[1].getAmmoCount(),((this._camera.getPos.x + this._camera.getSize.x/10) - this._camera.getPos.x),((this._camera.getPos.y + this._camera.getSize.y/1.183) - this._camera.getPos.y));
       ctx.fillText(this._player.getWeapons()[2].getAmmoCount(),((this._camera.getPos.x + this._camera.getSize.x/5.9) - this._camera.getPos.x),((this._camera.getPos.y + this._camera.getSize.y/1.183) - this._camera.getPos.y));
    }

    NextScene()
    {
        let gameOverScene = new GameOverScene(this._scenes);
        this._scenes.push(gameOverScene);
        this._scenes.shift();
    }
}