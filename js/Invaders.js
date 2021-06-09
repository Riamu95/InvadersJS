let sceneManager = new SceneManager();

let lastRender = 0;

function update(timestamp)
{
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    let dt = timestamp - lastRender;
    
    if(!sceneManager.getScenes().length == 0)
    {
        sceneManager.getScene(0).update(dt);
        sceneManager.getScene(0).draw(ctx);
    }
    else
    {
        //break;
    }
    
    if(sceneManager.getScenes().length > 1)
    {
        sceneManager.NextScene();
    }

    lastRender = timestamp;
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
    