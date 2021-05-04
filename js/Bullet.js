class Bullet {
    constructor(pos,radius,_angle)
    {
        this._circle = new Circle(pos, radius);
        this.m_angle = _angle;
        this._color = 'Red';
        this._velocity = new Vec2(0,0);
    }

    move(dt)
    {
        this._velocity.x = Math.cos(this.m_angle) * dt;
        this._velocity.y = Math.sin(this.m_angle) * dt;
        this._circle._pos.x += this._velocity.x;
        this._circle._pos.y += this._velocity.y;
    }

    draw(cameraPos)
    {
        c.save();
        c.beginPath();
        c.translate(this._circle._pos.x - cameraPos.x, this._circle._pos.y - cameraPos.y);
        c.arc(0, 0, this._circle._radius, 0, 2 * Math.PI);
        c.fillStyle = this._color;
        c.fill();
        c.closePath();
        c.restore();
    }

    get getVel()
    {
        return this._velocity;
    }

    get getPos()
    {
        return this._pos;
    }

    get getCircle()
    {
        return this._circle;
    }
}