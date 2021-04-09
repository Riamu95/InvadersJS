const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const background = document.querySelector('img');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WORLD_HEIGHT = 3376;
const WORLD_WIDTH = 6000;
const CANVAS_MIN = 0;
const ENEMY_COUNT = 5;


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
}

class Player {
    constructor(x, y, w ,h ,color)
    {
        this.m_xPos = x;
        this.m_yPos = y;
        this.m_width = w;
        this.m_height =  h;
        this.m_speed = 10;
        this.m_xVelocity = 0;
        this.m_yVelocity = 0;
        this.m_angle = 0;
        this.m_color = color;           
    }

    draw(cameraX,cameraY)
    {
        c.save();
        c.beginPath();      
        c.translate((this.m_xPos + this.m_width/2) - cameraX,(this.m_yPos + this.m_height/2) - cameraY);
        c.rotate(Math.PI/180 * this.m_angle);
        c.moveTo(this.m_width/2, 0);
        c.lineTo(-this.m_width, this.m_height/2);
        c.lineTo(-this.m_width, -this.m_height/2);
        c.fillStyle = "yellow";
        c.fill();
        c.closePath();
        c.restore();
    }

    move(dt, forward)
    {        
        //accepts radians to convert degrees to radians multiply angle by pi and divide by 180
        if(forward)
        {
           this.m_speed = 10;
        }
        else
        {
            this.m_speed = -10;
        }


        this.m_xVelocity =  Math.cos(this.m_angle  * Math.PI / 180) * this.m_speed * dt;
        this.m_yVelocity =  Math.sin(this.m_angle  * Math.PI / 180)* this.m_speed * dt;
        this.m_xPos += this.m_xVelocity;
        this.m_yPos += this.m_yVelocity;      
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
        if(_object.m_xPos <= CANVAS_MIN)
        {
            _object.m_xVelocity = 0;
        }
        else if ( _object.m_xPos + player.m_width >= CANVAS_WIDTH)
        {
            _object.m_xVelocity = 0
        
        }
        else if (_object.m_yPos < CANVAS_MIN)
        {
            _object.m_yVelocity = 0;
        }
        else if (_object.m_yPos + player.m_height >= CANVAS_HEIGHT)
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

    move (dt) 
    {

    }

    draw(cameraX,cameraY)
    {
        c.beginPath();
        c.fillRect(this.m_x - cameraX, this.m_y - cameraY, this.m_width, this.m_height);
        c.fillStyle = 'red';
        c.closePath();
    

    }
}

let player = new Player(WORLD_WIDTH/2,WORLD_HEIGHT/2,100,100,'red');
let bullets = new Array();
let enemies = new Array();
let collisionManager = new CollisionManager();
let camera = new Camera(player.m_xPos - CANVAS_WIDTH/2,player.m_yPos - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);

let dt = 0;
let lastRender = 0;


for(let i =0; i < ENEMY_COUNT; i++)
{
   let tempEnemy = new Enemy(Math.floor(Math.random() * WORLD_WIDTH),Math.floor(Math.random() * WORLD_HEIGHT), 15, 15 ,-1, -1);
   enemies.push(tempEnemy);
}




addEventListener('click', (event) =>
{
    let tempBullet = new Bullet(player.m_xPos + player.m_width/2, player.m_yPos + player.m_height/2, Math.atan2((event.y - ((player.m_yPos + player.m_height/2) - camera.m_y)), (event.x - ((player.m_xPos + player.m_width/2) - camera.m_x))));
    bullets.push(tempBullet);
})


addEventListener('keydown', (event) =>
{
   if (event.key == 'w')
   {    
       player.move(dt,true); 
       camera.update(player.m_xPos,player.m_yPos);                    
   }
   else if(event.key == 's')
   {
       //moves player in reverse based off rotationa
       // player.m_yVelocity = 0.5;
        player.move(dt,false); 
        camera.update(player.m_xPos,player.m_yPos);     
   }
   else if(event.key == 'd')
   {
       //rotates player right
        player.m_angle += 3;
   }
   else if(event.key == 'a')
   {
        //rotates player left
        player.m_angle -= 3;
   }
})


addEventListener('keyup', (event) =>
{

   if (event.key == 'w' || event.key == "s")
   {
        player.m_yVelocity = 0; 
         
   }
   else if(event.key == 'a' || event.key == "d")
   {
        player.m_xVelocity = 0; 
   }
})


function draw()
{
    c.clearRect(0,0,canvas.width,canvas.height);
    camera.draw();
   
    player.draw(camera.m_x, camera.m_y);

    bullets.forEach(bullet => {
        bullet.draw(camera.m_x,camera.m_y);
    });  

    enemies.forEach( enemy => {
        enemy.draw(camera.m_x,camera.m_y);
    })  
}



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

   /* for( let i = 0; i < bullets.length; i++)
    {
        if(collisionManager.objectBoundaryCollision(bullets[i]))
        {
            bullets.splice(i,1);
           i--;
        }
    }*/

     
    draw();
    
    lastRender = timestamp;
    window.requestAnimationFrame(gameLoop);

}

window.requestAnimationFrame(gameLoop);