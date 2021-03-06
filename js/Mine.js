import { Weapon } from "./Weapon.js";
import { Bullet } from "./Bullet.js";
import { Vec2 } from "./Vec2.js";
import { AudioManager } from "./AudioManager.js";

export { Mine };
const Mine = function(size,ammoCount,ttl,damage)
{
    Weapon.call(this,size,ammoCount,ttl,damage);
    this._image = document.getElementById("mineBullet");
    this._maxAmmo = 5;
}

Mine.prototype = Object.create(Weapon.prototype);

Mine.prototype.addBullet = function(pos,size,angle,maxSpeed, ttl)
{
        maxSpeed = 0;
        this._bullets.push(new Bullet(new Vec2(pos.x,pos.y),new Vec2(size.x,size.y),angle, maxSpeed, ttl));
        this._ammoCount--;
        AudioManager.getInstance().playSound("mine");
}

Mine.prototype.update = function(dt)
{
    return;
}
