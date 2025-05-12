 // Game Configuration
        const GRID_SIZE = 20;
        const CANVAS_SIZE = 400;
        const ROWS = CANVAS_SIZE / GRID_SIZE;
        const COLS = CANVAS_SIZE / GRID_SIZE;

        // Game State
        let snake = {
            x: GRID_SIZE * 5,
            y: GRID_SIZE * 5,
            dx: GRID_SIZE,
            dy: 0,
            cells: [],
            maxCells: 4
        };

        let food = { x: 0, y: 0 };
        let score = 0;
        let gameOver = false;
        let gameLoopId = null;
        let isPaused = false;

        // Canvas Setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const startButton = document.getElementById('startButton');
        const pauseButton = document.getElementById('pauseButton');
        const resetButton = document.getElementById('resetButton');

        // Initialize Canvas
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        // Place Food Randomly
        function placeFood() {
            food.x = Math.floor(Math.random() * COLS) * GRID_SIZE;
            food.y = Math.floor(Math.random() * ROWS) * GRID_SIZE;
        }

        // Game Update Function
        function update() {
            if (gameOver || isPaused) return;

            // Move snake
            snake.x += snake.dx;
            snake.y += snake.dy;

            // Add current position to snake cells
            snake.cells.unshift({x: snake.x, y: snake.y});

            // Remove cells if snake is longer than max
            if (snake.cells.length > snake.maxCells) {
                snake.cells.pop();
            }

            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw snake
            ctx.fillStyle = '#0f0';
            snake.cells.forEach((cell, index) => {
                ctx.fillRect(cell.x, cell.y, GRID_SIZE-1, GRID_SIZE-1);
                
                // Check for self-collision
                for (let i = index + 1; i < snake.cells.length; i++) {
                    if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                        gameOver = true;
                        showGameOverModal();
                    }
                }
            });

            // Draw food
            ctx.fillStyle = '#f00';
            ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);

            // Eat food
            if (snake.x === food.x && snake.y === food.y) {
                snake.maxCells++;
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                placeFood();
            }

            // Wall collision
            if (
                snake.x < 0 || 
                snake.x >= canvas.width || 
                snake.y < 0 || 
                snake.y >= canvas.height
            ) {
                gameOver = true;
                showGameOverModal();
            }
        }

        // Show Game Over Modal
        function showGameOverModal() {
            clearInterval(gameLoopId);
            
            const modal = new bootstrap.Modal(document.getElementById('gameOverModal'), {
                keyboard: false
            });
            
            document.getElementById('finalScoreDisplay').textContent = score;
            modal.show();
        }

        // Direction Controls
        function changeDirection(e) {
            if (gameOver || isPaused) return;

            switch(e.code) {
                case 'ArrowUp':
                    if (snake.dy === 0) {
                        snake.dx = 0;
                        snake.dy = -GRID_SIZE;
                    }
                    break;
                case 'ArrowDown':
                    if (snake.dy === 0) {
                        snake.dx = 0;
                        snake.dy = GRID_SIZE;
                    }
                    break;
                case 'ArrowLeft':
                    if (snake.dx === 0) {
                        snake.dx = -GRID_SIZE;
                        snake.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (snake.dx === 0) {
                        snake.dx = GRID_SIZE;
                        snake.dy = 0;
                    }
                    break;
            }
        }

        // Start Game
        function startGame() {
            // Reset game state
            snake = {
                x: GRID_SIZE * 5,
                y: GRID_SIZE * 5,
                dx: GRID_SIZE,
                dy: 0,
                cells: [],
                maxCells: 4
            };
            score = 0;
            gameOver = false;
            isPaused = false;
            scoreDisplay.textContent = `Score: ${score}`;
            placeFood();

            // Clear any existing game loop
            if (gameLoopId) {
                clearInterval(gameLoopId);
            }

            // Start new game loop
            gameLoopId = setInterval(update, 100);
        }

        // Pause Game
        function pauseGame() {
            isPaused = !isPaused;
            pauseButton.innerHTML = isPaused 
                ? '<i class="bi bi-play-fill"></i> Resume' 
                : '<i class="bi bi-pause-fill"></i> Pause';
        }

        // Event Listeners
        document.addEventListener('keydown', changeDirection);
        startButton.addEventListener('click', startGame);
        pauseButton.addEventListener('click', pauseGame);
        resetButton.addEventListener('click', startGame);

        // Initial setup
        placeFood();
