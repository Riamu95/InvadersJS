/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------Variables + objects ----------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
let player = new Player(WORLD_WIDTH/2,WORLD_HEIGHT/2,114,64,'red');
let bullets = new Array();
let enemies = new Array();
let minions = new Array();
let flockPoints = [];
let collisionManager = new CollisionManager();
let camera = new Camera(player.getPos.x - CANVAS_WIDTH/2,player.getPos.y - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);
let pressedKeys = new Set();

let dt = 0;
let lastRender = 0;
let fps = 0;
let qt = new QuadTree(new Vec2(0,0),new Vec2(WORLD_WIDTH,WORLD_HEIGHT), 5);

for(let i =0; i < ENEMY_COUNT; i++)
{
   let tempEnemy = new Enemy(Math.floor(Math.random() * WORLD_WIDTH),Math.floor(Math.random() * WORLD_HEIGHT), 102, 177 ,-1, -1);
   enemies.push(tempEnemy);
}
function getRandomInt(max)
{
    return Math.floor(Math.random() * max);
}

for(let row = 0; row < MINION_FLOCK_COUNT; row++)
{
    let tempMinions = [];
    let flockPoint = new Vec2(Math.random() * (WORLD_WIDTH - MINION_SPAWN_XOFFSET), Math.random() * (WORLD_HEIGHT - MINION_SPAWN_YOFFSET));

    for(let col = 0; col < MINION_COUNT; col++)
    {
       
        let tempMinion = new EnemyMinion(flockPoint.x + 50 * col, flockPoint.y + 10 * col, 39, 98 ,Math.random(1) + -1, Math.random(1) + -1);
       // let tempMinion = new EnemyMinion(player.getPos.x + 250 , player.getPos.y + 210, 39, 98 ,Math.random(1) + -1, Math.random(1) + -1);
        tempMinions.push(tempMinion);
    }
    minions.push(tempMinions);
    flockPoints.push(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT));
}

for(let row = 0; row < minions.length; row++ ) 
{
    for(let col = 0; col < minions[row].length; col++)
    {
       let result = qt.insert(minions[row][col].getRect);
       if(!result)
       {
        console.log(minions[row][col].getPos);
        console.log('failed');
       }
    }
}
ctx.font = "30px Arial";
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------------------------GAME LOOP -----------------------------------------------------------------------------------------------*/
/*------------------------------------------------------ -----------------------------------------------------------------------------------------------*/

addEventListener('click', (event) =>
{
    let tempBullet = new Bullet(new Vec2(player.getPos.x + player.getSize.x/2, player.getPos.y + player.getSize.y/2),5, Math.atan2((event.y - ((player.getPos.y + player.getSize.y/2) - camera.getPos.y)), (event.x - ((player.getPos.x + player.getSize.x/2) - camera.getPos.x))));
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
    fps = 1000/ dt;

    bullets.forEach(bullet => {
        bullet.move(dt);
    })
    
    enemies.forEach(enemy => 
    {
        enemy.move(dt,player.getPos,player.getSize);
    });

//for every array, allocate seek point and move the flock
   for( let row = 0; row < minions.length; row++)
   {
       EnemyMinion.generateFlockPoint(minions[row], player.getPos, flockPoints[row], dt);
   }
   

    collisions();
    inputHandling();
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(gameLoop);
}


function collisions()
{

    collisionManager.playerBoundaryCollision(player);

   // for all minions if attacking and collide with player, delete the minion
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
   for(let row = 0; row < minions.length; row++)
   {
       for(let col = 0; col < minions[row].length; col++)
       {  
       //quad tree detection
           if(CollisionManager.SATCollision(minions[row][col].getRect.getPoints(), player.getRect.getPoints()))
           {
               minions[row].splice(col,1);
               col--;
           }
       }
   }

     // change to quad tree ?
     loop1:
     for(let b = 0; b < bullets.length; b++)
     {
         loop2:
         for( let row = 0; row < minions.length; row++)
         {
             loop3:
             for( let col = 0; col < minions[row].length; col++)
             {   //pass the circle and rect object in
                 if(CollisionManager.CircleRectCollision(bullets[b], minions[row][col].getRect))
                 {
                     minions[row].splice(col,1);
                     col --;
                     
                     bullets.splice(b,1);
                     if(b == -1)
                     {
                         let i =0;
                     }
                     if(bullets.length > 0)
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
        camera.update(player.getPos); 
    }
    else if(pressedKeys['s'])
    {
        if(player.getAcceleration >= -player.getMaxAcceleration)
        {
            player.setAcceleration = -player.getAccelerationRate;
        }  
        player.move(dt); 
        camera.update(player.getPos);  
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
        camera.update(player.getPos);  
    }
    if(pressedKeys['d'])
    {
        player.setAngle = player.getRotationSpeed;
        player._rect._angle = player.getRotationSpeed;
        player._rect.rotate((Math.PI/180) * player._rect._angle, this._pos);
    }
    if(pressedKeys['a'])
    {
        player.setAngle = -player.getRotationSpeed;
        player._rect._angle = -player.getRotationSpeed;
        player._rect.rotate((Math.PI/180) * player._rect._angle, this._pos);
    }
}

function draw()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);

    camera.draw(ctx);
    qt.draw(ctx,camera.getPos);
    

    bullets.forEach(bullet => {
        bullet.draw(ctx,camera.getPos);
    }); 

    player.draw(ctx,camera.getPos);

    minions.forEach(array => 
    {
        array.forEach(minion =>
        {
            minion.draw(ctx,camera.getPos);
        }); 
    });

    enemies.forEach( enemy => {
        enemy.draw(ctx,camera.getPos);
        enemy._bullets.forEach(bullet => {
            bullet.draw(ctx,camera.getPos);
        });
    });
    
    if(player.getHealth > 0)
    {
        ctx.drawImage(hearth,0,0,HEARTH_SIZE.x,HEARTH_SIZE.y,(camera._pos.x + (camera._size.x * 0.75)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30)) - camera._pos.y,HEARTH_SIZE.x,HEARTH_SIZE.y);
        //heartBar
        ctx.drawImage(healthBar,0,0,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y,(camera._pos.x + (camera._size.x * 0.81)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30)) - camera._pos.y,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y);
        //heartValue
        //render width based off health
        ctx.drawImage(healthValue,0,0,HEALTHVALUE_SIZE.x,HEALTHVALUE_SIZE.y,(camera._pos.x + (camera._size.x * 0.81)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30.1)) - camera._pos.y,HEALTHVALUE_SIZE.x * player.getHealth,HEALTHVALUE_SIZE.y);
    }

    ctx.font = "30px Arial";
    ctx.fillStyle = 'blue';
    ctx.fillText(`fps : ${fps}`, (camera._pos.x + 100) - camera._pos.x,(camera._pos.y + 50) - camera._pos.y);
}
