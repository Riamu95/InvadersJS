class Scene 
{
    static _canvas = document.querySelector('canvas');
    static _ctx = Scene._canvas.getContext('2d');

    constructor()
    {
        this._scenes = null;
       
        this._canvasWidth = Scene._canvas.width;
        this._canvasHeight = Scene._canvas.height;
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