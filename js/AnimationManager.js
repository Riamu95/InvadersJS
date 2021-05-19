const AnimationManager = function()
{
    this._animations = [];
    
}
AnimationManager.prototype.getInstance = function()
{

}

AnimationManager.prototype.addAnimation = function(startFrame,endFrame,transitionTime,pos,image, size)
{
    let animateObj = {
        startFrame : startFrame,
        endFrame : endFrame,
        transitionTime : transitionTime,
        pos : pos,
        imagesrc : image,
        size : size,
        currentFrame : 0,
        timer : performance.now()
    }

    this._animations.push(animateObj);
}


AnimationManager.prototype.draw = function(ctx,cameraPos)
{
    for(let i = 0; i < this._animations.length; i++ )
    {
            //increase time 
            let time = performance.now() - this._animations[i].timer;
            time /= 1000;
            time = Math.round(time);
            if( time > this._animations[i].transitionTime && this._animations[i].currentFrame < this._animations[i].endFrame)
            {
                this._animations[i].currentFrame += 1;
            }
            
            ctx.drawImage(this._animations[i].imagesrc, this._animations[i].currentFrame * this._animations[i].size.x,0,this._animations[i].size.x,this._animations[i].size.y,
            this._animations[i].pos.x - cameraPos.x,this._animations[i].pos.y - cameraPos.y,this._animations[i].size.x,this._animations[i].size.y);
           
            if (time > this._animations[i].transitionTime && this._animations[i].currentFrame >= this._animations[i].endFrame)
            {
                this._animations.splice(i,1);
                i--;
            }
    } 
}