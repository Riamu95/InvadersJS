import { Vec2 } from "./Vec2.js";
export { CollisionManager };

class CollisionManager
{
    constructor(){}

   static SATCollision(obejct1, object2)
    {
        let objOne = obejct1;
        let objTwo = object2;
        let minimumOverlap = Infinity;
        let axisDirection = new Vec2(0,0);
        let mtv = new Vec2(0,0);

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
                    return false;//[false, axisDirection, minimumOverlap];
                /*else
                {
                    let overlap = Math.min(max_o2-min_o1,max_o1-min_o2);
                   // console.log(overlap);
                    if (overlap < minimumOverlap) {
                        minimumOverlap = overlap;
                        axisDirection = projectedAxis;
                    } 
                }*/
            }
        }
        //axisDirection = Vec2.normalise(axisDirection);
      //  console.log("smallest axis", axisDirection);
      //  console.log('magnitude ', minimumOverlap);
        return true; //[true, axisDirection, minimumOverlap];
    }

    static CirlceRectCollision(circle,  rect)
    {
        let testX = circle.getPos().x;
        let testY = circle.getPos().y;

        if(circle.getPos().x < rect.getOrigin().x - rect.getSize().x/2 )
            testX = rect.getOrigin().x - rect.getSize().x/2;
        else if(circle.getPos().x > rect.getOrigin().x +  rect.getSize().x/2)
            testX = rect.getOrigin().x +  rect.getSize().x/2;

        if (circle.getPos().y < rect.getOrigin().y - rect.getSize().y/2)
            testY = rect.getOrigin().y - rect.getSize().y/2;
        else if( circle.getPos().y > rect.getOrigin().y + rect.getSize().y/2)
            testY = rect.getOrigin().y + rect.getSize().y/2;

        let distX = circle.getPos().x - testX;
        let distY = circle.getPos().y - testY;
        let distance = Math.sqrt(distX * distX + distY * distY);
        
        if( distance <= circle.getRadius())
            return true;
        else
            return false;
    }

    /*
    static SATCollision(obejct1, object2)
    {
        let objOne = obejct1;
        let objTwo = object2;
        let minimumOverlap = Infinity;
        let axisDirection = new Vec2(0,0);

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
                projectedAxis = Vec2.normalise(projectedAxis);
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
                let overlap = 0;
                if((max_o1 > max_o2 && min_o1 < min_o2) || (max_o1 < max_o2 && min_o1 > min_o2))
                {
                    let minO = Math.abs(min_o1 - min_o2);
                    let maxO = Math.abs(max_o1 - max_o2);

                    if(minO < maxO)
                    {
                        overlap += minO;
                    }
                    else
                    {
                        overlap += maxO;
                    }
                }

                 overlap = Math.min(max_o1,max_o2 ) - Math.max(min_o1,min_o2);//Math.min(max_o2-min_o1,max_o1-min_o2);
               
                if (overlap < minimumOverlap) {
                    minimumOverlap = overlap;
                    axisDirection = projectedAxis;
                } 

                //check for overlap, if they dont overlap return flase, otherwise continue
                if(!(max_o2 > min_o1 && max_o1 > min_o2))
                {
                    axisDirection.setMagnitude = 0;
                    return [false, axisDirection];
                }
              /*  else
                {
                    let overlap =  Math.min(max_o1,max_o2) - Math.max(min_o1,min_o2);//Math.min(max_o2-min_o1,max_o1-min_o2);
                    if (overlap < minimumOverlap) {
                        minimumOverlap = overlap;
                        axisDirection = projectedAxis;
                    } 
                }*/
     /*       }
        }

        //axisDirection = Vec2.normalise(axisDirection);
        console.log("smallest axis", axisDirection);
        console.log('magnitude ', minimumOverlap);
        axisDirection.setMagnitude = minimumOverlap;
        console.log('mtv ', axisDirection);

        return [true, axisDirection];
    }*/
    
}

