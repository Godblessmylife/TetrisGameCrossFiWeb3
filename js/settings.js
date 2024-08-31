var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 1440;


// var CANVAS_WIDTH = 795;
// var CANVAS_HEIGHT = 1280;


var CANVAS_WIDTH_HALF = CANVAS_WIDTH * 0.5;
var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT * 0.5;

var EDGEBOARD_X = 50;
var EDGEBOARD_Y = 130;

var FPS = 30;

var FPS_TIME = 1 / FPS;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "cosmic_cuberegular";

var OUTLINE_TEXT = 4;

var CELL_OFFSET = {x: -9, y: -9};

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 1;
var STATE_GAME = 3;

var CONFIRMATION_EXIT = 0;
var CONFIRMATION_RESET = 1;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END = 5;
var ON_TWEEN_ENDED = 6;
var ON_BUT_NO_DOWN = 7;
var ON_BUT_YES_DOWN = 8;


var BLOCK_TIME_SPAWN_RANGE = {min: 500, max: 10000};

var LEFT = 0;
var RIGHT = 1;
var UP = 2;
var DOWN = 3;

var GRID_Y = 20;

var GRID_X = 10;

var SHOW_CELL = false;

var TIME_REFRESH_DIRECTION = 0.2;

var CELL_DESTROY_MS = 10;

var DELAY_CELL_DESTROY_MS = 20;

var DELAY_LINE_DOWN = 10;

var LINE_DOWN_TIME = 20;

var SHOW_FPS = false;

var TIME_REFRESH_GAME = 1;

var TIME_REFRESH_GAME_KEY_DOWN;

var GRID_X_HALF = Math.floor(GRID_X * 0.5);
var CELL_SIZE = 50;

var START_GRID_X = CANVAS_WIDTH_HALF - (CELL_SIZE * GRID_X_HALF) - EDGEBOARD_X * 2.35;
var START_GRID_Y = CANVAS_HEIGHT_HALF - (GRID_Y * GRID_Y);

var BLOCKS_TYPE = [
    [
        [0, 1, 0],
        [1, 1, 1]
    ], [
        [0, 0, 1],
        [1, 1, 1]
    ], [
        [1, 0, 0],
        [1, 1, 1]
    ], [
        [0, 1, 1],
        [1, 1, 0]
    ], [
        [1, 1, 0],
        [0, 1, 1]
    ], [
        [1],
        [1],
        [1],
        [1]
    ], [
        [1, 1],
        [1, 1]
    ]];


var ENABLE_FULLSCREEN = false;
var ENABLE_CHECK_ORIENTATION;