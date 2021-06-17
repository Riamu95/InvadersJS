const AnimationManager = function()
{
    this._animations = [];
    
}
AnimationManager.prototype.getInstance = function()
{

}
//noOfFrames,transitionTime,pos,image, size
AnimationManager.prototype.addAnimation = function(...animationProperties)
{
    //is it better to pass some of these properties in rather than store them?

    //frames, transitiontime,pos,image,size,currentFrame,timer
    let animateObj = {

        noOfFrames : animationProperties[0],
        transitionTime : animationProperties[1],
        pos : animationProperties[2],
        imagesrc : animationProperties[3],
        size : animationProperties[4],
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
            if( time > this._animations[i].transitionTime && this._animations[i].currentFrame < this._animations[i].noOfFrames)
            {
                this._animations[i].currentFrame += 1;
            }
            
            ctx.drawImage(this._animations[i].imagesrc, this._animations[i].currentFrame * this._animations[i].size.x,0,this._animations[i].size.x,this._animations[i].size.y,
            (this._animations[i].pos.x - this._animations[i].size.x/2) - cameraPos.x,((this._animations[i].pos.y - this._animations[i].size.y/2)) - cameraPos.y,this._animations[i].size.x,this._animations[i].size.y);
           
            if (time > this._animations[i].transitionTime && this._animations[i].currentFrame >= this._animations[i].noOfFrames)
            {
                this._animations.splice(i,1);
                i--;
            }
    } 
}