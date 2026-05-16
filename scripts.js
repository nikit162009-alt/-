const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

let birdTop = 250;
let gravity = 2.5;
let velocity = 0;
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let gameLoopId, pipeGeneratorId;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!isGameStarted && !isGameOver) {
            startGame();
        } else if (!isGameOver) {
            velocity = -6; 
        }
    }
});

function startGame() {
    isGameStarted = true;
    document.getElementById('start-message').style.display = 'none';
    gameLoopId = requestAnimationFrame(updateGame);
    pipeGeneratorId = setInterval(createPipes, 2000);
}

function updateGame() {
    if (isGameOver) return;
    velocity += 0.25;
    birdTop += velocity;
    bird.style.top = birdTop + 'px';

    if (birdTop <= 0 || birdTop >= 576) {
        gameOver();
        return;
    }
    const pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        let pipeLeft = parseFloat(pipe.style.left);
        pipeLeft -= 2; // Скорость движения труб влево
        pipe.style.left = pipeLeft + 'px';

        // Удаление труб за экраном
        if (pipeLeft < -60) {
            pipe.remove();
            return;
        }

        // Логика начисления очков (только по верхней трубе, чтобы не дублировать)
        if (!pipe.dataset.passed && pipe.classList.contains('top-pipe') && pipeLeft < 50) {
            pipe.dataset.passed = 'true';
            score++;
            scoreDisplay.textContent = score;
        }

        // Проверка столкновения
        if (checkCollision(bird, pipe)) {
            gameOver();
        }
    });
    gameLoopId = requestAnimationFrame(updateGame);
}

function createPipes() {
    if (isGameOver) return;

    const gap = 130; 
    const minHeight = 50;
    const maxHeight = 600 - gap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    const bottomHeight = 600 - topHeight - gap;

    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe', 'top-pipe');
    topPipe.style.height = topHeight + 'px';
    topPipe.style.top = '0px';
    topPipe.style.left = '400px';

    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.height = bottomHeight + 'px';
    bottomPipe.style.bottom = '0px';
    bottomPipe.style.left = '400px';

    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);
}

function checkCollision(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();

    return !(
        r1.top > r2.bottom ||
        r1.bottom < r2.top ||
        r1.right < r2.left ||
        r1.left > r2.right
    );
}
function gameOver() {
    isGameOver = true;
    clearInterval(pipeGeneratorId);
    cancelAnimationFrame(gameLoopId);
    alert(`Игра окончена! Ваши очки: ${score}`);
}