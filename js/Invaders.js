
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
        this._rect = new Rect(this._pos, this._size);
        
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

        this._rect.draw(cameraPos, this.m_color);
    }

    move(dt)
    {        
        this._velocity.x =  Math.cos(this.m_angle  * Math.PI / 180) * this.m_acceleration *this.m_speed * dt;
        this._velocity.y =  Math.sin(this.m_angle  * Math.PI / 180)* this.m_acceleration * this.m_speed * dt;
        this._pos.x += this._velocity.x;
        this._pos.y += this._velocity.y; 
        this._rect.updatePoints(this._velocity); 
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
    get getRect()
    {
        return this._rect;
    }
}

class CollisionManager {
    
    constructor(){}

    RectCollision(_a,_b)
    {
        if(_a.getPos.x  < _b.getPos.x &&
            _a.getPos.x  + _a.getSize.x > _b.getPos.x &&
            _a.getPos.y  < _b.getPos.y  + _b.getSize.y &&
            _a.getPos.y  + _a.getSize.y > _b.getPos.y)
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

    static SATCollision(obejct1, object2)
    {
        let objOne = obejct1;
        let objTwo = object2;

        for(let i = 0 ; i < 2; i++)
        {
         //swap objects
            if(i == 1)
            {
                //refference error here 
                objOne = object2;
                objTwo = obejct1;
            }
            // for each edge of object
            for(let a = 0; a < objOne.length; a++)
            {
                //get index ahead of current index, including 0 wrap around
                let b = (a+1) % objOne.length;
                //get the distance and direction vector of point a - b
                let edgeVector = new Vec2(objOne[b].x - objOne[a].x, objOne[b].y - objOne[a].y);
                //get the normal to the edge
                let projectedAxis = new Vec2(-edgeVector.y,edgeVector.x);
                //min and max values for objects
                let min_o1 = Infinity;
                let max_o1 = -Infinity;
                let min_o2 = Infinity;
                let max_o2 = -Infinity;
                //for all objOne points get the scaled min and max points along the projected axis
                for(let p = 0; p < objOne.length; p++)
                {
                    let point = Vec2.dotProduct(objOne[p], projectedAxis);
                    min_o1 = Math.min(min_o1,point);
                    max_o1 = Math.max(max_o1,point);
                }
                //repeat above for the second object
                for(let p = 0; p < objTwo.length; p++)
                {
                    let point = Vec2.dotProduct(objTwo[p], projectedAxis);
                    min_o2 = Math.min(min_o2,point);
                    max_o2 = Math.max(max_o2,point);
                }
                //check for overlap, if they dont overlap return flase, otherwise continue
                if(!(max_o2 > min_o1 && max_o1 > min_o2))
                    return false;
            }
        }
        return true;
    }

    static CircleRectCollision(obj1, obj2)
    {
        // o1 = circle , 02 = rect  obj
        let circlePos = new Vec2(obj1.getCircle.getPos().x,obj1.getCircle.getPos().y);
        let test = new Vec2(circlePos.x,circlePos.y);
        let circleRadius = obj1.getCircle.getRadius();

        let rectPoints = obj2.getPoints();
       
        //check for closest edge
        if(circlePos.x < rectPoints[0].x)
        {
            test.x = rectPoints[0].x;
        }
        else if (circlePos.x > rectPoints[1].x)
        {
            test.x = rectPoints[1].x;
        }

        if(circlePos.y < rectPoints[0].y)
        {
            test.y = rectPoints[0].y;
        }
        else if (circlePos.y  > rectPoints[2].y)
        {
            test.y = rectPoints[2].y;
        }
        //get distance between edge point and circle pos
        let dist = Vec2.distance(circlePos,test);
        //if lesser than the radius, collision = true
        if(dist <= circleRadius)
        {
            return true;
        }
        return false;
    }
}


class Bullet {
    constructor(pos,radius,_angle)
    {
        this._circle = new Circle(pos, radius);
        this.m_angle = _angle;
        this._color = 'Red';
        this._velocity = new Vec2(0,0);
    }

    move(dt)
    {
        this._velocity.x = Math.cos(this.m_angle) * dt;
        this._velocity.y = Math.sin(this.m_angle) * dt;
        this._circle._pos.x += this._velocity.x;
        this._circle._pos.y += this._velocity.y;
    }

    draw(cameraPos)
    {
        c.save();
        c.beginPath();
        c.translate(this._circle._pos.x - cameraPos.x, this._circle._pos.y - cameraPos.y);
        c.arc(0, 0, this._circle._radius, 0, 2 * Math.PI);
        c.fillStyle = this._color;
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

    get getCircle()
    {
        return this._circle;
    }
}


class Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
     {
        this._pos = new Vec2(_x,_y);
        this._size = new Vec2(_width,_height);
        this._rect = new Rect(this._pos,this._size);
        this._velocity = new Vec2(_xVel, _yVel);
        this.m_angle = 90;
        this.m_speed = 0.2;
        
