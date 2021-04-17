
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------            CLASSES        ----------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/

class Camera
{
    constructor(x,y,width,height)
    {   
        this.m_x = x;
        this.m_y = y;
        this.m_width = width;
        this.m_height = height;
        this.m_worldHeight = WORLD_HEIGHT;
        this.m_worldWidth = WORLD_WIDTH;
    }

    update(x,y,width,height)
     {
        
        this.m_x = x - CANVAS_WIDTH/2;
        this.m_y = y - CANVAS_HEIGHT/2;

        if(this.m_x <= 0 ) 
        {
             this.m_x = 0;
        }
        if( this.m_x +  this.m_width >= WORLD_WIDTH )
        {
            this.m_x = WORLD_WIDTH - this.m_width;
        }
        if(this.m_y <= 0)
        {
            this.m_y = 0;
        }
        if(this.m_y  + this.m_height >= WORLD_HEIGHT)
        {
            this.m_y = WORLD_HEIGHT - this.m_height;
        }
    }

    draw()
    {
        c.drawImage(background,this.m_x,this.m_y,this.m_width,this.m_height,0,0,this.m_width,this.m_height);
    }

    get getX()
    {
        return this.m_x;
    }
    get getY()
    {
        return this.m_y;
    }

}

class Player {
    constructor(x, y, w ,h ,color)
    {
        this.m_xPos = x;
        this.m_yPos = y;
        this.m_width = w;
        this.m_height =  h;
        this.m_speed = 0.1;
        this.m_xVelocity = 0;
        this.m_yVelocity = 0;
        this.m_deccelerationRate = 0.005;
        this.m_acceleration = 0;
        this.m_accelerationRate = 0.03;
        this.m_maxAcceleration = 5;
        this.m_angle = 0;
        this.m_rotationSpeed = 1.5;
        this.m_color = color;           
    }

    draw(cameraX,cameraY)
    {
        c.save();
        c.beginPath();      
        c.translate((this.m_xPos + this.m_width/2) - cameraX,(this.m_yPos + this.m_height/2) - cameraY);
        c.rotate(Math.PI/180 * this.m_angle);
        c.drawImage(playerIMG,0,0,this.m_width,this.m_height,-this.m_width/2,-this.m_height/2,this.m_width,this.m_height);
        c.fill();
        c.closePath();
        c.restore();
    }

    move(dt)
    {        
        this.m_xVelocity =  Math.cos(this.m_angle  * Math.PI / 180) * this.m_acceleration *this.m_speed * dt;
        this.m_yVelocity =  Math.sin(this.m_angle  * Math.PI / 180)* this.m_acceleration * this.m_speed * dt;
        this.m_xPos += this.m_xVelocity;
        this.m_yPos += this.m_yVelocity;      
    }

    get getXPos()
    {
        return this.m_xPos;
    }
    get getYPos()
    {
        return this.m_yPos;
    }
    get getWidth()
    {
        return this.m_width;
    }
    get getHeight()
    {
        return this.m_height;
    }
    get getDeccelerationRate()
    {
        return this.m_deccelerationRate;
    }
    get getAcceleration()
    {
        return this.m_acceleration;
    }
    get getAccelerationRate()
    {
        return this.m_accelerationRate;
    }
    get getMaxAcceleration()
    {
        return this.m_maxAcceleration;
    }
    get getAngle()
    {
        return this.m_angle;
    }
    get getRotationSpeed()
    {
        return this.m_rotationSpeed;
    }
    set setAngle(_angle)
    {
        this.m_angle += _angle;
    }
    set setAcceleration(_accel)
    {
        this.m_acceleration += _accel;
    }
}

class CollisionManager {
    
    constructor(){}


    circleRectCollision(_a,_b)
    {
        if(_a.m_x  < _b.m_x &&
            _a.m_x  + _a.m_radius * 2 > _b.m_x &&
            _a.m_y  < _b.m_y  + _b.m_height &&
            _a.m_y  + _a.m_radius * 2 > _b.m_y)
        {
           return true;
        }
        else
        {
            return false;
        }
    }  

    playerBoundaryCollision(_object)
    {
        if(_object.getXPos <= CANVAS_MIN)
        {
            _object.m_xVelocity = 0;
        }
        else if ( _object.getXPos + player.getWidth >= CANVAS_WIDTH)
        {
            _object.m_xVelocity = 0
        
        }
        else if (_object.getYPos < CANVAS_MIN)
        {
            _object.m_yVelocity = 0;
        }
        else if (_object.getYPos + player.getHeight >= CANVAS_HEIGHT)
        {
            _object.m_yVelocity = 0;
        }
    }

    objectBoundaryCollision(_object)
    {
        if( _object.m_x <= CANVAS_MIN || _object.m_x >= CANVAS_WIDTH || _object.m_y <= CANVAS_MIN || _object.m_y >= CANVAS_HEIGHT)
        {
            return true;
          
        }
        else 
        {
            return false;
        }
    }
}


class Bullet {
    constructor(_x,_y,_angle)
    {
        this.m_x = _x;
        this.m_y = _y;
        this.m_angle = _angle;
        this.m_radius = 5;
        this.m_color = 'Red';
        this.m_xVelocity = 0;
        this.m_yVelocity = 0;  
    }

    move(dt)
    {
        this.m_xVelocity = Math.cos(this.m_angle) * dt;
        this.m_yVelocity = Math.sin(this.m_angle) * dt;
        this.m_x += this.m_xVelocity;
        this.m_y += this.m_yVelocity;
    }

