
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------            CLASSES        ----------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/

class Camera
{
    constructor(x,y,width,height)
    {   
        this._pos = new Vec2(x,y);
        this._size= new Vec2(width,height);
        this._worldSize = new Vec2(WORLD_WIDTH,WORLD_HEIGHT);
    }

    update(playerPos,width,height)
     {
        
        this._pos.x = playerPos.x - CANVAS_WIDTH/2;
        this._pos.y = playerPos.y - CANVAS_HEIGHT/2;

        if(this._pos.x <= 0 ) 
        {
             this._pos.x = 0;
        }
        if( this._pos.x +  this._size.x >= this._worldSize.x)
        {
            this._pos.x = this._worldSize.x - this._size.x;
        }
        if(this._pos.y <= 0)
        {
            this._pos.y = 0;
        }
        if(this._pos.y  + this._size.y >= this._worldSize.y)
        {
            this._pos.y = this._worldSize.y - this._size.y;
        }
    }

    draw()
    {
        c.drawImage(background,this._pos.x,this._pos.y,this._size.x,this._size.y,0,0,this._size.x,this._size.y);
    }

    get getPos()
    {
        return this._pos;
    }
    get getSize()
    {
        return this._size;
    }
}

class Player {
    constructor(x, y, w ,h ,color)
    {
        this._pos = new Vec2(x,y);
        this._size = new Vec2(w,h);

        this._health = 1;

        this.m_speed = 0.1;
        this._velocity = new Vec2(0,0);
        this.m_deccelerationRate = 0.005;
        this.m_acceleration = 0;
        this.m_accelerationRate = 0.03;
        this.m_maxAcceleration = 5;
        
        this.m_angle = 0;
        this.m_rotationSpeed = 1.5;
        
        this.m_color = color;           
    }

    draw(cameraPos)
    {
        c.save();
        c.beginPath();      
        c.translate((this._pos.x + this._size.x/2) - cameraPos.x,(this._pos.y + this._size.y/2) - cameraPos.y);
        c.rotate(Math.PI/180 * this.m_angle);
        c.drawImage(playerIMG,0,0,this._size.x,this._size.y,-this._size.x/2,-this._size.y/2,this._size.x,this._size.y);
        c.fill();
        c.closePath();
        c.restore();
    }

    move(dt)
    {        
        this._velocity.x =  Math.cos(this.m_angle  * Math.PI / 180) * this.m_acceleration *this.m_speed * dt;
        this._velocity.y =  Math.sin(this.m_angle  * Math.PI / 180)* this.m_acceleration * this.m_speed * dt;
        this._pos.x += this._velocity.x;
        this._pos.y += this._velocity.y;      
    }

    get getPos()
    {
        return this._pos;
    }
    get getHealth()
    {
        return this._health;
    }
    get getSize()
    {
        return this._size;
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
    set setHealth(value)
    {
        this._health -= value;
    }
}

class CollisionManager {
    
    constructor(){}


    circleRectCollision(_a,_b)
    {
        if(_a.getPos.x  < _b.getPos.x &&
            _a.getPos.x  + _a.m_radius * 2 > _b.getPos.x &&
            _a.getPos.y  < _b.getPos.y  + _b.getSize.y &&
            _a.getPos.y  + _a.m_radius * 2 > _b.getPos.y)
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
        if(_object.getPos.x <= CANVAS_MIN)
        {
            _object._velocity.x = 0;
        }
        else if ( _object.getPos.x + player.getWidth >= CANVAS_WIDTH)
        {
            _object._velocity.x = 0
        
        }
        else if (_object.getPos.y < CANVAS_MIN)
        {
            _object._velocity.y = 0;
        }
        else if (_object.getPos.y + player.getHeight >= CANVAS_HEIGHT)
        {
            _object._velocity.y = 0;
        }
    }

    objectBoundaryCollision(_object)
    {
        if( _object.getPos.x <= CANVAS_MIN || _object.getPos.x >= CANVAS_WIDTH || _object.getPos.y <= CANVAS_MIN || _object.getPos.y >= CANVAS_HEIGHT)
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
    constructor(x,y,_angle)
    {
        this._pos = new Vec2(x,y);
        this.m_angle = _angle;
        this.m_radius = 5;
        this.m_color = 'Red';
        this._velocity = new Vec2(0,0);
    }

    move(dt)
    {
        this._velocity.x = Math.cos(this.m_angle) * dt;
        this._velocity.y = Math.sin(this.m_angle) * dt;
        this._pos.x += this._velocity.x;
        this._pos.y += this._velocity.y;
    }

    draw(cameraPos)
    {
        c.save();
        c.beginPath();
        c.translate(this._pos.x - cameraPos.x, this._pos.y - cameraPos.y);
        c.arc(0, 0, this.m_radius, 0, 2 * Math.PI);
        c.fillStyle = 'green';
        c.fill();
        c.closePath();
        c.restore();
    }

    get getVel()
    {
        return this._velocity;
    }

    get getPos()
    {
        return this._pos;
    }
}


class Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
     {
        this._pos = new Vec2(_x,_y);
        this._size = new Vec2(_width,_height);
      
