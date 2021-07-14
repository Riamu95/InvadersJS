class AudioManager
{
    static m_instance = null;
    static m_engineToggle = false;
   
    constructor()
    {
        if(AudioManager.m_instance == null)
        {
            AudioManager.m_instance = this;
        }

        this._sounds = new Map();
        this._pos = new Vec2(0,0);
    }

    static getInstance()
    {
        if(AudioManager.m_instance == null)
        {
            new AudioManager();
        }

        return AudioManager.m_instance;
    }


    addSound(id, src, ...properties)
    {
        let { loop } = properties[0];
        let  volume  = properties?.[1];
        this._sounds.set(id, new Howl({src : [src],  "loop" : loop, "volume" : volume.volume}));
    }

    playSound(sound, pos = this._pos)
    {
       let id = this._sounds.get(sound).play();
       this._sounds.get(sound).pos(pos.x
        , pos.y, -0.5, id);
    }

    setListenerPos(pos)
    {
        this._pos = pos;
    }

    playEngine(pos)
    {
        if(!AudioManager.m_engineToggle)
        {
            this._sounds.get("engine").fade(0,0.5,1000);
            this.playSound("engine",pos);
            AudioManager.m_engineToggle = true;
        }
    }

    stopEngine()
    {
        this._sounds.get("engine").fade(0.5,0,1000);
    }

    stopSound(sound)
    {
       this._sounds.get(sound).stop();
    }

    addBackgroundSound(sound, type)
    {
        let soundAffect = this._sounds.get(sound);
         soundAffect.once(type, () => 
        {
            soundAffect.play();
        });
    }

    getSound(sound)
    {
        return this._sounds.get(sound);
    }
 
}