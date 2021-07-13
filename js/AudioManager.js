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
        this._sounds.set(id, new Howl({src : [src],  "loop" : loop }));
    }

    playSound(sound)
    {
       this._sounds.get(sound).play();
    }

    playEngine()
    {
        if(!AudioManager.m_engineToggle)
        {
            this._sounds.get("engine").fade(0,0.25,1000);
            this.playSound("engine");
            AudioManager.m_engineToggle = true;
        }
    }

    stopEngine()
    {
        this._sounds.get("engine").fade(0.25,0,1000);
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