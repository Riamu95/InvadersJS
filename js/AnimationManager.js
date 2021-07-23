export { AnimationManager };

const AnimationManager = function()
{
    this._animations = [];
    AnimationManager.prototype.BOMBER_RADAR_PING = document.getElementById('bomberRadarPing');
    AnimationManager.prototype.MINION_RADAR_PING = document.getElementById('minionRadarPing');
    AnimationManager.prototype.ASTEROID_RADAR_PING = document.getElementById('asteroidRadarPing');
    AnimationManager.prototype.BH_RADAR_PING = document.getElementById('bhRadarPing');
    AnimationManager.prototype.BULLET_EXPLOSION_IMAGE = document.getElementById('bulletExplosion');
    AnimationManager.prototype.MINE_EXPLOSION_IMAGE = document.getElementById('mineExplosion');
    AnimationManager.prototype.EXPLOSION_IMAGE = document.getElementById('explosion');
    AnimationManager.prototype.MAP_IMAGE = document.getElementById('map');
}
AnimationManager.prototype.getInstance = function()
{

}

AnimationManager.prototype.addAnimation = function(...animationProperties)
{
    //frames, transitiontime,pos,image,size,currentFrame,timer
    let img = null;
    animationProperties[3] = this.setImage(img,animationProperties[3]);
    let animateObj = {

        noOfFrames : animationProperties[0],
        transitionTime : animationProperties[1],
        pos : animationProperties[2],
        imagesrc : animationProperties[3],
        size : animationProperties[4],
        dynamic : animationProperties[5],
        currentFrame : 0,
        timer : performance.now()
    }
    this._animations.push(animateObj);
}
AnimationManager.prototype.setImage = function(img,animation)
{
    switch(animation)
    {
        case "BOMBER":
            img = AnimationManager.prototype.BOMBER_RADAR_PING;
            break;
        case "MINION":
            img = AnimationManager.prototype.MINION_RADAR_PING;
            break;
        case "ASTEROID":
            img = AnimationManager.prototype.ASTEROID_RADAR_PING;
            break;
        case "BH":
            img = AnimationManager.prototype.BH_RADAR_PING;
            break;
        case "MINE":
            img = AnimationManager.prototype.MINE_EXPLOSION_IMAGE;
            break;
        case "EXPLOSION":
            img = AnimationManager.prototype.EXPLOSION_IMAGE;
            break;
        case "BULLET":
            img = AnimationManager.prototype.BULLET_EXPLOSION_IMAGE;
            break;
        case "MAP":
            img =  AnimationManager.prototype.MAP_IMAGE;
            break;       
    }
    return img;
}


AnimationManager.prototype.draw = function(ctx,cameraPos)
{
    for(let i = 0; i < this._animations.length; i++)
    {
        let time = (performance.now() - this._animations[i].timer)/1000;

        if( time > this._animations[i].transitionTime)
        {
            this._animations[i].currentFrame++;
            this._animations[i].timer = performance.now();
        }
        //if current animation does not require updated camerapos since it was inserted to the animations array.
        if(!this._animations[i].dynamic)
        {
            ctx.drawImage(this._animations[i].imagesrc, this._animations[i].currentFrame * this._animations[i].size.x,0,this._animations[i].size.x,this._animations[i].size.y,
            (this._animations[i].pos.x - this._animations[i].size.x/2) - cameraPos.x,((this._animations[i].pos.y - this._animations[i].size.y/2)) - cameraPos.y,this._animations[i].size.x,this._animations[i].size.y);
        }
        else
        { //if current animation does require updated camerapos since it was inserted to the animations array.
            ctx.drawImage(this._animations[i].imagesrc, this._animations[i].currentFrame * this._animations[i].size.x,0,this._animations[i].size.x,this._animations[i].size.y,
            (cameraPos.x + (this._animations[i].pos.x - this._animations[i].size.x/2)) - cameraPos.x,(cameraPos.y + (this._animations[i].pos.y - this._animations[i].size.y/2)) - cameraPos.y,this._animations[i].size.x,this._animations[i].size.y);
        }

        if (this._animations[i].currentFrame >= this._animations[i].noOfFrames)
        {
            this._animations.splice(i,1);
            i--;
        }
    } 
}