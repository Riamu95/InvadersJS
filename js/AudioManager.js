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
        this.soundID = null;
        this.engineID = null;
    }

    static getInstance()
    {
        if(AudioManager.m_instance == null)
        {
            new AudioManager();
        }

        return AudioManager.m_instance;
    }

    update(pos)
    {

    }
    
 
    addSound(id, src, ...properties)
    {
        let { loop } = properties[0];
        let  volume  = properties?.[1];
        this._sounds.set(id, new Howl({src : [src],  "loop" : loop, "volume" : volume.volume}));
    }

    playSound(sound)
    {
        this.soundID =  this._sounds.get(sound).play();
          
    }
    
    playSpatialSound(sound, pos = this._pos)
    {
        this.soundID =  this._sounds.get(sound).play();
        this._sounds.get(sound).pos(pos.x, pos.y, -0.5, this.soundID);
        let panner = this._sounds.get(sound)._pannerAttr;
        panner.rolloffFactor = 0.99;
    }

    setListenerPos(pos)
    {
        this._pos = pos;
        this.engineID = this._sounds.get("engine");
    }

    playEngine()
    {
        if(!AudioManager.m_engineToggle)
        {
            this.engineID.fade(0,0.025,1000);
            this.engineID.play();
            AudioManager.m_engineToggle = true;
        }
    }
    getEngineID()
    {
        return this.engineID;
    }

    stopEngine()
    {
        this.engineID.fade(0.025,0,1000);
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