        this._attack = false;
        this._attackDistance = 500;

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
    get getRect()
    {
        return this._rect;
    }
}

class EnemyMinion extends Enemy {

    constructor (_x, _y,_width, _height, _xVel, _yVel)
    {
        super(_x, _y,_width, _height, _xVel,_yVel);
      
        this._alignmentDistance = 50;
        this._cohesionDistance = 450;
        this._seperationDistance = 90;

        this._acceleration = new Vec2(0,0);
        this._VelocityLength = 0;
        this._maxSpeed = 2;
        this._maxForce = 1;

        this._seperationWeight = 30;
        this._cohesionWieght = 2;
        this._alignmentWeight = 1;
        this._seekWeight = 1.5;

        this._alignment = new Vec2(0,0);
        this._cohesion = new Vec2(0,0);
        this._seperation = new Vec2(0,0);
        this._seek = new Vec2(0,0);
        this.m_color = 'blue';
    }


    static generateFlockPoint(minions, playerPos , flockPoint, dt)
    {    
        let avgPos = new Vec2(0,0);
        //we know the tally of the array, remove and replace with array.length?
        let tally = 0;
    
        minions.forEach(minion => 
        {
            avgPos.addVec = minion.getPos;
            tally++;   
        });

        if( tally > 0)
        avgPos.div = tally;

         // if not chasing and average flock pos is less than 50. generate new flockpoint
         if(Vec2.distance(avgPos, flockPoint) < 50) 
         { 
             flockPoint.x = Math.random() * WORLD_WIDTH;
             flockPoint.y = Math.random() * WORLD_HEIGHT;
         }
         
        minions.forEach(minion => 
        {            
            if(Vec2.distance(avgPos, playerPos) < minion._attackDistance)
            {   
                if(!minion._attack)
                {
                    minion._attack = true;
                    //alter weight vlaues here
                }
                flockPoint.x = playerPos.x;
                flockPoint.y = playerPos.y;
            } //if chasing but the player gets away, seek  to new point set active to false
            else if(Vec2.distance(avgPos, playerPos) > minion._attackDistance && minion._attack)
            {
                //Being set for every minion, just needs to be set once
                flockPoint.x = Math.random() * WORLD_WIDTH;
                flockPoint.y = Math.random() * WORLD_HEIGHT;
                minion._attack = false;
                //alter weight values here
            }
            minion.flock(minions,dt,flockPoint);
        });
    }

    flock(minions,dt, flockPoint)
    {     
      
       this._alignment = this.alignment(minions);
       this._cohesion = this.cohesion(minions);
       this._seperation = this.seperation(minions);
       this._seek = this.seek(flockPoint);
    
       this._acceleration.addVec = new Vec2(this._cohesion.x * this._cohesionWieght, this._cohesion.y * this._cohesionWieght);
       this._acceleration.addVec = new Vec2(this._alignment.x * this._alignmentWeight,this._alignment.y * this._alignmentWeight);
       this._acceleration.addVec =  new Vec2(this._seperation.x * this._seperationWeight, this._seperation.y * this._seperationWeight);
       this._acceleration.addVec =  new Vec2(this._seek.x * this._seekWeight, this._seek.y * this._seekWeight);
      
       this._velocity.addVec = this._acceleration;
       
       this._velocity.x += this._velocity.x * dt;
       this._velocity.y += this._velocity.y * dt;

       this._velocity.setMagnitude = this._maxSpeed;

       this._pos.addVec = this._velocity;
       this._rect.updatePoints(this._velocity);
       this._acceleration = new Vec2(0,0);
    }


