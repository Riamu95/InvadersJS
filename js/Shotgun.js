const Shotgun = function(size,ammoCount,ttl,damage)
{
    Weapon.call(this,size,ammoCount,ttl,damage);
    this._image = document.getElementById("shotgunBullet");
    this._maxAmmo = 15;
}

Shotgun.prototype = Object.create(Weapon.prototype);

Shotgun.prototype.addBullet = function(pos,size,angle,maxSpeed)
{
    angle = angle - 0.2;
    let i = 0;
    while(this._ammoCount > 0 && i < 3)
    {
        this._bullets.push(new Bullet(new Vec2(pos.x,pos.y),new Vec2(size.x,size.y),angle,maxSpeed));
        angle += 0.2;
        this._ammoCount--;
        i++;
    }
    AudioManager.getInstance().playSound("shotgun", pos);
}

