import { Weapon } from "./Weapon.js";
import { Bullet } from "./Bullet.js";
import { Vec2 } from "./Vec2.js";
import { AudioManager } from "./AudioManager.js";
export { Pistol };

const Pistol = function(size,ammoCount,ttl,damage)
{
    Weapon.call(this,size,ammoCount,ttl,damage);
    this._image = document.getElementById("playerBullet");
}

Pistol.prototype = Object.create(Weapon.prototype);

Pistol.prototype.addBullet = function(pos,size,angle,maxSpeed)
{
    this._bullets.push(new Bullet(new Vec2(pos.x,pos.y),size,angle,maxSpeed));
    AudioManager.getInstance().playSound("pistol");
}



