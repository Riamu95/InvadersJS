const WaveManager = function()
{
    this._npcList = new Map();
        //minion,flock,bomber,asteroid,black hole
    this._npcList.set(1,[5,3,0,0,0]);
    this._npcList.set(2,[5,3,1,5,0]);
    this._npcList.set(3,[5,5,2,5,2]);
    this._npcList.set(4,[5,5,5,5,2]);
    this._npcList.set(5,[5,5,5,5,3]);

    this._MINION_COUNT = 0;
    this._MINION_FLOCK_COUNT = 0;
    this._BLACK_HOLE_COUNT = 0;
    this._ASTEROID_COUNT = 0;
    this._BOMBER_COUNT = 0;
    
    this._wave = 0;
}

WaveManager.prototype.setNPCCount = function()
{
    [this._MINION_COUNT,this._MINION_FLOCK_COUNT,this._BOMBER_COUNT,this._ASTEROID_COUNT,this._BLACK_HOLE_COUNT] = this._npcList.get(this._wave);
}

WaveManager.prototype.nextWave = function()
{   
    if (this._wave < 5) 
    {
        this._wave++;
        [this._MINION_COUNT,this._MINION_FLOCK_COUNT,this._BOMBER_COUNT,this._ASTEROID_COUNT,this._BLACK_HOLE_COUNT] = this._npcList.get(this._wave);
    }
}

WaveManager.prototype.getWave =  function()
{
    return  this._wave;
}

WaveManager.prototype.getNPCList =  function()
{
    return this._npcList.get(this._wave);
}


WaveManager.prototype.getMininonCount =  function()
{
    return this._MINION_COUNT;
}

WaveManager.prototype.getFlockCount =  function()
{
    return this._MINION_FLOCK_COUNT;
}

WaveManager.prototype.getAsteroidCount =  function()
{
    return this._ASTEROID_COUNT;
}

WaveManager.prototype.getBlackHoleCount = function() {
    return this._BLACK_HOLE_COUNT;
}

WaveManager.prototype.getBomberCount =  function()
{
    return this._BOMBER_COUNT;
}

