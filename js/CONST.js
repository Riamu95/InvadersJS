const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const background = document.getElementById('background');
const playerIMG = document.getElementById('player');
const enemyOne = document.getElementById('enemyOne');
const enemyMinionImage = document.getElementById('enemyMinion');
const hearth = document.getElementById('heart');
const healthBar = document.getElementById('healthBar');
const healthValue = document.getElementById('healthValue');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WORLD_HEIGHT = 3376;
const WORLD_WIDTH = 6000;
const CANVAS_MIN = 0;
const ENEMY_COUNT = 5;
const MINION_COUNT = 5;
const MINION_FLOCK_COUNT = 5;

const HEARTH_POS = new Vec2(0,0);
const HEARTH_SIZE = new Vec2(100,100);

const HEALTHBAR_POS = new Vec2(0,0);
const HEALTHBAR_SIZE = new Vec2(300,100);

const HEALTHVALUE_POS = new Vec2(0,0);
const HEALTHVALUE_SIZE = new Vec2(296,96);