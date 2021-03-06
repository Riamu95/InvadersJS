import { Vec2 } from "./Vec2.js";
export { WaveManager };

const WaveManager = function(worldWidth,worldHeight)
{
    this._npcList = new Map();
    this._spawnPoints = new Map();
        //minion,flock,bomber,asteroid,black hole, power up
    this._npcList.set(1,[5,3,1,9,1,6,10]);
    this._npcList.set(2,[5,3,1,5,0,3,15]);
    this._npcList.set(3,[5,5,2,5,2,3,20]);
    this._npcList.set(4,[5,5,5,5,2,5,20]);
    this._npcList.set(5,[5,5,5,5,3,5,15]);
    this._npcList.set(6,[1,4]);

    this._MINION_COUNT = 0;
    this._MINION_FLOCK_COUNT = 0;
    this._BLACK_HOLE_COUNT = 0;
    this._ASTEROID_COUNT = 0;
    this._BOMBER_COUNT = 0;
    this._POWER_UP_COUNT = 0;
    this._BOSS_COUNT = 0;
    this._AMMO_COUNT = 2;
    this._SHIELD_NODE_COUNT = 0;
    this._AMMO_INTERVAL_TIMER = 0;
    this._wave = 6;
    this.index = 0;
    this._finalWave = 6;

    for (let x = 0; x < worldWidth/500; x++)
    {
        this._spawnPoints.set(this.index,[false , new Vec2(x * 500, -100)]);
        this.index++;
    }

    for(let y = 0; y < worldHeight/500; y++)
    {
        this._spawnPoints.set(this.index,[false , new Vec2(worldWidth + 100, y * 500)]);
        this.index++;
    }

    for (let x = worldWidth/500; x > 0; x--)
    {
        this._spawnPoints.set(this.index,[false , new Vec2(x * 500, worldHeight + 100)]);
        this.index++;
    }

    for(let y = worldHeight/500; y > 0 ; y--)
    {
        this._spawnPoints.set(this.index,[false , new Vec2(- 100, y * 500)]);
        this.index++;
    }
}

WaveManager.prototype.setNPCCount = function()
{
    [this._MINION_COUNT,this._MINION_FLOCK_COUNT,this._BOMBER_COUNT,this._ASTEROID_COUNT,this._BLACK_HOLE_COUNT,this._AMMO_INTERVAL_TIMER] = this._npcList.get(this._wave);
}

WaveManager.prototype.nextWave = function()
{   
    if(this._wave > 1)
    {
        for(let key of this._spawnPoints.values())
        {
            key[0] = false;
        }
    }

    if (this._wave < this._finalWave) 
    {
        this._wave++;
        [this._MINION_COUNT,this._MINION_FLOCK_COUNT,this._BOMBER_COUNT,this._ASTEROID_COUNT,this._BLACK_HOLE_COUNT,this._POWER_UP_COUNT] = this._npcList.get(this._wave);
    }

    if(this._finalWave == this._finalWave)
    {
        [this._BOSS_COUNT,this._SHIELD_NODE_COUNT] = this._npcList.get(this._wave);
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

WaveManager.prototype.getBossCount =  function()
{
    return this._BOSS_COUNT;
}

WaveManager.prototype.getFlockCount =  function()
{
    return this._MINION_FLOCK_COUNT;
}

WaveManager.prototype.getAsteroidCount =  function()
{
    return this._ASTEROID_COUNT;
}

WaveManager.prototype.getAmmoIntervalTimer =  function()
{
    return this._AMMO_INTERVAL_TIMER;
}

WaveManager.prototype.getAmmoCount =  function()
{
    return this._AMMO_COUNT;
}

WaveManager.prototype.getBlackHoleCount = function() 
{
    return this._BLACK_HOLE_COUNT;
}

WaveManager.prototype.getBomberCount =  function()
{
    return this._BOMBER_COUNT;
}

WaveManager.prototype.getPowerUpCount =  function()
{
    return this._POWER_UP_COUNT;
}

WaveManager.prototype.getShieldNodeCount =  function()
{
    return this._SHIELD_NODE_COUNT;
}

WaveManager.prototype.getSpawnPoint = function(i  =  Math.trunc(Math.random() * 32))
{
    while(this._spawnPoints.get(i)[0] == true)
    {
        i = Math.trunc(Math.random() * 32);

        if(this._spawnPoints.get(i)[0] == false)
        {
            break;
        }
    }
    
    this._spawnPoints.get(i)[0] = true;
    return this._spawnPoints.get(i)[1];
}

