import { Vec2 } from "./Vec2.js";
export { Weapon };

const Weapon = function(size,ammoCount,ttl,damage)
{
    this._ammoCount = ammoCount;
    this._bullets = [];
    this._image = null;
    this._ttl = ttl;
    this._damage = damage;
    this._bulletSize = new Vec2(size.x,size.y);
    this._maxAmmo = null;
}

Weapon.prototype.addBullet = function(pos,size,angle)
{
}

Weapon.prototype.update = function(dt)
{
    for( let i = 0; i < this._bullets.length; i++)
    {
        this._bullets[i].move(dt);
    }
}

Weapon.prototype.draw = function(ctx, cameraPos)
{
    this._bullets.forEach(bullet => {
        bullet.draw(ctx,cameraPos,this._image,this._bulletSize);
    });
}

Weapon.prototype.getMaxAmmo = function()
{
    return this._maxAmmo;
}

Weapon.prototype.getAmmoCount = function()
{
    return this._ammoCount;
}

Weapon.prototype.getBullets = function()
{
    return this._bullets;
}

Weapon.prototype.getImage = function()
{
    return this._image;
}

Weapon.prototype.addAmmo = function(ammoVal)
{
    let ammoIndex = 0;
    while(this._ammoCount < this._maxAmmo && ammoIndex < ammoVal)
    {
        this._ammoCount += 1;
        ammoIndex++;
    }
}
Weapon.prototype.getTTL = function()
{
    return this._ttl;
}

Weapon.prototype.getDamage = function()
{
    return this._damage;
}

Weapon.prototype.getBulletSize = function()
{
    return this._bulletSize;
}

