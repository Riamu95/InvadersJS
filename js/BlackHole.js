import { Rect } from "./Rect.js";
import { Vec2 } from "./Vec2.js";
export { BlackHole };

const BlackHole = function(pos,size)
{
    this._rect = new Rect(pos,size);
    this._acitve = false;
    this._activeDistance = 750;
    this._gravitationalForce = 0;
    this._g = 9.81;
    this._mass = 1000;

    this._directionalForce = new Vec2(0,0);
    this._forceMagnitude = 0;
}

BlackHole.prototype.BLACKHOLE_IMAGE = document.getElementById('blackhole');

BlackHole.prototype.update = function()
{
    this._rect.getAngle() >= 360 ? this._rect.setAngle(0) : this._rect.addAngle(0.1);
}

BlackHole.prototype.getRect = function()
{
   return  this._rect;
}

BlackHole.prototype.attract = function(origin, mass, worldWidth,worldHeight)
{
    if (Vec2.distance(this._rect.getOrigin(), origin) > this._activeDistance)  
            return [new Vec2(0,0), false];

    if (Vec2.distance(this._rect.getOrigin(), origin) < 50)
    {
        let pos = BlackHole.teleport(worldWidth,worldHeight);
        return [pos, true];    
    }
    //direction of force
    this._directionalForce.x = this._rect.getOrigin().x - origin.x;
    this._directionalForce.y = this._rect.getOrigin().y - origin.y;

    let d =  Vec2.length(this._directionalForce);
    
    this._directionalForce = Vec2.normalise(this._directionalForce);

    //magnitude of force
    this._forceMagnitude = this._g * (this._mass * mass)/(d * d);
   
    this._directionalForce.setMagnitude = this._forceMagnitude;
    return [this._directionalForce, false];
}

BlackHole.teleport = function(worldWidth,worldHeight)
{
    return new Vec2(Math.random() * worldWidth, Math.random() * worldHeight);  
}

BlackHole.prototype.draw = function(ctx,cameraPos)
{
    ctx.save();
    ctx.beginPath();      
    ctx.translate(this._rect.getOrigin().x - cameraPos.x,this._rect.getOrigin().y - cameraPos.y);
    ctx.rotate(Math.PI/180 * this._rect.getAngle());
    ctx.drawImage(BlackHole.prototype.BLACKHOLE_IMAGE,0,0,this._rect.getSize().x,this._rect.getSize().y,-this._rect.getSize().x/2,-this._rect.getSize().y/2,this._rect.getSize().x,this._rect.getSize().y);
    ctx.closePath();
    ctx.restore();
}