        this._velocity = new Vec2(_xVel, _yVel);
        this.m_angle = 90;
        this.m_speed = 0.2;
        
        this._active = false;
        this._shoot = false;
        this._activateDistance = 750;
        this._activateshootingdistance = this._activateDistance/2;

        this._bullets = new Array();
        this._bulletTimer = 2000;
        this._timer = 0;
    }

    move (dt,playerPos,playerSize) 
    {
    
    }

    draw(cameraPos)
    {
        c.save();
        c.beginPath();
        c.translate((this._pos.x + this._size.x/2) - cameraPos.x,(this._pos.y + this._size.y/2) - cameraPos.y);
        c.rotate(Math.PI/180 * this.m_angle);
        c.drawImage(enemyOne,0,0,this._size.x,this._size.y,0,0,this._size.x,this._size.y);
        c.closePath();
        c.restore();
    }

    get getPos()
    {
        return this._pos;
    }
    get getVel()
    {
        return this._velocity;
    }
    get getSize()
    {
        return this._size;
    }
}

class EnemyMinion extends Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
    {
        super(_x, _y,_width, _height, _xVel,_yVel);
        console.log(_xVel,_yVel);
        this._alignmentDistance = 50;
        this._cohesionDistance = 450;
        this._seperationDistance = 90;
        this._acceleration = new Vec2(0,0);
        this._VelocityLength = 0;
        this._maxSpeed = 2;
        this._maxForce = 1;
        this._seperationWeight = 2;
        this._cohesionWieght = 1;
        this._alignmentWeight = 1;

        this._alignment = new Vec2(0,0);
        this._cohesion = new Vec2(0,0);
        this._seperation = new Vec2(0,0);
    }
    move(dt,playerPos,playerSize)
    {
        let distance = Vec2.distance(playerPos,this._pos);
        //if in chasing zone and not chasing
        if(distance < this._activateDistance && distance > 200 && !this._active)
        {
           this._active = true;
        } //if in shootinh zone and not shooting
        else if (distance < this._activateshootingdistance && distance > 200 && !this._shoot)
        {
            this._shoot = true;
        } // if outside chasing zone
        else if( distance > this._activateDistance && this._active || distance < 200 && this._active )
        {
            this._active = false;
        } // if outside shooting zone
        else if( distance > this._activateshootingdistance && this._shoot)
        {
            this._shoot = false;
        } //if to close to player, stop chasing
        else if( distance <= 200  && this._active)
        {
            //this._shoot = false;
            this._active = false;
        }

        // if chasing
        if(this._active)
        {
            //not calculating appropriate rotation angle 
           this.m_angle = Math.atan2(playerPos.y + playerSize.y/2 - (this._pos.y + this._size.y/2),playerPos.x + playerSize.x/2 - (this._pos.x + this._size.x/2));
           this._velocity.x = Math.cos(this.m_angle) * this.m_speed * dt;
           this._velocity.y = Math.sin(this.m_angle) * this.m_speed * dt;
           this._pos.x += this._velocity.x;
           this._pos.y += this._velocity.y;
            
          
        }
        //if shooting
        if(this._shoot)
        {
            this._timer += dt;
            if(this._timer >= this._bulletTimer)
            {
                let tempBullet = new Bullet(this._pos.x + this._size.x/2, this._pos.y + this._size.y/2, Math.atan2(playerPos.y - (this._pos.y + this._size.y/2),playerPos.x - (this._pos.x + this._size.x/2)));
                this._bullets.push(tempBullet);
                this._timer = 0;
             }
         }
    }


    flock(minions, dt)
    {     
        this._alignment = this.alignment(minions);
        this._cohesion = this.cohesion(minions);
        this._seperation = this.seperation(minions);

        this._acceleration.addVec = this._cohesion;
        this._acceleration.addVec = this._alignment;
        this._acceleration.addVec =  this._seperation;
      
       this._velocity.addVec = this._acceleration;
       
       this._velocity.x += this._velocity.x * dt;
       this._velocity.y += this._velocity.y * dt;

       this._velocity.setMagnitude = this._maxSpeed;

       this._pos.addVec = this._velocity;
       this._acceleration = new Vec2(0,0);
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
    }
}


