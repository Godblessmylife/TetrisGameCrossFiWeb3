// Basic Snake game for CrossFi
let canvas, ctx;
let snake, direction, food, score, interval;
const cellSize = 20;

function initSnakeGame() {
    canvas = document.getElementById('snakeCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    document.addEventListener('keydown', keyDown);
}

function startSnake() {
    snake = [{x:10, y:10}];
    direction = {x:1, y:0};
    food = {x:5, y:5};
    score = 0;
    if (interval) clearInterval(interval);
    interval = setInterval(gameLoop, 100);
}

function keyDown(e) {
    if (e.key === 'ArrowUp' && direction.y === 0) direction = {x:0, y:-1};
    if (e.key === 'ArrowDown' && direction.y === 0) direction = {x:0, y:1};
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = {x:-1, y:0};
    if (e.key === 'ArrowRight' && direction.x === 0) direction = {x:1, y:0};
}

function gameLoop() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    if (head.x < 0 || head.x >= canvas.width/cellSize || head.y < 0 || head.y >= canvas.height/cellSize || snake.some(s => s.x === head.x && s.y === head.y)) {
        endSnake();
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = {x: Math.floor(Math.random()*canvas.width/cellSize), y: Math.floor(Math.random()*canvas.height/cellSize)};
    } else {
        snake.pop();
    }
    draw();
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0f0';
    snake.forEach(s => ctx.fillRect(s.x*cellSize, s.y*cellSize, cellSize-1, cellSize-1));
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x*cellSize, food.y*cellSize, cellSize-1, cellSize-1);
}

function endSnake() {
    clearInterval(interval);
    document.getElementById('snakeScore').innerText = 'Score: '+score;
    sendSnakeScore();
}

function sendSnakeScore() {
    const tg = window.Telegram ? window.Telegram.WebApp : {initDataUnsafe:null};
    fetch('/datasnake', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({score: score, from_tg: tg.initDataUnsafe})
    }).catch(err => console.error(err));
}

window.addEventListener('load', initSnakeGame);
