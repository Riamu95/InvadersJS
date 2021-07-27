import { Vec2 } from "./Vec2.js";

export const seek = function(pos, rect, velocity, maxSpeed)
{
    let steering = new Vec2(0,0);
    steering.x = pos.x - rect.getOrigin().x;
    steering.y =  pos.y - rect.getOrigin().y;
    steering = Vec2.subtractVec(steering, velocity);
    steering.setMagnitude = maxSpeed;

    return steering;
}