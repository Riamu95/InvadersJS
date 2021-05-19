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

addEventListener('click', (event) =>
{
    let tempBullet = new Bullet(new Vec2(player.getShape.getOrigin().x, player.getShape.getOrigin().y),new Vec2(90,17),
    Math.atan2((event.y - ((player.getShape.getPos().y + player.getShape.getSize().y/2) - camera.getPos.y)), (event.x - ((player.getShape.getPos().x + player.getShape.getSize().x/2) - camera.getPos.x))),player.getMaxBulletSpeed);
    bullets.push(tempBullet);
})

document.addEventListener('keydown', (event) =>
{
    pressedKeys[event.key] = true;
})

document.addEventListener('keyup', (event) =>
{
    pressedKeys[event.key] = false;
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
            bombers[i]._bullets[b].move(dt);
       } 
   }
   /* Black Holes update */
    blackHoles.forEach( bh =>
    {
        bh.update(dt);
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

   /*  Mininons and player */
   for(let row = 0; row < minions.length; row++)
   {
       for(let col = 0; col < minions[row].length; col++)
       {  
       //quad tree detection
           if(CollisionManager.SATCollision(minions[row][col]._rect.getPoints(), player._shape.getPoints()))
           {
               minions[row].splice(col,1);
               col--;
           }
       }
   }

   /*Player Bullet minions */
   loop1:
     for(let b = 0; b < bullets.length; b++)
     {
         loop2:
         for( let row = 0; row < minions.length; row++)
         {
             loop3:
             for( let col = 0; col < minions[row].length; col++)
             {   //pass the circle and rect object in
                 if(CollisionManager.SATCollision(bullets[b].getRect.getPoints(), minions[row][col].getRect.getPoints()))
                 {
                     minions[row].splice(col,1);
                     col --;
                     
                     bullets.splice(b,1);
                     if(b > 0)
                     {
                         b--;
                     }
                     else
                     {
                         break loop1;
                     }
                 }
             }
         }
     }

     /*collision between Player bullets and bomber. */
    for(let b = 0; b < bullets.length; b++)
    {
        for(let i = 0; i < bombers.length; i++)
        {
            if(CollisionManager.SATCollision(bullets[b].getRect.getPoints(), bombers[i].getRect.getPoints()))
            {
                //decrease bomber health
                bombers[i].setHealth = -10;
                if(bombers[i].getHealth <= 0)
                {
                    bombers.splice(i,1);
                    i--;
                }

                bullets.splice(b,1);
                b--;
                
                if (b < 0) 
                    break;      
            }
        }
    }

     /*collision between Player bullets and Asteroid. */
    for(let b = 0; b < bullets.length; b++)
    {
        for(let i = 0; i < asteroids.length; i++)
        {
            if(CollisionManager.SATCollision(bullets[b].getRect.getPoints(), asteroids[i].getRect().getPoints()))
            {
                //decrease bomber health
                asteroids[i].setHealth(-35);
                if(asteroids[i].getHealth() <= 0)
                {
                    asteroids.splice(i,1);
                    i--;
                }

                bullets.splice(b,1);
                b--;
                
                if (b < 0) 
                    break;      
            }
        }
    }

     /*  For all bombers bullets/player collision */
     for(let i = 0; i < bombers.length; i++)
    {
        for(let b = 0; b < bombers[i]._bullets.length; b++)
        {
            if(CollisionManager.SATCollision(bombers[i]._bullets[b].getRect.getPoints(),player.getShape.getPoints()))
            {
                bombers[i]._bullets.splice(b,1);
                b--;
                //implode bomb
                //delete bomb

                //reduce player health
            }
        }
    }

    /* Player Bomber */
    for( let b = 0; b < bombers.length; b++)
    {
        if(CollisionManager.SATCollision(bombers[b].getRect.getPoints(),player.getShape.getPoints()))
        {
            console.log('collision');
        }
    }

    /* Player Bullet timer Collision */
    for(let i = 0; i < bullets.length; i++)
    {
        let time = performance.now();
        time = time - bullets[i].getTTL();
        time /= 1000;
        time = Math.round(time);
       // console.log(time);
        if (time >= player.getTTL)
        {
            bullets.splice(i,1);
            i--;
        }
    }

    /*  For all bombers bullets check bullet ttl */
    for(let i = 0; i < bombers.length; i++)
    {
        for(let b = 0; b < bombers[i]._bullets.length; b++)
        {
            let time = performance.now();
            time = time -  bombers[i]._bullets[b].getTTL();
            time /= 1000;
            time = Math.round(time);
       
            if (time >= Bomber.ttl)
             {
                 //implode bomb
                bombers[i]._bullets.splice(b,1);
                b--;
            }
        }
    }

    /* Asteroid/Player Collision */
    for( let a = 0; a < asteroids.length; a++)
    {
        if(CollisionManager.SATCollision(asteroids[a].getRect().getPoints(),player.getShape.getPoints()))
        {
           animationManager.addAnimation(0,7,0.01,asteroids[a].getRect().getOrigin(),EXPLOSION_IMAGE,new Vec2(256,256));
           asteroids.splice(a,1);
           a--;
         //  startFrame,endFrame,transitionTime,pos,animate,image, width,height
        }
    }
}


function inputHandling()
{
    if(pressedKeys['w'])
    {
        if(player.getAcceleration <= player.getMaxAcceleration)
        {
            player.setAcceleration = player.getAccelerationRate;
        } 
        player.move(dt); 
        camera.update(player.getShape.getPos()); 
    }
    else if(pressedKeys['s'])
    {
        if(player.getAcceleration >= -player.getMaxAcceleration)
        {
            player.setAcceleration = -player.getAccelerationRate;
        }  
        player.move(dt); 
        camera.update(player.getShape.getPos());  
    }
    else if(!pressedKeys['w'] && !pressedKeys['s'])
    {
        if(player.getAcceleration > 0)
        {
            player.setAcceleration = -player.getDeccelerationRate;
        }
        else if(player.getAcceleration < 0)
        {
            player.setAcceleration = player.getDeccelerationRate;
        }
        player.move(dt); 
        camera.update(player.getShape.getPos());  
    }
    if(pressedKeys['d'])
    {
        player.setAngle = player.getRotationSpeed;
        player.getShape.setAngle(player.getRotationSpeed);
        player.getShape.rotate();
    }
    if(pressedKeys['a'])
    {
        player.setAngle = -player.getRotationSpeed;
        player.getShape.setAngle(-player.getRotationSpeed);
        player.getShape.rotate();
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
