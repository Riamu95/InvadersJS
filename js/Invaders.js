/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------Variables + objects ----------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
let bullets = [];
let enemies = [];
let minions = [];
let flockPoints = [];
let bombers = [];
let asteroids = [];
let blackHoles = [];
let pressedKeys = new Set();

let collisionManager = new CollisionManager();
let player = new Player(new Vec2(WORLD_WIDTH/2,WORLD_HEIGHT/2),new Vec2(127,130));
let camera = new Camera(player.getShape.getPos().x - CANVAS_WIDTH/2,player.getShape.getPos().y - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);
let qt = new QuadTree(new Vec2(0,0),new Vec2(WORLD_WIDTH,WORLD_HEIGHT), 5);
let animationManager = new AnimationManager();
let dt = 0;
let lastRender = 0;
let fps = 0;
ctx.font = "30px Arial";

init();


function init()
{   
    /* Create Black Holes*/
    for(let i = 0; i < BLACK_HOLE_COUNT; i++)
    {
        let  temp = new BlackHole(new Vec2(Math.random() * WORLD_WIDTH - 643, Math.random() * WORLD_HEIGHT - 480), new Vec2(643,480));
        blackHoles.push(temp);
    }
    /* Create Asteroids */
    for(let i = 0; i < ASTEROID_COUNT; i++)
    {
        let  temp = new Asteroid(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT), new Vec2(98,99));
        asteroids.push(temp);
    }
    /* Create Minions*/
    for(let row = 0; row < MINION_FLOCK_COUNT; row++)
    {
        let tempMinions = [];
        let flockPoint = new Vec2(Math.random() * (WORLD_WIDTH - MINION_SPAWN_XOFFSET), Math.random() * (WORLD_HEIGHT - MINION_SPAWN_YOFFSET));
        for(let col = 0; col < MINION_COUNT; col++)
        {
            let tempMinion = new EnemyMinion(new Vec2(flockPoint.x + 50 * col, flockPoint.y + 10 * col), new Vec2(90, 102) ,new Vec2(Math.random(1) + -1, Math.random(1) + -1));
            tempMinions.push(tempMinion);
        }
        minions.push(tempMinions);
        flockPoints.push(new Vec2(Math.random() * (WORLD_WIDTH - MINION_SPAWN_XOFFSET), Math.random() * (WORLD_HEIGHT - MINION_SPAWN_YOFFSET)));
    }
    /* Create bombers*/
    for(let i = 0; i < BOMBER_COUNT; i++)
    {
        let pos = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
        let flockPoint = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
        let tempBomber = new Bomber(pos, new Vec2(128,158), new Vec2(0,0),flockPoint);
        bombers.push(tempBomber);
    }
    /* Insert minions into quad tree */
    for(let row = 0; row < minions.length; row++ ) 
    {
        for(let col = 0; col < minions[row].length; col++)
        {
            qt.insert(minions[row][col].getRect);
        }
    }
}


/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------------------------GAME LOOP -----------------------------------------------------------------------------------------------*/
/*------------------------------------------------------ -----------------------------------------------------------------------------------------------*/
document.addEventListener('keydown', (event) =>
{ 
    if (event.key == 'w' || event.key == 'd' || event.key == 's' ||
        event.key == 'a' || event.key == ' ')
    {
        pressedKeys[event.key] = true;
        
       // event.key == ' ' && player.setFireTimer(performance.now()); 
    }
});

document.addEventListener('keyup', (event) =>
{
    if (event.key == 'w' || event.key == 'd' || event.key == 's' ||
    event.key == 'a' || event.key == ' ')
    {
        pressedKeys[event.key] = false;
    }
});

window.requestAnimationFrame(gameLoop);


function gameLoop(timestamp)
{
    dt = timestamp - lastRender;
    fps = 1000 / dt;
    /*Player bullets move */ 
    bullets.forEach(bullet =>
    {
        bullet.move(dt);
    })

    //for every array, allocate seek point and move the flock
   for( let row = 0; row < minions.length; row++)
   {
       EnemyMinion.generateFlockPoint(minions[row], player.getShape.getPos(), flockPoints[row], dt);
   }

   /* Bomber and bomber bullet MOVE */
   for(let i = 0; i < bombers.length; i++ )
   {
       bombers[i].move(dt,player.getShape.getOrigin());

       for(let b = 0; b < bombers[i]._bullets.length; b++)
       {
            bombers[i]._bullets[b].seek(dt,player.getShape.getOrigin());
       } 
   }
   /* Black Holes update */
    blackHoles.forEach( bh =>
    {
        bh.update(dt);
        let [force, teleport] = bh.attract(player.getShape.getOrigin(),player.getMass);
        if (!teleport)
        {
            player.getAcceleration.addVec = force;
        }
        else
        {
            player.getShape.setPos(force);
            player.setShapePosition();
        }
    });

    /*  Asteroids update */
    asteroids.forEach(ast =>
    {
        ast.update(dt);
    })

    
    inputHandling();
    draw();
    collisions();
    lastRender = timestamp;
    window.requestAnimationFrame(gameLoop);
}

