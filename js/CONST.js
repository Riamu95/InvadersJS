const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const background = document.getElementById('background');
const playerIMG = document.getElementById('player');
const BOMBER_IMAGE = document.getElementById('bomber');
const enemyMinionImage = document.getElementById('enemyMinion');
const heart = document.getElementById('heart');
const healthBar = document.getElementById('healthBar');
const healthValue = document.getElementById('healthValue');
const BLACKHOLE_IMAGE = document.getElementById('blackhole');
const ASTEROID_IMAGE = document.getElementById('asteroid');
const BOMBER_BULLET_IMAGE = document.getElementById('bomberBullet');
const PLAYER_BULLET_IMAGE = document.getElementById('playerBullet');
const EXPLOSION_IMAGE = document.getElementById('explosion');

const BULLET_EXPLOSION_IMAGE = document.getElementById('bulletExplosion');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WORLD_HEIGHT = 3376;
const WORLD_WIDTH = 6000;

const CANVAS_MIN = 0;

const SPAWN_POINTS = 37;

const MINION_SPAWN_XOFFSET = 250;
const MINION_SPAWN_YOFFSET = 138;

const HEART_POS = new Vec2(0,0);
const HEART_SIZE = new Vec2(100,100);

const HEALTHBAR_POS = new Vec2(0,0);
const HEALTHBAR_SIZE = new Vec2(300,100);

const HEALTHVALUE_POS = new Vec2(0,0);
const HEALTHVALUE_SIZE = new Vec2(296,96);


