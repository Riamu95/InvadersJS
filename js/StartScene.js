import { GuiComponent } from './GuiComponent.js';
import { Vec2 } from './Vec2.js';
import { Asteroid } from './Asteroid.js';
import { Scene } from './Scene.js';
import { AudioManager } from './AudioManager.js';
import { GameScene } from "./GameScene.js";
export {StartScene};

class StartScene extends Scene 
{
    constructor(scene,canvas)
    {
        super(canvas);
        this._scenes = scene;

        this._guiComponents = [];

        this._next = this.NextScene.bind(this);
        this._quit = this.QuitScene.bind(this);

        this._enter = this.MouseEnter.bind(this);
        this._leave = this.Mouseleave.bind(this);
    
        this._guiComponents.push(new GuiComponent("MainMenuBackground",new Vec2(this._canvasWidth/2,this._canvasHeight/2),new Vec2(this._canvasWidth,this._canvasHeight),true));
        this._guiComponents.push(new GuiComponent("Title",new Vec2(this._canvasWidth/2,this._canvasHeight/3),new Vec2(550,180),true));
        this._guiComponents.push(new GuiComponent("play",new Vec2(this._canvasWidth/2,this._canvasHeight/2),new Vec2(400,185),true, {"click" : this._next} ,{"mouseenter": this._enter},{"mouseleave": this._leave}));
        this._guiComponents.push(new GuiComponent("quit",new Vec2(this._canvasWidth/2,this._canvasHeight/1.5),new Vec2(400,185),true,{"click" : this._quit} ,{"mouseenter": this._enter},{"mouseleave": this._leave}));
        
        this._asteroids = [new Asteroid(new Vec2(this._canvasWidth/10, this._canvasHeight/10), new Vec2(99,99)),new Asteroid(new Vec2(this._canvasWidth/5, this._canvasHeight/5), new Vec2(99,99)),new Asteroid(new Vec2(this._canvasWidth/3, this._canvasHeight/2), new Vec2(99,99))];
    }

    update()
    { 
        this._asteroids.forEach(asteroid => 
        {
            asteroid.update(this._canvasWidth,this._canvasHeight);
        });
    }

    draw()
    {
        StartScene._ctx.clearRect(0,0,this._canvasWidth,this._canvasHeight);
       
        for(let i = 0; i < 2; i++)
        {
            this._guiComponents[i].draw(StartScene._ctx);
        }
        this._asteroids.forEach(asteroid => 
        {
            asteroid.draw(StartScene._ctx, new Vec2(0,0));
        });
    }

    NextScene()
    {
        AudioManager.getInstance().playSound("buttonClick");
        this._guiComponents.forEach(gui =>
        {
            gui.removeListeners();
        });

        this._guiComponents[2].getImage().style.display = 'none';
        this._guiComponents[3].getImage().style.display = 'none';
        let gameScene = new GameScene(this._scenes);

        this._scenes.push(gameScene);
    }

    MouseEnter(e)
    {
        AudioManager.getInstance().playSound("buttonHover");
        if(e.target.id == "play")
        {
            e.target.src = "../Assets/buttons/playClicked.png"
        }
        else if (e.target.id == "quit")
        {
            e.target.src = "../Assets/buttons/quitClicked.png"
        }
    }

    Mouseleave(e)
    {
        if(e.target.id == "play")
        {
            e.target.src = "../Assets/buttons/play.png"
        }
        else if (e.target.id == "quit")
        {
            e.target.src = "../Assets/buttons/unquit.png"
        }
    }


    QuitScene()
    {
        AudioManager.getInstance().playSound("buttonClick");
        this._guiComponents.forEach(gui =>
        {
            gui.removeListeners();
        });

        this._playButton.style.display = 'none';
        this._quitButton.style.display = 'none';
        this._scenes.shift();
    }
}