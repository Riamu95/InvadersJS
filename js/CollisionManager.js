
class CollisionManager
{
    
    constructor(){}

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
}

