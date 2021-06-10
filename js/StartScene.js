class StartScene extends Scene 
{
    constructor(scene)
    {
        super();
        this._scenes = scene;
        this._backgroundImage = document.getElementById('MainMenuBackground');
        this._title = document.getElementById('Title');
        this._playButton = document.getElementById("playOne");
        this._playOriginW =  400;
        this._playOriginH = 185;
        this._quitButton = document.getElementById("quitOne");
        this._titleOriginW =  550;
        this._titleOriginH = 180;
        
        this._next = this.NextScene.bind(this);
        this._quit = this.QuitScene.bind(this);

        this._playButton.addEventListener('click', this._next);
        this._quitButton.addEventListener('click', this._quit);
        
        this.hover = this.MouseHover;

        this._playButton.addEventListener('mouseenter', this.hover);
        this._playButton.addEventListener('mouseleave',this.hover);
       
        this._quitButton.addEventListener('mouseenter', this.hover);
        this._quitButton.addEventListener('mouseleave',this.hover);
    }

    

    update()
    {
        
    }

    draw(ctx)
    {
        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.drawImage(this._backgroundImage,0,0,CANVAS_WIDTH,CANVAS_HEIGHT,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.drawImage(this._title,0,0,this._titleOriginW ,this._titleOriginH,CANVAS_WIDTH/2 - this._titleOriginW/2,CANVAS_HEIGHT/3 - this._titleOriginH/2,this._titleOriginW ,this._titleOriginH);
    }

    NextScene()
    {
        this._playButton.removeEventListener('click', this._next);
        this._playButton.removeEventListener('mouseenter', this.hover);
        this._playButton.removeEventListener('mouseleave', this.hover);

        this._quitButton.removeEventListener('click', this._quit); 
        this._quitButton.removeEventListener('mouseenter', this.hover);
        this._quitButton.removeEventListener('mouseleave', this.hover);

        this._playButton.style.display = 'none';
        this._quitButton.style.display = 'none';

        let gameScene = new GameScene(this._scenes);

        this._scenes.push(gameScene);

    }


    QuitScene()
    {
        this._playButton.removeEventListener('click', this._next);
        this._playButton.removeEventListener('mouseenter', this.hover);
        this._playButton.removeEventListener('mouseleave', this.hover);

        this._quitButton.removeEventListener('click', this._quit); 
        this._quitButton.removeEventListener('mouseenter', this.hover);
        this._quitButton.removeEventListener('mouseleave', this.hover);

        this._playButton.style.display = 'none';
        this._quitButton.style.display = 'none';
        this._scenes.shift();
    }

    MouseHover(e)
    {
        if(e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/play.png')
        {
            e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playClicked.png';
        } 
        else if (e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playClicked.png')
        {
            e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/play.png';
        }

        if(e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/unquit.png')
        {
            e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/quitClicked.png';
        } 
        else if (e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/quitClicked.png')
        {
            e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/unquit.png';
        }    
    }
}