    draw(cameraX,cameraY)
    {
        c.save();
        c.beginPath();
        c.translate(this.m_x - cameraX, this.m_y - cameraY);
        c.arc(0, 0, this.m_radius, 0, 2 * Math.PI);
        c.fillStyle = 'green';
        c.fill();
        c.closePath();
        c.restore();
    }
}


class Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
     {
        this.m_x = _x;
        this.m_y = _y;
        this.m_width = _width;
        this.m_height = _height;
        this.m_xVelocity = _xVel;
        this.m_yVelocity = _yVel;


    }

    move (dt, playerX, playerY) 
    {
        let xdist = playerX - this.m_x;
        let ydist = playerY - this.m_y;

        xdist = xdist * xdist;
        ydist = ydist * ydist;

        let distance = xdist + ydist;
        distance = Math.sqrt(distance);

        if(distance < 500)
        {
            console.log("hiiiii");
        }
    }

    draw(cameraX,cameraY)
    {
        c.beginPath();
        c.drawImage(enemyOne,0,0,this.m_width,this.m_height,this.m_x - cameraX,this.m_y - cameraY,this.m_width,this.m_height);
        c.closePath();
    }
}

class EnemyMinion extends Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
    {
        super(_x, _y,_width, _height, _xVel, _yVel);

    }
    move()
    {

    }
    draw(cameraX,cameraY)
    {
        c.beginPath();
        c.drawImage(enemyMinionImage,0,0,this.m_width,this.m_height,this.m_x - cameraX,this.m_y - cameraY,this.m_width,this.m_height);
        c.closePath();
    }
}

/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------Variables + objects ----------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const background = document.getElementById('background');
const playerIMG = document.getElementById('player');
const enemyOne = document.getElementById('enemyOne');
const enemyMinionImage = document.getElementById('enemyMinion');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WORLD_HEIGHT = 3376;
const WORLD_WIDTH = 6000;
const CANVAS_MIN = 0;
const ENEMY_COUNT = 5;

let player = new Player(WORLD_WIDTH/2,WORLD_HEIGHT/2,114,66,'red');
let bullets = new Array();
let enemies = new Array();
let collisionManager = new CollisionManager();
let camera = new Camera(player.getXPos - CANVAS_WIDTH/2,player.getYPos - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);
let pressedKeys = new Set();
let minion = new EnemyMinion(player.getXPos,player.getYPos,53,100,-1,-1);
let dt = 0;
let lastRender = 0;

for(let i =0; i < ENEMY_COUNT; i++)
{
   let tempEnemy = new Enemy(Math.floor(Math.random() * WORLD_WIDTH),Math.floor(Math.random() * WORLD_HEIGHT), 102, 177 ,-1, -1);
   enemies.push(tempEnemy);
}

/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------------------------GAME LOOP -----------------------------------------------------------------------------------------------*/
/*------------------------------------------------------ -----------------------------------------------------------------------------------------------*/

addEventListener('click', (event) =>
{
    let tempBullet = new Bullet(player.getXPos + player.getWidth/2, player.getYPos + player.getHeight/2, Math.atan2((event.y - ((player.getYPos + player.getHeight/2) - camera.getY)), (event.x - ((player.getXPos + player.getWidth/2) - camera.getX))));
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
    dt = timestamp  - lastRender;
    
    bullets.forEach(bullet => {
        bullet.move(dt);
    })
   
    collisionManager.playerBoundaryCollision(player);

    for(let b = 0; b < bullets.length; b++)
    {
        for(let e =0; e < enemies.length; e++)
        {
            if( bullets.length > 0)
            {
                if(collisionManager.circleRectCollision(bullets[b],enemies[e]) == true)
                {
                    enemies.splice(e,1);
                    e--;
                    /* problem occurs when there is more than one bullet, it enters the sequence when b = -1 as its not incremented due to it being on the outer loop.
                     Could also just break here. less efficient? but may avoid future bugs?                                         */
                    bullets.splice(b,1);
                    if( b > 0)
                    {
                        b--;
                    }  
                }
            }
        }
    }
    enemies.forEach(enemy => 
    {
        enemy.move(dt, player.getXPos, player.getYPos);
    });

    inputHandling();
    draw();
    
    lastRender = timestamp;
    window.requestAnimationFrame(gameLoop);
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
        camera.update(player.getXPos,player.getYPos); 
    }
    else if(pressedKeys['s'])
    {
        if(player.getAcceleration >= -player.getMaxAcceleration)
        {
            player.setAcceleration = -player.getAccelerationRate;
        }  
        player.move(dt); 
        camera.update(player.getXPos,player.getYPos);  
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
        camera.update(player.getXPos,player.getYPos);  
    }
    if(pressedKeys['d'])
    {
        player.setAngle = player.getRotationSpeed;
    }
    if(pressedKeys['a'])
    {
        player.setAngle = -player.getRotationSpeed;
    }
}

function draw()
{
    c.clearRect(0,0,canvas.width,canvas.height);
    camera.draw();
   
    player.draw(camera.getX, camera.getY);

    bullets.forEach(bullet => {
        bullet.draw(camera.getX,camera.getY);
    });  

    enemies.forEach( enemy => {
        enemy.draw(camera.getX,camera.getY);
    })
    minion.draw(camera.getX,camera.getY);
}