    seek(pos)
    {
        let steering = new Vec2(0,0);
        let direction = new Vec2(pos.x - this._pos.x, pos.y - this._pos.y);
        steering = Vec2.normalise(direction);
        steering = Vec2.subtractVec(steering, this._velocity);
        steering.setMagnitude = this._maxSpeed;
        
        return steering;
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
        this._rect.draw(cameraPos, this.m_color);
    }
}


const Circle = function(pos,radius){
    this._pos = new Vec2(pos.x,pos.y);
    this._radius = radius;
}
Circle.prototype.getPos = function()
{
    return this._pos;
}
Circle.prototype.getRadius = function()
{
    return this._radius;
}


const Rect = function(pos,size){
    
    this._pos = pos;
    this._size = size;
    this._origin = new Vec2(this._pos.x + this._size.x/2,this._pos.y + this._size.y/2);
    this._points = [];
    this._angle = 0;
    this._points.push(new Vec2(this._pos.x,this._pos.y));
    this._points.push(new Vec2(this._pos.x + this._size.x,this._pos.y));
    this._points.push(new Vec2(this._pos.x + this._size.x,this._pos.y + this._size.y));
    this._points.push(new Vec2(this._pos.x,this._pos.y + this._size.y));
}

Rect.prototype.getPoints = function()
{
    return this._points;
}
Rect.prototype.getOrigin = function()
{
    return this._origin;
}

Rect.prototype.rotate = function(angle, pos)
{
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    this._points.forEach(point =>
    {
       //translate point to origin
       let translated_x = point.x - this._origin.x;
       let translated_y = point.y - this._origin.y;
       //apply rotation to point and re translate
       point.x = translated_x * cos - translated_y * sin + this._origin.x;
       point.y = translated_x * sin + translated_y * cos + this._origin.y;
    });
}

Rect.prototype.setPos = function(pos)
{
    this._pos = pos;
    this._origin.x = this._pos.x + this._size.x/2;
    this._origin.y = this._pos.y + this._size.y/2;
}
Rect.prototype.updatePoints = function(velocity)
{
    this._origin.x += velocity.x;
    this._origin.y += velocity.y;

    this._points[0].x += velocity.x;
    this._points[0].y += velocity.y;

    this._points[1].x += velocity.x;
    this._points[1].y += velocity.y;

    this._points[2].x += velocity.x;
    this._points[2].y += velocity.y;

    this._points[3].x += velocity.x;
    this._points[3].y += velocity.y;

}

Rect.prototype.draw = function(cameraPos,color)
{
    c.beginPath();
    c.strokeStyle = color;
    c.moveTo(this._points[0].x - cameraPos.x, this._points[0].y  - cameraPos.y);
    c.lineTo(this._points[1].x - cameraPos.x, this._points[1].y - cameraPos.y);
    c.lineTo(this._points[2].x - cameraPos.x, this._points[2].y - cameraPos.y);
    c.lineTo(this._points[3].x - cameraPos.x, this._points[3].y - cameraPos.y);
    c.lineTo(this._points[0].x - cameraPos.x, this._points[0].y - cameraPos.y);
    c.stroke();
    c.closePath();
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

    set multiply(value)
    {
        this.x *= value;
        this.y *= value;
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
    static dotProduct(vec1, vec2)
    {
       return vec1.x * vec2.x + vec1.y * vec2.y;
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
const MINION_FLOCK_COUNT = 5;

const HEARTH_POS = new Vec2(0,0);
const HEARTH_SIZE = new Vec2(100,100);

const HEALTHBAR_POS = new Vec2(0,0);
const HEALTHBAR_SIZE = new Vec2(300,100);

const HEALTHVALUE_POS = new Vec2(0,0);
const HEALTHVALUE_SIZE = new Vec2(296,96);


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
    let flockPoint = new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);

    for(let col = 0; col < MINION_COUNT; col++)
    {
        let tempMinion = new EnemyMinion(flockPoint.x + 150 * col, flockPoint.y + 10 * col, 39, 98 ,Math.random(1) + -1, Math.random(1) + -1);
       // let tempMinion = new EnemyMinion(player.getPos.x + 250 , player.getPos.y + 210, 39, 98 ,Math.random(1) + -1, Math.random(1) + -1);
        tempMinions.push(tempMinion);
    }
    minions.push(tempMinions);
    flockPoints.push(new Vec2(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT));
}

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
    
    bullets.forEach(bullet => {
        bullet.move(dt);
    })
   
    collisionManager.playerBoundaryCollision(player);

    
    enemies.forEach(enemy => 
    {
        enemy.move(dt,player.getPos,player.getSize);
    });

    //for every array, allocate seek point and move the flock
   for( let row = 0; row < minions.length; row++)
   {
       EnemyMinion.generateFlockPoint(minions[row], player.getPos, flockPoints[row], dt);
   }
   // for all minions if attacking and collide with player, delete the minion
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

    for(let b = 0; b < bullets.length; b++)
    {
        for( let row = 0; row < minions.length; row++)
        {
            for( let col = 0; col < minions[row].length; col++)
            {   //pass the circle and rect object in
                if(CollisionManager.CircleRectCollision(bullets[b], minions[row][col].getRect))
                {
                   //remove bullets
                   //remove minion
                }
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

    minions.forEach(array => 
    {
        array.forEach(minion =>
        {
            minion.draw(camera.getPos);
        }); 
    });
}
