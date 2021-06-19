class GameOverScene extends Scene 
{

    constructor(scene)
    {
        super();
        this._scenes =  scene;

        this._next = this.NextScene.bind(this);
        this._quit = this.QuitScene.bind(this);
        
        this._guiComponents = [];
        this._guiComponents.push(new GuiComponent("MainMenuBackground",new Vec2(CANVAS_WIDTH/2,CANVAS_HEIGHT/2),new Vec2(CANVAS_WIDTH,CANVAS_HEIGHT),true));
        this._guiComponents.push(new GuiComponent("Title",new Vec2(CANVAS_WIDTH/2,CANVAS_HEIGHT/5),new Vec2(550,180),true));
        this._guiComponents.push(new GuiComponent("GameOver", new Vec2(CANVAS_WIDTH/2,CANVAS_HEIGHT/2), new Vec2(550,180), true));
        this._guiComponents.push(new GuiComponent("playAgain",new Vec2(CANVAS_WIDTH/2,CANVAS_HEIGHT/2),new Vec2(400,185),true, {"click" : this._next} ,{"mouseenter": null},{"mouseleave": null}));
        this._guiComponents.push(new GuiComponent("quit",new Vec2(CANVAS_WIDTH/2,CANVAS_HEIGHT/1.5),new Vec2(400,185),true,{"click" : this._quit} ,{"mouseenter": null},{"mouseleave": null}));
        
        this._guiComponents[2].getImage().style.display = "block";
        this._guiComponents[3].getImage().style.display = "block";
        this._guiComponents[4].getImage().style.display = "block";
   
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
        for(let i = 0; i < 2; i++)
        {
            this._guiComponents[i].draw(ctx);
        }
    }


    NextScene()
    {
        this._guiComponents.forEach(gui =>
        {
            gui.removeListeners();
        });

        this._guiComponents[2].getImage().style.display = "none";
        this._guiComponents[3].getImage().style.display = "none";
        this._guiComponents[4].getImage().style.display = "none";

        let gameScene = new GameScene(this._scenes);

        this._scenes.push(gameScene);
    }


    QuitScene()
    {
        this._guiComponents.forEach(gui =>
        {
            gui.removeListeners();
        });

        this._guiComponents[2].getImage().style.display = "none";
        this._guiComponents[3].getImage().style.display = "none";
        this._guiComponents[4].getImage().style.display = "none";

        this._scenes.shift();
    }
}