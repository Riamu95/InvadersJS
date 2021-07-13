class GameScene extends Scene 
{
    constructor(scene)
    {
        super();
        this.scenes = scene;
        this.worldWidth = 6000;
        this.worldHeight = 6000;
        this.minions = [];
        this.flockPoints = [];
        this.bombers = [];
        this.asteroids = [];
        this.blackHoles = [];
        this.pressedKeys = new Set();
        this.buttons = Object.freeze(['w','a','s','d','e','1','2','3']);
        this.powerUps = [];
        this.ammunition = [];

        this.collisionManager = new CollisionManager();
        this.player = new Player(new Vec2(this.worldWidth/2,this.worldHeight/2),new Vec2(156,151));//new Vec2(127,130));
        this.camera = new Camera(this.player.getShape.getOrigin().x - this._canvasWidth/2,this.player.getShape.getOrigin().y - this._canvasHeight/2,this._canvasWidth,this._canvasHeight, this.worldWidth,this.worldHeight);
        //let qt = new QuadTree(new Vec2(0,0),new Vec2(this.worldWidth,this.worldHeight), 5);
        this.animationManager = new AnimationManager();
        this.waveManager = new WaveManager(this.worldWidth,this.worldHeight);
        
        this.gui = new Map();
        
        this.map = new MapGui("map",new Vec2(this._canvasWidth/1.1,this._canvasHeight/6),new Vec2(1596,266),true,{"mouseenter": null},{"mouseleave": null});
        this.map.addNPCPos(this.bombers);
        this.map.addNPCPos(this.minions);
        this.map.addNPCPos(this.asteroids);
        this.map.addNPCPos(this.blackHoles);
        
        this.playerPowerUps = [];

        this.particleSystem = new ParticleSystem();
        this.particleTimer = 0;
        this.minionspawnXOffset = 250;
        this.minionspawnYOffset = 138;
        this.spawnPoints = 37;


        this.engineBeginColour = [226, 40, 34];
        this.engineEndColour = [255,255,0];
        this.engineTTL = 0.25;

        this.fps = 0;

        this.init();

        this.powerupGuiLeftPos = new Vec2(this.camera.getSize.x/1.13,this.camera.getSize.y/1.105);
        this.powerupGuiRightPos = new Vec2(this.camera.getSize.x/1.0525,this.camera.getSize.y/1.105);
    }
     

    init() 
    {
        this.spawn();
        this.loadGui();

        GameScene._ctx.font = '24px serif';
        GameScene._ctx.fillStyle = 'blue';
        PowerUp.prototype.setWorldSize(new Vec2(this.worldWidth,this.worldHeight));

        AudioManager.getInstance().addSound("background", "../Assets/Audio/background.wav", { loop : true });
        AudioManager.getInstance().addSound("engine", "../Assets/Audio/engine.ogg", { loop : true });
        AudioManager.getInstance().addSound("pistol", "../Assets/Audio/pistol.ogg", { loop : false });
        AudioManager.getInstance().addSound("shotgun", "../Assets/Audio/shotgun.ogg", { loop : false });
        AudioManager.getInstance().addSound("reload", "../Assets/Audio/Reload.ogg", { loop : false });
        AudioManager.getInstance().addSound("mine", "../Assets/Audio/mine.ogg", { loop : false });
        AudioManager.getInstance().addSound("mineExplosion", "../Assets/Audio/mineExplosion.wav", { loop : false });
        AudioManager.getInstance().addSound("pistolExplosion", "../Assets/Audio/pistolExplosion.wav", { loop : false });
        AudioManager.getInstance().addSound("powerUp", "../Assets/Audio/powerUp.wav", { loop : false });
        AudioManager.getInstance().addSound("turret", "../Assets/Audio/turret.wav", { loop : false });

        document.addEventListener('keydown', (event) =>
        { 
           if (this.buttons.includes(event.key))
                this.pressedKeys[event.key] = true;
            
            if(event.key == "w")
                AudioManager.getInstance().playEngine();
        });   

        document.addEventListener('keyup', (event) =>
        {
            if(this.buttons.includes(event.key))
                this.pressedKeys[event.key] = false;

            if(event.key == "w")
                AudioManager.getInstance().stopEngine();
        });

        document.addEventListener('click', () =>
        {
            if(!this.player.getFired())
            {
                this.player.setFired(true);
                this.player.setFireTimer(performance.now()); 
            }

            this.player.getCurrentWeapon().getAmmoCount() <= 0 &&   AudioManager.getInstance().playSound("reload");
        });

        AudioManager.getInstance().getSound("engine").on('fade', () =>
        {
            if(AudioManager.getInstance().getSound("engine").volume() == 0)
                AudioManager.m_engineToggle = false;
        });
    }

    loadGui()
    {
        this.gui.set("health",[new GuiComponent("healthGUI",new Vec2(164,105),new Vec2(328,105),true)]);
        
        this.gui.set("healthValue",[new GuiComponent("healthValueGUI",new Vec2(this.gui.get("health")[0].getPos().x + 43,this.gui.get("health")[0].getPos().y),new Vec2(222,59),true)]);
        
        this.gui.set("PowerUp",[new GuiComponent("PowerUpGui",new Vec2(this.camera.getSize.x/1.09,this.camera.getSize.y/1.1),new Vec2(253,138),true)]);

        this.gui.set("activePowerUp",[new GuiComponent("activePowerUpGui",new Vec2(this.camera.getSize.x/1.085,this.camera.getSize.y/1.085),new Vec2(253,138),false)]);
       
        this.gui.set("healthSymbol",[new GuiComponent("healthSymbolGui",new Vec2(this.worldWidth * 2,this.worldHeight * 2),new Vec2(110,110),false),
                                                    new GuiComponent("healthSymbolGui",new Vec2(this.worldWidth * 2,this.worldHeight * 2),new Vec2(110,110),false)]);
        
        this.gui.set("fireRate",[new GuiComponent("fireRateGui",new Vec2(this.worldWidth * 2, this.worldHeight * 2),new Vec2(110,110),false),
                                                new GuiComponent("fireRateGui",new Vec2(this.worldWidth * 2, this.worldHeight * 2),new Vec2(110,110),false)]);
        
        this.gui.set("speed",[new GuiComponent("speedGui",new Vec2(this.worldWidth * 2, this.worldHeight * 2),new Vec2(110,110),false),
                                            new GuiComponent("speedGui",new Vec2(this.worldWidth * 2, this.worldHeight * 2),new Vec2(110,110),false)]);
        
        this.gui.set("turret",[new GuiComponent("turretGui",new Vec2(this.worldWidth * 2, this.worldHeight * 2),new Vec2(110,110),false),
                                             new GuiComponent("turretGui",new Vec2(this.worldWidth * 2, this.worldHeight * 2),new Vec2(110,110),false)]);
        
        this.gui.set("nullPowerUp",[new GuiComponent("nullPowerUpGui",new Vec2(this.camera.getSize.x/1.035,this.camera.getSize.y/1.07),new Vec2(378,128),true),
                                             new GuiComponent("nullPowerUpGui",new Vec2(this.camera.getSize.x/0.975,this.camera.getSize.y/1.07),new Vec2(378,128),true)]);
        
        this.gui.set("ammo",[new GuiComponent("leftAmmoGui",new Vec2(this.camera.getSize.x/9.5,this.camera.getSize.y/1.1),new Vec2(378,128),true),
                                new GuiComponent("middleAmmoGui",new Vec2(this.camera.getSize.x/9.5,this.camera.getSize.y/1.1),new Vec2(378,128),false),
                                new GuiComponent("rightAmmoGui",new Vec2(this.camera.getSize.x/9.5,this.camera.getSize.y/1.1),new Vec2(378,128),false)]);
    }

    spawn()
    {
            for(let row = 0; row < this.minions.length; row++)
            {
               if(this.minions[row].length > 0 )
                    return;
            }

            if (this.bombers.length > 0)
                return; 

            //short circuits on the first falsey value
            this.blackHoles.length > 0 &&  this.blackHoles.splice(0, this.blackHoles.length -1);
            this.asteroids.length > 0 && this.asteroids.splice(0,this.asteroids.length -1);
            this.powerUps.length > 0 && this.powerUps.splice(0,this.powerUps.length -1);

            this.waveManager.nextWave();
            
            //create Power Ups
            for(let i = 0; i < this.waveManager.getPowerUpCount(); i++)
            {
                let  temp = new PowerUp(new Vec2(Math.random() * this.worldWidth, Math.random() * this.worldHeight), new Vec2(300,300),PowerUp.prototype.generateRandomType(Math.round(Math.random()* 2)),  Math.random() * 30);
                this.powerUps.push(temp);
            }

            Ammo.prototype.initAmmo(this.ammunition,this.worldWidth,this.worldHeight);
        

            /* Create Black Holes*/
            for(let i = 0; i < this.waveManager.getBlackHoleCount(); i++)
            {
                let  temp = new BlackHole(new Vec2(Math.random() * this.worldWidth - 643,Math.random() * this.worldHeight - 480), new Vec2(643,480));
                this.blackHoles.push(temp);
            }
            /* Createthis.asteroids */
            for(let i = 0; i < this.waveManager.getAsteroidCount(); i++)
            {
                let pos = this.waveManager.getSpawnPoint(Math.trunc(Math.random() * this.spawnPoints));
                let  temp = new Asteroid(new Vec2(pos.x, pos.y), new Vec2(99,99));
                this.asteroids.push(temp);
            }
            /* Createthis.minions*/
            for(let row = 0; row < this.waveManager.getFlockCount(); row++)
            {
                let pos = this.waveManager.getSpawnPoint(Math.trunc(Math.random() * this.spawnPoints));
                let tempMinions = [];
                for(let col = 0; col < this.waveManager.getMininonCount(); col++)
                {
                    let tempMinion = new EnemyMinion(new Vec2(pos.x + (col * 20), pos.y + (row * 20)), new Vec2(90, 102) ,new Vec2(Math.random(1) + -1, Math.random(1) + -1));
                    tempMinions.push(tempMinion);
                }
                this.minions.push(tempMinions);
                this.flockPoints.push(new Vec2(Math.random() * (this.worldWidth - this.minionspawnXOffset), Math.random() * (this.worldHeight - this.minionspawnYOffset)));
            }
            /* Create this.bombers*/
            for(let i = 0; i < this.waveManager.getBomberCount(); i++)
            {
                let pos = this.waveManager.getSpawnPoint(Math.trunc(Math.random() * this.spawnPoints));
                let flockPoint = new Vec2(Math.random() * this.worldWidth, Math.random() * this.worldHeight);
                let tempBomber = new Bomber(new Vec2(pos.x,pos.y), new Vec2(128,158), new Vec2(0,0),flockPoint);
                this.bombers.push(tempBomber);
            }        
    }

    update(dt)
    {
        this.fps  = 1000 / dt;

        for( let i = 0; i < this.player.getWeapons().length; i++)
        {
            this.player.getWeapons()[i].update(dt);
        }  
    
        //for every array, allocate seek point and move the flock
        for( let row = 0; row < this.minions.length; row++)
        {
            EnemyMinion.generateFlockPoint(this.minions[row], this.player.getShape.getOrigin(), this.flockPoints[row], dt, this.worldWidth, this.worldHeight);
        }
    
        /* Bomber and bomber bullet MOVE */
        for(let i = 0; i <  this.bombers.length; i++ )
        {
            this.bombers[i].move(dt, this.player.getShape.getOrigin(), this.worldWidth, this.worldHeight);
    
            for(let b = 0; b <  this.bombers[i]._bullets.length; b++)
            {
                this.bombers[i]._bullets[b].seek(dt, this.player.getShape.getOrigin());
            } 
        }
        /* Black Holes update */
        this.blackHoles.forEach( bh =>
        {
            bh.update();
            let [force, teleport] = bh.attract(this.player.getShape.getOrigin(),this.player.getMass,this.worldWidth,this.worldHeight);
            if (!teleport)
            {
                this.player.getAcceleration.addVec = force;
            }
            else
            {
                this.player.getShape.setOrigin(force);
                this.player.setShapePosition();
                //animate here apply initiala impulsesss
            }
        });


        this.powerUps.forEach( pu =>
        {
            pu.update();
        });

        this.ammunition.forEach( a =>
        {
            a.update(this.waveManager.getAmmoIntervalTimer(),this.worldWidth,this.worldHeight);
        });

        this.player.getAutoTurret().getActive() &&  this.player.getAutoTurret().update(dt);   

        /* this.asteroids update */
        this.asteroids.forEach(ast =>
        {
            ast.update(this.worldWidth,this.worldHeight);
        })

        if(this.player.getUsingPowerUp())
        {                                          
            let time  = Math.round((performance.now() - PowerUp.prototype.currentPowerUpTimer)/1000);
            let index = 0;  
            switch(this.player.getPowerUpType()) 
            {
                case PowerUpType.HEALTH:
                    if(this.player.getHealth + PowerUp.prototype.healthIncreaseValue > 100)
                        PowerUp.prototype.healthIncreaseAmount = PowerUp.prototype.healthIncreaseValue - ((this.player.getHealth + PowerUp.prototype.healthIncreaseValue) - 100);
                    else
                        PowerUp.prototype.healthIncreaseAmount = 10;

                   index = this.gui.get("healthSymbol")[0].getActive() == true ? index = 0 : index = 1;

                   this.player.setHealth =  PowerUp.prototype.healthIncreaseAmount;
                   this.gui.get("healthValue")[0].getRenderSize().x += (this.gui.get("healthValue")[0].getRenderSize().x/100) *  PowerUp.prototype.healthIncreaseAmount;
                   this.player.resetPowerUp();
                   this.gui.get("healthSymbol")[index].setActive(false);  
                    break;
                case  PowerUpType.FIRE_RATE: 
                index = this.gui.get("fireRate")[0].getActive() == true ? index = 0 : index = 1;
                    if (time >= PowerUp.prototype.fireRateTimer)
                    {
                        this.player.setFireRate = 0.5;
                        this.player.resetPowerUp();
                        this.gui.get("fireRate")[index].setActive(false);
                    }  
                    break;
                case  PowerUpType.AUTOTURRET:
                    index = this.gui.get("turret")[0].getActive() == true ? index = 0 : index = 1;
                    if(time >= PowerUp.prototype.AutoTurretTimer)
                    {
                        
                        this.player.getAutoTurret().setActive(false);
                        this.player.resetPowerUp();
                        this.gui.get("turret")[index].setActive(false);
                        //explosion animation for all remaining bullets
                        for(let value of this.player.getAutoTurret().getBullets().values())
                        {
                            if (value[1] == true)
                            {
                                this.animationManager.addAnimation(5,0.02,value[0].getRect.getOrigin(),"BULLET",new Vec2(256,256),false);    
                            }
                        }
                        this.player.getAutoTurret().clear();
                    }  
                    break;
                case PowerUpType.SPEED:
                    index = this.gui.get("speed")[0].getActive() == true ? index = 0 : index = 1;
                    if(time >= PowerUp.prototype.speedTimer)
                    { 
                        this.player.setMaxAcceleration(0.5);
                        this.player.setSpeed(0.5);
                        this.player.resetPowerUp();
                        this.gui.get("speed")[index].setActive(false);
                    }
                    break;
            }

            if (this.player.getCurrentPowerUp() == null && this.player.getNextPowerUp() != null)
            {
                this.player.setCurrentPowerUp(this.player.getNextPowerUp());
                this.player.setNextPowerUp(null);
                this.gui.get("activePowerUp")[0].setActive(false);
                for( let [powerUpGuiType,powerUpGuiSymbol] of this.gui.entries())
                {
                    if(powerUpGuiType == "healthSymbol" || powerUpGuiType =="fireRate" || powerUpGuiType == "speed" || powerUpGuiType == "turret")
                    {
                        for( let powerUpSymbol of powerUpGuiSymbol)
                        {
                            if(powerUpSymbol.getActive())
                            {
                                powerUpSymbol.setPos(new Vec2(this.camera.getSize.x/1.13,this.camera.getSize.y/1.105));
                                this.playerPowerUps.shift();
                                this.gui.get("nullPowerUp")[1].setActive(true);
                            }
                        }
                    }
                }
            }
            else if (this.player.getCurrentPowerUp() == null && this.player.getNextPowerUp() == null)
            {
                this.gui.get("nullPowerUp")[0].setActive(true);
                this.gui.get("activePowerUp")[0].setActive(false);
            }
        }

        this.map.update(this.animationManager,this.camera.getPos,this._canvasWidth,this._canvasHeight);
        /*
        if(Vec2.length(this.player.getVelocity()) > 0.1)
        {
           
        }*/

        this.particleSystem.update(dt);

        this.inputHandling(dt);
        this.collisions();    
    }
    

    inputHandling(dt)
    {

        if(this.player.getFired() && (performance.now() - this.player.getFireTimer) /1000 >= this.player.getFireRate && this.player.getCurrentWeapon().getAmmoCount() > 0)
        {
            const bulletSpawnPoint = new Vec2((this.player.getShape.getPoints()[3].x + this.player.getShape.getPoints()[2].x) /2, (this.player.getShape.getPoints()[3].y + this.player.getShape.getPoints()[2].y) /2);

            this.player.getCurrentWeapon().addBullet( bulletSpawnPoint ,this.player.getCurrentWeapon().getBulletSize(),this.player.getSpriteAngle * Math.PI/180,this.player.getMaxBulletSpeed);
            this.player.setFired(false);
        }

        if(this.pressedKeys['w'])
        {
            if(this.player.getSpeed() <=  this.player.getMaxAcceleration)
            {
                this.player.addSpeed(this.player.getAccelerationRate);
            } 
            this.player.move(dt); 
            this.camera.update(this.player.getShape.getOrigin(),this._canvasWidth,this._canvasHeight);
            
            while(((performance.now() - this.particleTimer)/1000) > 0.05)
            {
                for(let i = 0; i < 25; i++)
                {  

                    let angle = this.player.getSpriteAngle;
                    let angleOffset = Math.random() * (45 - (-45)) + (-45);
                    
                    angle += angleOffset;

                    const direction = new Vec2( (Math.cos(angle  * (Math.PI / 180))) * -1, (Math.sin(angle  * (Math.PI / 180))) * -1);
                    let pos = new Vec2(this.player.getShape.getPoints()[0].x + this.player.getShape.getPoints()[5].x, this.player.getShape.getPoints()[0].y + this.player.getShape.getPoints()[5].y);
                     
                    pos.x /= 2;
                    pos.y /= 2;

                    this.particleSystem.emit(pos, direction, this.engineBeginColour, this.engineEndColour , this.engineTTL , 0 , Math.random() * 1);
                }
                 this.particleTimer = performance.now();
            }
        }
        else if(this.pressedKeys['s'])
        {
            if( this.player.getSpeed() >= -this.player.getMaxAcceleration)
            {
                this.player.addSpeed(-this.player.getAccelerationRate);
            }  
            this.player.move(dt); 
            this.camera.update(this.player.getShape.getOrigin(),this._canvasWidth,this._canvasHeight);  
        }
        else if(!this.pressedKeys['w'] && !this.pressedKeys['s'])
        {
            if(this.player.getSpeed() > 0)
            {
                this.player.addSpeed(-this.player.getDeccelerationRate);
            }
            else if(this.player.getSpeed() < 0)
            {
                this.player.addSpeed(this.player.getDeccelerationRate);
            }
           
            this.player.move(dt); 
            this.camera.update(this.player.getShape.getOrigin(),this._canvasWidth,this._canvasHeight);  
        }
        if(this.pressedKeys['d'])
        {
            this.player.setSpriteAngle = this.player.getRotationSpeed;
            this.player.getShape.setAngle(this.player.getRotationSpeed);
            this.player.getShape.rotate();
        }
        if(this.pressedKeys['a'])
        {
            this.player.setSpriteAngle = -this.player.getRotationSpeed;
            this.player.getShape.setAngle(-this.player.getRotationSpeed);
            this.player.getShape.rotate();
        }


        if(this.pressedKeys['e']  && this.player.getCurrentPowerUp() != null)
        {
            this.player.setUsingPowerUp(true);
            PowerUp.prototype.currentPowerUpTimer = performance.now();
            this.gui.get("activePowerUp")[0].setActive(true);
            switch(this.player.getCurrentPowerUp()) 
            {
                case PowerUpType.HEALTH:
                    this.player.setPowerUpType(PowerUpType.HEALTH);
                    break;
                case  PowerUpType.FIRE_RATE:
                    this.player.setFireRate = 0.25;
                    this.player.setPowerUpType(PowerUpType.FIRE_RATE);
                    break;
                case  PowerUpType.AUTOTURRET:
                    this.player.setPowerUpType(PowerUpType.AUTOTURRET);
                    this.player.getAutoTurret().setActive(true);
                    break;
                case  PowerUpType.SPEED:
                    this.player.setMaxAcceleration(1);
                    this.player.setPowerUpType(PowerUpType.SPEED);
                    break;
            }
            this.pressedKeys['e'] = false;
        }
        if (this.pressedKeys['1'])
        {
            this.player.setCurrentWeapon(0);
            this.gui.get("ammo")[0].setActive(true);
            this.gui.get("ammo")[1].setActive(false);
            this.gui.get("ammo")[2].setActive(false);
        }
        else if (this.pressedKeys['2'])
        {
            this.player.setCurrentWeapon(1); 
            this.gui.get("ammo")[1].setActive(true);
            this.gui.get("ammo")[0].setActive(false);
            this.gui.get("ammo")[2].setActive(false);
        }
        else if (this.pressedKeys['3'])
        {
            this.player.setCurrentWeapon(2);
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
        this.npcCollisions();
        this.playerNpcCollisions();
    }

    playerNpcCollisions()
    {
         //this should be inanother function?
         if(this.player.getAutoTurret().getActive())
         {
             for (let row = 0; row < this.minions.length; row ++)
             {
                 for(let col = 0; col < this.minions[row].length; col ++)
                 {
                     if(Vec2.distance(this.player.getAutoTurret().getRect().getOrigin(),this.minions[row][col].getRect.getOrigin()) < this.player.getAutoTurret().getActiveDistance())
                     {
                         this.player.getAutoTurret().addBullet(this.minions[row][col].getRect.getOrigin());
                     }
                 }
             }
 
             for(let i = this.bombers.length -1; i >= 0; i--)
             {
                 if(Vec2.distance(this.player.getAutoTurret().getRect().getOrigin(),this.bombers[i].getRect.getOrigin()) < this.player.getAutoTurret().getActiveDistance())
                 {
                     this.player.getAutoTurret().addBullet(this.bombers[i].getRect.getOrigin());
                 }
             }
 
             for(let i = this.asteroids.length -1; i >= 0; i--)
             {
                 if(Vec2.distance(this.player.getAutoTurret().getRect().getOrigin(),this.asteroids[i].getRect().getOrigin()) < this.player.getAutoTurret().getActiveDistance())
                 {
                     this.player.getAutoTurret().addBullet(this.asteroids[i].getRect().getOrigin());
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
 
             if(CollisionManager.SATCollision(this.powerUps[i].getRect().getPoints(), this.player._shape.getPoints()))
             {
                 AudioManager.getInstance().playSound("powerUp");
                 for( let p = 0 ; p < 50; p++)
                 {
                    let percentage = p/50;
                    const angle = Lerp.LerpFloat(0,360,percentage)
                    
                    const direction = new Vec2( (Math.cos(angle  * (Math.PI / 180))), (Math.sin(angle  * (Math.PI / 180))));

                    let pos = new Vec2(this.powerUps[i].getRect().getOrigin().x , this.powerUps[i].getRect().getOrigin().y);
                    this.particleSystem.emit(pos, direction, [0,0,255], [0,255,255] , 1 , 14 , 1);
                 }

                 //If player collides with a power up when we already have 2 power ups
                 if(this.playerPowerUps.length == 2)
                 {
                     //get the 2nd power up 
                     let powerUpIcon = this.gui.get(this.playerPowerUps[1]);
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
                     this.playerPowerUps.pop();
                 }
                
                 switch(this.powerUps[i].getType()) 
                 {
                     case PowerUpType.HEALTH:
                         this.assignPowerUpGuiSymbol("healthSymbol", PowerUpType.HEALTH);
                       break;//timer based power up
                     case  PowerUpType.FIRE_RATE:
                         this.assignPowerUpGuiSymbol("fireRate", PowerUpType.FIRE_RATE);
                       break;//timer based power up/ healthbased
                     case  PowerUpType.AUTOTURRET:
                         this.assignPowerUpGuiSymbol("turret", PowerUpType.AUTOTURRET);
                       break;
                     case  PowerUpType.SPEED:
                         this.assignPowerUpGuiSymbol("speed", PowerUpType.SPEED);
                       break;
                 }
 
                 if(this.playerPowerUps.length == 1)
                 {
                     this.gui.get("nullPowerUp")[0].setActive(false);
                 }
                 else if(this.playerPowerUps.length == 2)
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
 
             if(CollisionManager.SATCollision(this.ammunition[i].getRect().getPoints(), this.player._shape.getPoints()))
             {
                 if (this.ammunition[i].getType() == AmmoType.MINE)
                     this.player.getWeapons()[2].addAmmo(this.ammunition[i].getAmmount());
                 else if (this.ammunition[i].getType() == AmmoType.SHOTGUN)
                     this.player.getWeapons()[1].addAmmo(this.ammunition[i].getAmmount());
 
                 this.ammunition[i].setActive(false);
                 this.ammunition[i].setTimer(performance.now());
             }
         }
 
           /*  Mininons and player */
         for(let row = 0; row < this.minions.length; row++)
         {
             for(let col = this.minions[row].length -1; col >= 0 ; col--)
             {  
             //quad tree detection
                 if(CollisionManager.SATCollision(this.minions[row][col]._rect.getPoints(), this.player._shape.getPoints()))
                 {
                     this.player.setHealth = -EnemyMinion.collisionDamage;
                     this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * EnemyMinion.collisionDamage;
         
                     this.minions[row][col].setHealth = -this.player.getCollisionDamage();
 
                     this.animationManager.addAnimation(5,0.02,this.minions[row][col].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                     if(this.player.getAutoTurret().getBullets().keys(this.minions[row][col].getRect.getOrigin()) != undefined)
                     {
                         this.player.getAutoTurret().getBullets().delete(this.minions[row][col].getRect.getOrigin());
                     }
 
                     this.minions[row][col].checkHealth() &&  this.minions[row].splice(col,1);
                     this.player.checkHealth() && this.NextScene();
         
                     this.spawn();
                 }
             }
         }
         /* Player Bomber */
         for( let b = this.bombers.length -1; b >= 0; b--)
         {
             if(CollisionManager.SATCollision(this.bombers[b].getRect.getPoints(),this.player.getShape.getPoints()))
             {
                 this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * Bomber.collisionDamage;
                 this.player.setHealth = -Bomber.collisionDamage;
                 this.bombers[b].setHealth = -this.player.getCollisionDamage();
                 
                 this.bombers[b].checkHealth() && this.bombers.splice(b,1);
                 this.player.checkHealth() &&  this.NextScene();
                 
                 this.spawn();
                 //impulse
                 //Reduce player and bomber health
                 //animation/particle affects
                 //check if player and bomber are still alive
             }
         }
         
         /* Asteroid/Player Collision */
         for( let a = this.asteroids.length - 1; a >= 0; a--)
         {
             if(CollisionManager.SATCollision(this.asteroids[a].getRect().getPoints(),this.player.getShape.getPoints()))
             {
                 this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * Asteroid.prototype.collisionDamage;
                 this.asteroids[a].setHealth(-this.player.getCollisionDamage());
                 this.player.setHealth = -Asteroid.prototype.collisionDamage;
 
                 if(this.player.getAutoTurret().getBullets().keys(this.asteroids[a].getRect().getOrigin()) != undefined)
                 {
                     this.player.getAutoTurret().getBullets().delete(this.asteroids[a].getRect().getOrigin());
                     //if bullet is active exploding animation??
                 }
                 if (this.asteroids[a].checkHealth())
                 {
                     this.animationManager.addAnimation(5,0.02,this.asteroids[a].getRect().getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                     this.asteroids.splice(a,1);
                 }
 
                 if(this.player.checkHealth())
                 {
                    this.NextScene();
                 }
                 this.spawn();
             }
         }
    }

    npcCollisions()
    {
          //this.bombers anddthis.minions
          loop1:
          for( let b = this.bombers.length -1; b >= 0; b--)
          {
              loop2:
              for (let row = this.minions.length -1; row >= 0; row --)
              {
                  loop3:
                  for(let col = this.minions[row].length -1; col >= 0; col --)
                  {
                      if(CollisionManager.SATCollision(this.bombers[b].getRect.getPoints(),this.minions[row][col].getRect.getPoints()))
                      {
                          this.bombers[b].setHealth = -EnemyMinion.collisionDamage;
                          this.minions[row][col].setHealth = -Bomber.collisionDamage;
                          
                          if(this.minions[row][col].checkHealth())
                          {
                              this.animationManager.addAnimation(5,0.02,this.minions[row][col].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                              this.minions[row].splice(col,1);
                              this.spawn();
                          }
                          if(this.bombers[b].checkHealth())
                          {
                              this.animationManager.addAnimation(5,0.02,this.bombers[b].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                              this.bombers.splice(b,1);
                              this.spawn();
                              break loop1;
                          }
                          
                          if(this.bombers.length <= 0)
                              break loop1;
                      }
                  }
              }
          }

           //Asteroids and this.bombers
         for( let b = this.bombers.length -1; b >= 0; b--)
         {
             for( let a = this.asteroids.length - 1; a >= 0; a--)
             {
                 if(CollisionManager.SATCollision(this.asteroids[a].getRect().getPoints(),this.bombers[b].getRect.getPoints()))
                 {
                     //MTV 
                     this.asteroids[a].setHealth(-Bomber.collisionDamage);
                     this.bombers[b].setHealth = -Asteroid.prototype.collisionDamage;
 
                     if(this.bombers[b].checkHealth())
                     {
                         this.bombers.splice(b,1);
                         break;
                     } 
                     if(this.asteroids[a].checkHealth())
                     {
                         this.asteroids.splice(a,1);
                     } 
                 }
             }
         }

          //Asteroids andthis.minions
        loop1:
        for( let a = this.asteroids.length -1; a >= 0; a --)
        {
            loop2:
            for (let row = this.minions.length -1; row >= 0; row --)
            {
                loop3:
                for(let col = this.minions[row].length -1; col >= 0; col --)
                {
                    if(CollisionManager.SATCollision(this.asteroids[a].getRect().getPoints(),this.minions[row][col].getRect.getPoints()))
                    {
                        this.asteroids[a].setHealth(-EnemyMinion.collisionDamage);
                        this.minions[row][col].setHealth = -Asteroid.prototype.collisionDamage;

                        if(this.minions[row][col].checkHealth())
                        {
                            this.animationManager.addAnimation(5,0.02,this.minions[row][col].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                            this.minions[row].splice(col,1);
                        }
                        if(this.asteroids[a].checkHealth())
                        {
                            this.animationManager.addAnimation(5,0.02,this.asteroids[a].getRect().getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                            this.asteroids.splice(a,1);
                            break loop1;
                           
                        }
                        //same issue here when minions collide with last aasteroid, need to break
                       this.spawn();

                       if(this.asteroids.length <= 0)
                            break loop1;
                    }
                }
            }
        }

         // Asteroid on Asteroid 
         for(let a = 0; a < this.asteroids.length -1; a++)
         {
             for(let b = a + 1; b < this.asteroids.length; b++)
             {
                 if (CollisionManager.SATCollision(this.asteroids[a].getRect().getPoints(),this.asteroids[b].getRect().getPoints()))
                 {
                     this.animationManager.addAnimation(5,0.02,this.asteroids[a].getRect().getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                     this.animationManager.addAnimation(5,0.02,this.asteroids[b].getRect().getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                     this.asteroids.splice(b,1);
                     this.asteroids.splice(a,1);
                     this.spawn();
                     break;
                 }
             }
         }

           //Bomber on Bomber 
        for(let a = 0; a < this.bombers.length -1; a++)
        {
            for(let b = a + 1; b < this.bombers.length; b++)
            {
                if (CollisionManager.SATCollision(this.bombers[a].getRect.getPoints(),this.bombers[b].getRect.getPoints()))
                {
                        //MTV
                }
            }
        }
    }

    assignPowerUpGuiSymbol(symbolType,powerUpType)
    {
        let index = 0;
        this.gui.get(symbolType)[0].getActive() == false ? index = 0 : index = 1;
        //get current active Symbol ( there's 2)
        if (this.player.getCurrentPowerUp() == null )
        {   //set current power up, set guipoweup to active and set it to the left powrupgui slot
            this.player.setCurrentPowerUp(powerUpType);
            this.gui.get(symbolType)[index].setActive(true);
            this.gui.get(symbolType)[index].setPos(this.powerupGuiLeftPos);
            this.playerPowerUps[0] = symbolType;
        }
        else
        {   //set current power up, set guipoweup to active and set it to the right powrupgui slot
            this.player.setNextPowerUp(powerUpType);
            this.gui.get(symbolType)[index].setActive(true);
            this.gui.get(symbolType)[index].setPos(this.powerupGuiRightPos);
            this.playerPowerUps[1] = symbolType;
        }
    }

    bulletCollisions()
    {
        this.turretCollisions();
      
        //for all the players weapons // check bullets against game objects
        for(let w = 0; w < this.player.getWeapons().length; w++)
        {
            let playerBullets = this.player.getWeapons()[w].getBullets();
            let noOfFrames = null;
            let bulletExplosionAnimation = null;
            let animationSize = null;
            let bulletExplosionSound = null;
            
            if(w == 0)
            {
                animationSize =  new Vec2(256,256);
                noOfFrames = 5;
                bulletExplosionAnimation = "BULLET";
                bulletExplosionSound = "pistolExplosion";
            }
            else if (w == 1)
            {
                animationSize =  new Vec2(256,256);
                noOfFrames = 5;
                bulletExplosionAnimation = "BULLET";
                bulletExplosionSound = "shotgunExplosion";
            }
            else if(w == 2)
            {
                animationSize =  new Vec2(210,210);
                noOfFrames = 9;
                bulletExplosionAnimation = "MINE";
                bulletExplosionSound = "mineExplosion";
            }
                    
             /* Minion Player bullet collision */
            for( let row = 0; row < this.minions.length; row++)
            {
                for( let col = this.minions[row].length -1; col >= 0; col--)
                {  
                    for(let b = playerBullets.length -1 ; b >= 0; b--)
                    {
                        if(CollisionManager.SATCollision(playerBullets[b].getRect.getPoints(),this.minions[row][col].getRect.getPoints()))
                        {
                            AudioManager.getInstance().playSound(bulletExplosionSound);
                            this.minions[row][col].setHealth = -this.player.getWeapons()[w].getDamage();
                            if(this.minions[row][col].checkHealth())
                            {
                                this.animationManager.addAnimation(5,0.02,this.minions[row][col].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                                this.minions[row].splice(col,1);
                            }
                            //frames, transitiontime,pos,image,size,currentFrame,timer
                            this.animationManager.addAnimation(noOfFrames,0.02,playerBullets[b].getRect.getOrigin(),bulletExplosionAnimation,animationSize,false);
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
                for(let i = this.bombers.length -1; i >= 0; i--)
                {
                    if(CollisionManager.SATCollision(playerBullets[b].getRect.getPoints(), this.bombers[i].getRect.getPoints()))
                    {
                        //decrease bomber health  
                        AudioManager.getInstance().playSound(bulletExplosionSound); 
                        this.bombers[i].setHealth = -this.player.getWeapons()[w].getDamage();
                        if(this.bombers[i].checkHealth())
                        {
                            this.animationManager.addAnimation(5,0.02,this.bombers[i].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                            this.bombers.splice(i,1);
                        }
                        this.animationManager.addAnimation(noOfFrames,0.02,playerBullets[b].getRect.getOrigin(),bulletExplosionAnimation,animationSize,false);
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
                for(let i = this.asteroids.length -1; i >= 0; i--)
                {
                    if(CollisionManager.SATCollision(playerBullets[b].getRect.getPoints(), this.asteroids[i].getRect().getPoints()))
                    {
                        AudioManager.getInstance().playSound(bulletExplosionSound);
                        this.asteroids[i].setHealth(-this.player.getWeapons()[w].getDamage());
                        if(this.asteroids[i].checkHealth())
                        {
                            this.animationManager.addAnimation(5,0.02,this.asteroids[i].getRect().getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                            this.asteroids.splice(i,1);
                        }
                        this.animationManager.addAnimation(noOfFrames,0.02,playerBullets[b].getRect.getOrigin(),bulletExplosionAnimation,animationSize,false);
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
               
                if (time >= this.player.getWeapons()[w].getTTL())
                {
                    AudioManager.getInstance().playSound(bulletExplosionSound);
                    this.animationManager.addAnimation(noOfFrames,0.02,playerBullets[i].getRect.getOrigin(),bulletExplosionAnimation,animationSize,false);
                    playerBullets.splice(i,1);
                }
            }
        }
        /*  For all this.bombersthis._bullets/player collision */
        for(let i = this.bombers.length -1; i >= 0; i--)
        {
            for(let b = this.bombers[i]._bullets.length -1; b >= 0 ; b--)
            {
                if(CollisionManager.SATCollision(this.bombers[i]._bullets[b].getRect.getPoints(),this.player.getShape.getPoints()))
                {
                    this.gui.get("healthValue")[0].getRenderSize().x -= (this.gui.get("healthValue")[0].getSize().x/100) * Bomber.bulletDamage;
                    this.animationManager.addAnimation(5,0.02,this.bombers[i]._bullets[b].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                    this.bombers[i]._bullets.splice(b,1);
                    
                    this.player.setHealth = -Bomber.bulletDamage;
                    if(this.player.checkHealth())
                    {
                        this.NextScene();
                    }
        
                    //implode bomb
                    //delete bomb

                    //reduce player health
                }
            }
        }

        //  For all this.bombersthis._bullets check bullet ttl
        for(let i = 0; i < this.bombers.length; i++)
        {
            for(let b = this.bombers[i]._bullets.length -1; b >= 0; b--)
            {
                let  time = Math.round( ( performance.now() - this.bombers[i]._bullets[b].getTimer())/1000);
                if (time >= Bomber.ttl)
                {
                    //implode bomb
                    this.animationManager.addAnimation(5,0.02,this.bombers[i]._bullets[b].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                    this.bombers[i]._bullets.splice(b,1);
                }
            }
        }
    }

    turretCollisions()
    {
        if (this.player.getAutoTurret().getBullets().size == 0)
        {
            return;    
        }
        
        let turretBullets = this.player.getAutoTurret().getBullets();
        //turret bullets and minions
        for( let [key,value] of turretBullets.entries())
        {
            let  time = Math.round((performance.now() - value[0].getTimer())/1000);

            if (time >= this.player.getAutoTurret().getTTL())
            {
                this.animationManager.addAnimation(5,0.02,value[0].getRect.getOrigin(),"BULLET",new Vec2(256,256),false);    
                turretBullets.delete(key);
            }
        }

        for( let row = 0; row < this.minions.length; row++)
        {
            for( let col = this.minions[row].length -1; col >= 0; col--)
            {  
                for(let [target,bullet]  of turretBullets.entries())
                {
                    if(CollisionManager.SATCollision(bullet[0].getRect.getPoints(),this.minions[row][col].getRect.getPoints()))
                    {
                        this.minions[row][col].setHealth = -this.player.getAutoTurret().getBulletDamage();
                        this.animationManager.addAnimation(5,0.02,bullet[0].getRect.getOrigin(),"BULLET",new Vec2(256,256),false);
                        turretBullets.delete(target);
                         //if there's still a bullet targetting the minion(inaccurate collision/ remove that bullet)
                        if(turretBullets.keys(this.minions[row][col].getRect.getOrigin()) != undefined)
                        {
                            turretBullets.delete(this.minions[row][col].getRect.getOrigin());
                        }
                        if(this.minions[row][col].checkHealth())
                        {
                            this.animationManager.addAnimation(5,0.02,this.minions[row][col].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);                 
                            this.minions[row].splice(col,1);
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
            for(let i = this.bombers.length -1; i >= 0; i--)
            {
                if(CollisionManager.SATCollision(bullet[0].getRect.getPoints(), this.bombers[i].getRect.getPoints()))
                {
                    this.bombers[i].setHealth = -this.player.getAutoTurret().getBulletDamage();
                    this.animationManager.addAnimation(5,0.02,bullet[0].getRect.getOrigin(),"BULLET",new Vec2(256,256),false);
                    turretBullets.delete(target);  
                    if(turretBullets.keys(this.bombers[i].getRect.getOrigin()) != undefined)
                    {
                        turretBullets.delete(this.bombers[i].getRect.getOrigin());
                    }

                    if(this.bombers[i].checkHealth())
                    {
                        this.animationManager.addAnimation(5,0.02,this.bombers[i].getRect.getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                        this.bombers.splice(i,1);
                    }
                  
                    this.spawn();

                    if (turretBullets.size == 0)     
                        break;
                }
            }
        }

        for(let [target,bullet]  of turretBullets.entries())
        {
            for(let i = this.asteroids.length -1; i >= 0; i--)
            {
                if(CollisionManager.SATCollision(bullet[0].getRect.getPoints(), this.asteroids[i].getRect().getPoints()))
                {
                    this.asteroids[i].setHealth(-this.player.getAutoTurret().getBulletDamage());
                    this.animationManager.addAnimation(5,0.02,bullet[0].getRect.getOrigin(),"BULLET",new Vec2(256,256),false);
                    turretBullets.delete(target);  
                    if(turretBullets.keys(this.asteroids[i].getRect().getOrigin()) != undefined)
                    {
                        turretBullets.delete(this.asteroids[i].getRect().getOrigin());
                    }
                    if(this.asteroids[i].checkHealth())
                    {
                        this.animationManager.addAnimation(5,0.02,this.asteroids[i].getRect().getOrigin(),"EXPLOSION",new Vec2(256,256),false);
                        this.asteroids.splice(i,1);
                    }
                    if (turretBullets.size == 0)     
                        break;
                }
            }
        }


        //turret asteroid collision
    }

    draw()
    {
        this.camera.draw(GameScene._ctx);
        //qt.draw(GameScene._ctx,camera.getPos);
        /* Draw Black Holes */
        this.blackHoles.forEach( bh =>
        {
            bh.draw(GameScene._ctx,this.camera.getPos)
        });
        /* Draw Asteroids */
        this.asteroids.forEach( ast =>
        {
            ast.draw(GameScene._ctx,this.camera.getPos)
        });
        /* Draw Player Bullets */   
        for(let i = 0; i < this.player.getWeapons().length; i++)
        {
            this.player.getWeapons()[i].draw(GameScene._ctx,this.camera.getPos);
        }  
    
        /* Draw bombers and bomber Bullets*/
        for(let i =0; i < this.bombers.length; i ++)
        {
            this.bombers[i].draw(GameScene._ctx,this.camera.getPos);
            for(let b = 0; b < this.bombers[i]._bullets.length; b++)
            {
                this.bombers[i]._bullets[b].draw(GameScene._ctx,this.camera.getPos,Bomber.bomberBulletImage);
            } 
        };

        this.particleSystem.render(GameScene._ctx,this.camera.getPos);
        
        this.player.draw(GameScene._ctx,this.camera.getPos);

        this.player.getAutoTurret().getActive() && this.player.getAutoTurret().draw(GameScene._ctx,this.camera.getPos);

        /* Draw all minions*/
        this.minions.forEach(array => 
        {
            array.forEach(minion =>
            {
                minion.draw(GameScene._ctx,this.camera.getPos);
            }); 
        });

        this.powerUps.forEach( pu =>
        {
            pu.draw(GameScene._ctx,this.camera.getPos)
        });

        this.ammunition.forEach( a =>
        {
            if(a.getActive())
                a.draw(GameScene._ctx,this.camera.getPos)
        });
        
        for (let value of this.gui.values())
        {
            value.forEach(val=> 
            {
                if(val.getActive())
                    val.draw(GameScene._ctx, this.camera.getPos);
            });
        }
        
        this.map.drawMap(GameScene._ctx,this.camera.getPos);
        this.animationManager.draw(GameScene._ctx,this.camera.getPos);
        this.map.drawObjects(GameScene._ctx,this.camera.getPos,this.player.getSpriteAngle,this.player.getShape.getOrigin(),this.animationManager, this._canvasWidth, this._canvasHeight);

       
       GameScene._ctx.fillText('INF',((this.camera.getPos.x + this.camera.getSize.x/32) - this.camera.getPos.x),((this.camera.getPos.y + this.camera.getSize.y/1.043) - this.camera.getPos.y));
       GameScene._ctx.fillText(this.player.getWeapons()[1].getAmmoCount(),((this.camera.getPos.x + this.camera.getSize.x/10) - this.camera.getPos.x),((this.camera.getPos.y + this.camera.getSize.y/1.043) - this.camera.getPos.y));
       GameScene._ctx.fillText(this.player.getWeapons()[2].getAmmoCount(),((this.camera.getPos.x + this.camera.getSize.x/5.9) - this.camera.getPos.x),((this.camera.getPos.y + this.camera.getSize.y/1.043) - this.camera.getPos.y));
    
       GameScene._ctx.fillStyle = 'blue';
       GameScene._ctx.fillText(`fps : ${this.fps }`, (this.camera.getPos.x + 100) - this.camera.getPos.x,(this.camera.getPos.y + 50) - this.camera.getPos.y);
    }

    NextScene()
    {
        let gameOverScene = new GameOverScene(this.scenes);
        this.scenes.push(gameOverScene);
        this.scenes.shift();
    }
}