class Scene 
{
    static _canvas = document.querySelector('canvas');
    static _ctx = Scene._canvas.getContext('2d');
   
    constructor()
    {
        this._scenes = null;
        Scene._canvas.width = window.innerWidth;
        Scene._canvas.height = window.innerHeight;
        this._canvasWidth = Scene._canvas.width;
        this._canvasHeight = Scene._canvas.height;
        AudioManager.getInstance().addSound("buttonHover", "../Assets/Audio/buttonHover.ogg", { loop : false }, { volume : 0.2 });
        AudioManager.getInstance().addSound("buttonClick", "../Assets/Audio/buttonClick.wav", { loop : false }, { volume : 0.2 });
    }


    init()
    {

    }

    update()
    {

    }

    draw()
    {

    }

    NextScene()
    {
        
    }
    getCTX()
    {
        return Scene._ctx;
    }

    getCanvasWidth()
    {
        return Scene._canvasWidth;
    }
    getCanvasHeight()
    {
        return Scene._canvasHeight;
    }
}