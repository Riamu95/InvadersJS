class GameOverScene extends Scene 
{

    constructor(scene)
    {
        super();
        this._scenes =  scene;
    }


    update()
    {
        //if clicked on  Main menu button 
        //go to main menu

        //if clicked on gameover button go to game over
    }

    draw(ctx)
    {
        ctx.clearRect(0,0,this.canvas_width,this.canvas_height);
        ctx.beginPath();
        ctx.rect(0, 0, 1920, 1080);
        ctx.fillStyle = "Green";
        ctx.fill(); 
        ctx.closePath();  
    }

    NextScene()
    {
        let startScene = new StartScene(this._scenes);
        this._scenes.push(startScene);
        //set bool t ofalse 
        this._scenes.shift();
    }
}