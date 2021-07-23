import { StartScene } from "./StartScene.js";

export {SceneManager};

class SceneManager 
{
    constructor()
    {
        this._scenes = [];
        this._state = true;
        this.init();
    }

    init()
    {
        let startScene = new StartScene(this._scenes);
        startScene.init();
        this._scenes.push(startScene);
    }

    getScenes()
    {
        return this._scenes;
    }

    getScene(i)
    {
        return this._scenes[i];
    }

    getState()
    {
        return this._state;
    }

    setState(val)
    {
        this._state = val;
    }

    NextScene()
    {
        this._scenes.shift();
    }
}