class Vec2 
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
    get getVec2()
    {
        return this;
    }
    set addVec(vec)
    {
        this.x += vec.x;
        this.y += vec.y;
    }
    set div(value)
    {
        this.x /= value;
        this.y /= value;
    }
    set setMagnitude(value)
    {
        let mag = Vec2.length(this);
        this.x = this.x * value / mag;
        this.y = this.y * value / mag;
    }
    static subtractVec(one, two)
    {
        return new Vec2(one.x - two.x,one.y - two.y); 
    }

    static limit(vec,value)
    {
        let msq = vec.x * vec.x +  vec.y * vec.y;
    
        if(msq > value * value)
        {
            vec.div = Math.sqrt(msq);
            vec.x *= value;
            vec.y *= value;
        }
        return vec;
    }

    static length(vec)
    {
        let length = vec.x* vec.x + vec.y * vec.y;
        return Math.sqrt(length);
    }
    static distance(a, b)
    {
        let  distance = new Vec2(a.x - b.x , a.y - b.y);
        return  Vec2.length(distance);
    }
    static normalise(vec)
    {
        let len = this.length(vec);
        if( len > 0)
             vec = new Vec2(vec.x/len,vec.y/len);

        return vec;
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
const hearth = document.getElementById('heart');
const healthBar = document.getElementById('healthBar');
const healthValue = document.getElementById('healthValue');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WORLD_HEIGHT = 3376;
const WORLD_WIDTH = 6000;
const CANVAS_MIN = 0;
const ENEMY_COUNT = 5;
const MINION_COUNT = 5;

const HEARTH_POS = new Vec2(0,0);
const HEARTH_SIZE = new Vec2(100,100);

const HEALTHBAR_POS = new Vec2(0,0);
const HEALTHBAR_SIZE = new Vec2(300,100);

const HEALTHVALUE_POS = new Vec2(0,0);
const HEALTHVALUE_SIZE = new Vec2(296,96);


let player = new Player(WORLD_WIDTH/2,WORLD_HEIGHT/2,114,66,'red');
let bullets = new Array();
let enemies = new Array();
let minions = new Array();
let collisionManager = new CollisionManager();
let camera = new Camera(player.getPos.x - CANVAS_WIDTH/2,player.getPos.y - CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT);
let pressedKeys = new Set();
let minion = new EnemyMinion(player.getPos.x,player.getPos.y,53,100,-1,-1);
let dt = 0;
let lastRender = 0;


for(let i =0; i < ENEMY_COUNT; i++)
{
   let tempEnemy = new Enemy(Math.floor(Math.random() * WORLD_WIDTH),Math.floor(Math.random() * WORLD_HEIGHT), 102, 177 ,-1, -1);
   enemies.push(tempEnemy);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
for(let i =0; i < MINION_COUNT; i++)
{
   let tempMinion = new EnemyMinion(player.getPos.x + 150 * i, player.getPos.y + 10 * i, 102, 177 ,Math.random(1) + -1, Math.random(1) + -1);
   minions.push(tempMinion);
}

/*------------------------------------------------------- -----------------------------------------------------------------------------------------------*/
/*---------------------------------------------GAME LOOP -----------------------------------------------------------------------------------------------*/
/*------------------------------------------------------ -----------------------------------------------------------------------------------------------*/

addEventListener('click', (event) =>
{
    let tempBullet = new Bullet(player.getPos.x + player.getSize.x/2, player.getPos.y + player.getSize.y/2, Math.atan2((event.y - ((player.getPos.y + player.getSize.y/2) - camera.getPos.y)), (event.x - ((player.getPos.x + player.getSize.x/2) - camera.getPos.x))));
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
        enemy.move(dt,player.getPos,player.getSize);
    });
   
    minions.forEach(minion => 
    {
        //minion.move(dt,player.getPos,player.getSize);
        minion.flock(minions, dt);
    });

    for(let e = 0; e < minions.length; e++)
    {
        for(let b = 0; b < minions[e]._bullets.length; b++)
        {
            minions[e]._bullets[b].move(dt);
            if(collisionManager.circleRectCollision(minions[e]._bullets[b],player))
            {
                minions[e]._bullets.splice(b,1);
                b--;
                player.setHealth = 0.1;
            }
        }
    }

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
    if(player.getHealth > 0)
    {
        c.drawImage(hearth,0,0,HEARTH_SIZE.x,HEARTH_SIZE.y,(camera._pos.x + (camera._size.x * 0.75)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30)) - camera._pos.y,HEARTH_SIZE.x,HEARTH_SIZE.y);
        //heartBar
        c.drawImage(healthBar,0,0,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y,(camera._pos.x + (camera._size.x * 0.81)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30)) - camera._pos.y,HEALTHBAR_SIZE.x,HEALTHBAR_SIZE.y);
        //heartValue
        //render width based off health
        c.drawImage(healthValue,0,0,HEALTHVALUE_SIZE.x,HEALTHVALUE_SIZE.y,(camera._pos.x + (camera._size.x * 0.81)) - camera._pos.x,(camera._pos.y +  (camera._size.x / 30.1)) - camera._pos.y,HEALTHVALUE_SIZE.x * player.getHealth,HEALTHVALUE_SIZE.y);
    }
    player.draw(camera.getPos);

    bullets.forEach(bullet => {
        bullet.draw(camera.getPos);
    });  

    enemies.forEach( enemy => {
        enemy.draw(camera.getPos);
        enemy._bullets.forEach(bullet => {
            bullet.draw(camera.getPos);
        });
    });

    minions.forEach( minion => {
        minion.draw(camera.getPos);
        minion._bullets.forEach(bullet => {
            bullet.draw(camera.getPos);
        });
    });
}