function collisions()
{
    collisionManager.playerBoundaryCollision(player.getShape);
  
    objectCollisions();
    bulletCollisions();



   /* for all minions if attacking and collide with player, delete the minion*/
   /*let collidable = [];
   collidable = qt.query(player.getCollisionRect, collidable);
   for(let i =0; i < collidable.length; i++)
   {
        if(CollisionManager.SATCollision(collidable[i].getPoints(), player.getRect.getPoints()))
        {
            collidable.splice(i,1);
            i--;
        }
   }*/   
}

function objectCollisions()
{
    /*  Mininons and player */
   for(let row = 0; row < minions.length; row++)
   {
       for(let col = minions[row].length -1; col >= 0 ; col--)
       {  
       //quad tree detection
           if(CollisionManager.SATCollision(minions[row][col]._rect.getPoints(), player._shape.getPoints()))
           {
               animationManager.addAnimation(5,0.5,minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
               minions[row].splice(col,1);
           }
       }
   }
   /* Player Bomber */
   for( let b = 0; b < bombers.length; b++)
   {
       if(CollisionManager.SATCollision(bombers[b].getRect.getPoints(),player.getShape.getPoints()))
       {
           //MTV
           //Reduce player and bomber health
           //animation/particle affects
           //check if player and bomber are still alive
       }
   }
   
   //bombers andd minions
   for( let b = bombers.length -1; b >= 0; b--)
   {
       for (let row = minions.length -1; row >= 0; row --)
       {
           for(let col = minions[row].length -1; col >= 0; col --)
           {
               if(CollisionManager.SATCollision(bombers[b].getRect.getPoints(), minions[row][col].getRect.getPoints()))
               {
                   animationManager.addAnimation(5,0.5,minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                   minions[row].splice(col,1);

                   bombers[b].setHealth = -10;
                   bombers[b].getHealth <= 0 && bombers.splice(b,1);
                   //play explostion animation
               }
           }
       }
   }

   /* Asteroid/Player Collision */
   for( let a = asteroids.length - 1; a >= 0; a--)
   {
       if(CollisionManager.SATCollision(asteroids[a].getRect().getPoints(),player.getShape.getPoints()))
       {
          animationManager.addAnimation(5,0.5,asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
          asteroids.splice(a,1);
        //  startFrame,endFrame,transitionTime,pos,animate,image, width,height
       }
   }

   //Asteroids and bombers
  /* for( let b = bombers.length -1; b >= 0; b--)
   {
        for( let a = asteroids.length - 1; a >= 0; a--)
        {
            if(CollisionManager.SATCollision(asteroids[a].getRect().getPoints(),bombers[b].getRect.getPoints()))
            {
                //MTV 
                bombers[b].setHealth = -20;
                asteroids[a].setHealth(-20);
                //colliison animation/Particle affects.

                //checkif bomber or asteroid is still alive.
                //&& shorT cirucits upon first falsey value , so if there's still health, object is not deleted.
                //blow up animation?
               bombers[b].getHealth <= 0 && bombers.splice(b,1);
               asteroids[a].getHealth() <= 0 && bombers.splice(a,1);
            }
        }
   }*/

//Asteroids and minions
  for( let a = asteroids.length -1; a >= 0; a --)
  {
      for (let row = minions.length -1; row >= 0; row --)
      {
          for(let col = minions[row].length -1; col >= 0; col --)
          {
              if(CollisionManager.SATCollision(asteroids[a].getRect().getPoints(), minions[row][col].getRect.getPoints()))
              {
                  animationManager.addAnimation(5,0.5,minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                  minions[row].splice(col,1);

                  asteroids[a].setHealth(-10);
                  asteroids[a].getHealth() <= 0 && asteroids.splice(a,1);
                  //asteroid blow up animation
              }
          }
      }
  }

 // Asteroid on Asteroid 
  for(let a = 0; a < asteroids.length -1; a++)
  {
      for(let b = a + 1; b < asteroids.length; b++)
      {
        if (CollisionManager.SATCollision(asteroids[a].getRect().getPoints(),asteroids[b].getRect().getPoints()))
        {
            animationManager.addAnimation(5,0.5,asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
            animationManager.addAnimation(5,0.5,asteroids[b].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
            asteroids.splice(b,1);
            asteroids.splice(a,1);
            break;

        }
      }
  }

  //Bomber on Bomber 
  for(let a = 0; a < bombers.length -1; a++)
  {
      for(let b = a + 1; b < bombers.length; b++)
      {
        if (CollisionManager.SATCollision(bombers[a].getRect.getPoints(),bombers[b].getRect.getPoints()))
        {
                //MTV
        }
      }
  }

}

function bulletCollisions()
{
    /* Minion Player bullet collision */
    for( let row = 0; row < minions.length; row++)
    {
        for( let col = minions[row].length -1; col >= 0; col--)
        {  
            for(let b =  bullets.length -1 ; b >= 0; b--)
            {
                if(CollisionManager.SATCollision(bullets[b].getRect.getPoints(), minions[row][col].getRect.getPoints()))
                {
                    animationManager.addAnimation(5,0.5,minions[row][col].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    minions[row].splice(col,1);
            
                    animationManager.addAnimation(5,0.5,bullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                    bullets.splice(b,1);
                    
                    if (bullets.length > 0)
                            break;
                }
            }
        }
    }
    /*collision between Player bullets and bomber. */
    for(let b =  bullets.length -1; b >= 0; b--)
    {
        for(let i = bombers.length -1; i >= 0; i--)
        {
            if(CollisionManager.SATCollision(bullets[b].getRect.getPoints(), bombers[i].getRect.getPoints()))
            {
                //decrease bomber health   
                bombers[i].setHealth = -10;
                if(bombers[i].getHealth <= 0)
                {
                    animationManager.addAnimation(5,0.5,bombers[i].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    bombers.splice(i,1);
                }
                animationManager.addAnimation(5,0.5,bullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                bullets.splice(b,1);  

                if (bullets.length == 0 || b >= bullets.length)     
                    break;
            }
        }
    }
    /*collision between Player bullets and Asteroid. */
    for(let b = bullets.length -1; b >= 0; b--)
    {
        for(let i = asteroids.length -1; i >= 0; i--)
        {
            if(CollisionManager.SATCollision(bullets[b].getRect.getPoints(), asteroids[i].getRect().getPoints()))
            {
                //decrease bomber health
                asteroids[i].setHealth(-35);
                if(asteroids[i].getHealth() <= 0)
                {
                    animationManager.addAnimation(5,0.5,asteroids[i].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                    asteroids.splice(i,1);
                }
                animationManager.addAnimation(5,0.5,bullets[b].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
                bullets.splice(b,1);
                
                if (bullets.length == 0 || b >= bullets.length)     
                        break;   
            }
        }
    }
    /*  For all bombers bullets/player collision */
    for(let i = bombers.length -1; i >= 0; i--)
    {
        for(let b = bombers[i]._bullets.length -1; b >= 0 ; b--)
        {
            if(CollisionManager.SATCollision(bombers[i]._bullets[b].getRect.getPoints(),player.getShape.getPoints()))
            {
                animationManager.addAnimation(5,0.5,bombers[i]._bullets[b].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                bombers[i]._bullets.splice(b,1);
                //implode bomb
                //delete bomb

                //reduce player health
            }
        }
    }
    /* Player Bullet timer Collision */
    for(let i = bullets.length -1 ; i >= 0; i--)
    {
        let time = performance.now();
        time = time - bullets[i].getTTL();
        time /= 1000;
        time = Math.round(time);
        if (time >= player.getTTL)
        {
            animationManager.addAnimation(5,0.5,bullets[i].getRect.getOrigin(),BULLET_EXPLOSION_IMAGE,new Vec2(256,256));
            bullets.splice(i,1);
        }
    }

    /*  For all bombers bullets check bullet ttl */
    for(let i = 0; i < bombers.length; i++)
    {
        for(let b = bombers[i]._bullets.length -1; b >= 0; b--)
        {
            let time = performance.now();
            time = time -  bombers[i]._bullets[b].getTTL();
            time /= 1000;
            time = Math.round(time);
       
            if (time >= Bomber.ttl)
             {
                 //implode bomb
                animationManager.addAnimation(5,0.5,bombers[i]._bullets[b].getRect.getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
                bombers[i]._bullets.splice(b,1);
            }
        }
    }
}

function inputHandling()
{
   if(pressedKeys['w'])
    {
        if(player.getSpeed() <= player.getMaxAcceleration)
        {
            player.addSpeed(player.getAccelerationRate);
        } 
        player.move(dt); 
        camera.update(player.getShape.getPos()); 
    }
    else if(pressedKeys['s'])
    {
        if(player.getSpeed() >= -player.getMaxAcceleration)
        {
            player.addSpeed(-player.getAccelerationRate);
        }  
        player.move(dt); 
        camera.update(player.getShape.getPos());  
    }
    else if(!pressedKeys['w'] && !pressedKeys['s'])
    {
        if(player.getSpeed() > 0)
        {
            player.addSpeed(-player.getDeccelerationRate);
        }
        else if(player.getSpeed() < 0)
        {
            player.addSpeed(player.getDeccelerationRate);
        }
       
        player.move(dt); 
        camera.update(player.getShape.getPos());  
    }
    if(pressedKeys['d'])
    {
        player.setSpriteAngle = player.getRotationSpeed;
        player.getShape.setAngle(player.getRotationSpeed);
        player.getShape.rotate();
    }
    if(pressedKeys['a'])
    {
        player.setSpriteAngle = -player.getRotationSpeed;
        player.getShape.setAngle(-player.getRotationSpeed);
        player.getShape.rotate();
    }

    if(pressedKeys[' '] && Math.round((performance.now() - player.getFireTimer) /1000) > player.getFireRate)
    {
        let tempBullet = new Bullet(new Vec2(player.getShape.getOrigin().x, player.getShape.getOrigin().y),new Vec2(30,30),
        player.getSpriteAngle * Math.PI/180,player.getMaxBulletSpeed);
        bullets.push(tempBullet);
        player.setFireTimer(performance.now());
    }
}



function draw()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    camera.draw(ctx);
    qt.draw(ctx,camera.getPos);
    /* Draw Black Holes */

    blackHoles.forEach( bh =>
    {
        bh.draw(ctx,camera.getPos)
    });
     /* Draw Asteroids */
    asteroids.forEach( ast =>
    {
        ast.draw(ctx,camera.getPos)
    });
     /* Draw Player Bullets */
    bullets.forEach(bullet =>
    {
        bullet.draw(ctx,camera.getPos,PLAYER_BULLET_IMAGE);
    }); 
    /* Draw bombers and bomber Bullets*/
   for(let i =0; i < bombers.length; i ++)
   {
        bombers[i].draw(ctx,camera.getPos,BOMBER_IMAGE);
        for(let b = 0; b < bombers[i]._bullets.length; b++)
        {
             bombers[i]._bullets[b].draw(ctx,camera.getPos,BOMBER_BULLET_IMAGE);
        } 
    };

    player.draw(ctx,camera.getPos);
    /* Draw all minions*/
    minions.forEach(array => 
    {
        array.forEach(minion =>
        {
            minion.draw(ctx,camera.getPos);
        }); 
    });
    /*Scale health bar */
    if(player.getHealth > 0)
    {
        ctx.drawImage(hearth,0,0,HEARTH_SIZE.x,HEARTH_SIZE.y,(camera._pos.x + (camera._size.x * 0.75)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30)) - camera._pos.y,HEARTH_SIZE.x,HEARTH_SIZE.y);
        //heartBar
        ctx.drawImage(healthBar,0,0,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y,(camera._pos.x + (camera._size.x * 0.81)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30)) - camera._pos.y,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y);
        //heartValue
        //render width based off health
        ctx.drawImage(healthValue,0,0,HEALTHVALUE_SIZE.x,HEALTHVALUE_SIZE.y,(camera._pos.x + (camera._size.x * 0.81)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30.1)) - camera._pos.y,HEALTHVALUE_SIZE.x * player.getHealth,HEALTHVALUE_SIZE.y);
    }
    ctx.fillStyle = 'blue';
    ctx.fillText(`fps : ${fps}`, (camera._pos.x + 100) - camera._pos.x,(camera._pos.y + 50) - camera._pos.y);
    animationManager.draw(ctx,camera.getPos);
   
}
