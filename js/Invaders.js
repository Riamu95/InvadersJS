import { SceneManager } from './SceneManager.js';

let sceneManager = new SceneManager();

let lastRender = 0;

function update(timestamp)
{
    sceneManager.getScene(0).getCTX().clearRect(0,0, sceneManager.getScene(0).getCanvasWidth(),sceneManager.getScene(0).getCanvasHeight());
    
    let dt = timestamp - lastRender;
    
    if(!sceneManager.getScenes().length == 0)
    {
        sceneManager.getScene(0).update(dt);
        sceneManager.getScene(0).draw();
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
    