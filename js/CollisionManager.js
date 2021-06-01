
class CollisionManager
{
    
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
        let overlapMagnitude = Infinity;
        let smallestAxis = null;
   
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

               // for each projected axis, get the minimum overlap = magnitude
               // let overlap = Math.min(max_o1,max_o2) - Math.max(min_o1,min_o2);
               // if(overlap < overlapMagnitude)
               // {
                   // overlapMagnitude = overlap;
                    //set direction of minimum overlap
                   // smallestAxis = new Vec2(projectedAxis.x, projectedAxis.y);
                   /*
                   if (max_o1 > max_o2) {
                      smallestAxis.x *= -1;
                      smallestAxis.y *= -1;
                   }*/
              //  }
            }
        }

       // smallestAxis.setMagnitude = overlapMagnitude;
        return true;
    }

    static CircleRectCollision(obj1, obj2,_angle)
    {
        //convert rect angle to radians
        let angle = _angle * (Math.PI/180);
        //rotate rect back to align with the x axis
        obj2.rotate(-angle);
        
        let rectPoints = obj2.getPoints();

        //rotated circle origin
        let circlePos = new Vec2(obj1.getCircle.getPos().x,obj1.getCircle.getPos().y);

        circlePos.x = Math.cos(-angle) * (circlePos.x - obj2.getOrigin().x) - Math.sin(-angle) *
        (circlePos.y - obj2.getOrigin().y) + obj2.getOrigin().x;
        
        circlePos.y =  Math.sin(-angle) * (circlePos.x - obj2.getOrigin().x) + Math.cos(-angle) *
        (circlePos.y - obj2.getOrigin().y) + obj2.getOrigin().y;

        let collisionVec = new Vec2(circlePos.x,circlePos.y);

        //calcualte point of collision
        if(circlePos.x < rectPoints[0].x)
        {
            collisionVec.x = rectPoints[0].x;
        }
        else if (circlePos.x > rectPoints[1].x)
        {
            collisionVec.x = rectPoints[1].x;
        }

        if(circlePos.y < rectPoints[0].y)
        {
            collisionVec.y = rectPoints[0].y;
        }
        else if (circlePos.y  > rectPoints[2].y)
        {
            collisionVec.y = rectPoints[2].y;
        }
        //check for ditance between circle origin and collision point
        let dist = Vec2.distance(circlePos,collisionVec);

        if(dist <= obj1.getCircle.getRadius())
        {
            obj2.rotate(angle);
            return true;
        }
        obj2.rotate(angle);
        return false;

        /*o1 = circle , 02 = rect  obj
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
        return false;*/
    }
}

