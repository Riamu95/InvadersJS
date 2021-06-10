class GameOverScene extends Scene 
{

    constructor(scene)
    {
        super();
        this._scenes =  scene;

        this._background = document.getElementById("MainMenuBackground");
        this._gameOverLogo = document.getElementById("GameOver");
        this._title = document.getElementById('Title');
        this._playButton = document.getElementById("playAgainOne");
        this._quitButton = document.getElementById("quitOne");
       
       
        this._gameOverLogo.style.display = "block";

        this._playOriginW =  400;
        this._playOriginH = 185;

        this._titleOriginW =  550;
        this._titleOriginH = 180;

        this._playButton.style.display = "block";
        this._quitButton.style.display = "block";
      

        this._next = this.NextScene.bind(this);
        this._quit = this.QuitScene.bind(this);
        
        this._playButton.addEventListener('mouseenter', this.MouseHover);
        this._playButton.addEventListener('mouseleave', this.MouseHover);
        this._playButton.addEventListener('click', this._next);
       
        this._quitButton.addEventListener('mouseenter', this.MouseHover);
        this._quitButton.addEventListener('mouseleave', this.MouseHover);
        this._quitButton.addEventListener('click', this._quit);
       
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
        ctx.drawImage(this._background,0,0,CANVAS_WIDTH,CANVAS_HEIGHT,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.drawImage(this._title,0,0,this._titleOriginW ,this._titleOriginH,CANVAS_WIDTH/2 - this._titleOriginW/2,CANVAS_HEIGHT/8 - this._titleOriginH/2,this._titleOriginW ,this._titleOriginH);
    }

    MouseHover(e)
    {
        if(e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgain.png')
        {
            e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgainClicked.png';
        } 
        else if (e.target.src == 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgainClicked.png')
        {
            e.target.src = 'file:///C:/Users/Predator/Desktop/InvadersJs/Assets/buttons/playAgain.png';
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

    NextScene()
    {
        this._playButton.removeEventListener('click', this._next);
        this._playButton.removeEventListener('mouseenter', this.MouseHover);
        this._playButton.removeEventListener('mouseleave', this.MouseHover);

        this._quitButton.removeEventListener('click', this._quit); 
        this._quitButton.removeEventListener('mouseenter', this.MouseHover);
        this._quitButton.removeEventListener('mouseleave', this.MouseHover);

        this._playButton.style.display = 'none';
        this._quitButton.style.display = 'none';
        this._gameOverLogo.style.display = "none";

        let gameScene = new GameScene(this._scenes);

        this._scenes.push(gameScene);

    }


    QuitScene()
    {
        this._playButton.removeEventListener('click', this._next);
        this._playButton.removeEventListener('mouseenter', this.MouseHover);
        this._playButton.removeEventListener('mouseleave', this.MouseHover);

        this._quitButton.removeEventListener('click', this._quit); 
        this._quitButton.removeEventListener('mouseenter', this.MouseHover);
        this._quitButton.removeEventListener('mouseleave', this.MouseHover);

        this._playButton.style.display = 'none';
        this._quitButton.style.display = 'none';
        this._gameOverLogo.style.display = "none";

        this._scenes.shift();
    }
}