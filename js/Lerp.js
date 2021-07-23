export { Lerp };
class Lerp 
{
    constructor()
    {

    }

    static LerpFloat(original, destination,percentage)
    {
        let float = original + ((destination - original) * percentage);
        return float;
    }

    static LerpVec(original, destination,percentage)
    {
        let x = original.x + ((destination.x - original.x) * percentage);
        let y = original.y + ((destination.y - original.y) * percentage);
        return new Vec2(x,y);
    }
}