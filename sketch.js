let player;
let floors = [];
let canyons = [];
let enemies = [];
let score = 0;
let height = 750; // Высота игрового поля
let width = 2000; // Увеличенная ширина игрового поля
let bgColor; // Цвет фона
let cameraOffsetX = 0; // Сдвиг камеры для следования за игроком
let gameState = "menu"; // Состояние игры: menu, play, dead
let isPaused = false;  // Флаг паузы
let victory = false; // Флаг победы
let victoryTime = 0; // Время победы
let death = new Audio('death.mp3');
let defeat = new Audio('defeat.mp3');
let beginning = new Audio('beginning.mp3');

function setup() {
    createCanvas(width, height);
    bgColor = color(50, 0, 150); // Устанавливаем интересный фон (темно-синий)
    player = new Player(100, height - 150, 50, 50); // Начальная позиция игрока
    floors.push(new Floor(0, height - 20, width, 20));
}

function draw() {
    if (gameState === "menu") {
        displayMenu();
    } else {
        background(bgColor); // Устанавливаем фон, когда игра не в меню
        

        if (isPaused) {
            displayPause(); // Показать экран паузы
        } else {
            if (player.dead) {
                player.displayDeath(); // Показать эффект смерти
            } else {
                player.update();
                player.checkCanyon(canyons);
                player.checkEnemy(enemies);
            }

            cameraControl(); // Управление камерой

            for (let floor of floors) {
                floor.draw();
            }
            for (let canyon of canyons) {
                canyon.draw();
            }
            for (let enemy of enemies) {
                enemy.update();
                enemy.draw(); // Обновлённая отрисовка врагов
            }

            player.draw();
            
            // Проверка на победу
            if (enemies.length === 0) {
                victory = true;
                victoryTime = millis(); // Запоминаем текущее время
                gameState = "menu"; // Переход к экрану победы
            }

            // Отображение счета
            fill(255);
            textSize(20);
            text("Счет: " + score, 40, 30);
        }
    }
}

function displayMenu() {
     // Убираем меню, когда помощь активна
    if (gameState === "help") return;
    
    background(0); // Чёрный фон для меню
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Forsaken", width / 2, height / 2 - 40);
    textSize(20);
    text("Начать", width / 2, height / 2);
    text("Выйти", width / 2, height / 2 + 40);
    //text("Помощь", width / 2, height / 2 + 40);
}

function displayVictory() {
    background(0, 150, 0); // Зеленый фон для экрана победы
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Победа!", width / 2, height / 2 - 40);
    textSize(20);
    text("Все враги уничтожены!", width / 2, height / 2);
    text("Вы будете перенесены в главное меню через 8 секунд...", width / 2, height / 2 + 40);

    // Проверка времени, чтобы вернуться в меню
    if (millis() - victoryTime > 8000) { // 8000 мс = 8 сек
        beginning.play();
        gameState = "menu"; // Возвращаемся в меню
        score = 0; // Обнуляем счёт
        enemies = []; // Сбрасываем врагов
    }
}

function displayPause() {
    background(50, 50, 50, 200); // Полупрозрачный фон для паузы
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Управление:", width / 2, height / 2 - 30);
    textSize(20);
    text("Нажмите 'H' чтобы продолжить", width / 2, height / 2);
    text("Нажмите 'Q' чтобы перейти в главное меню", width / 2, height / 2 + 30);
    text("Пауза", width / 2, height / 2 - 90);
    text("A - движение влево", width / 2, height / 2 + 48);
    text("D - движение вправо", width / 2, height / 2 + 68);
    text("SPACE - прыжок", width / 2, height / 2 + 90);
    text("1 - 30 FPS", width / 2, height / 2 + 120);
    text("2 - 45 FPS", width / 2, height / 2 + 140);
    text("3 - 120 FPS", width / 2, height / 2 + 160);
    text("4 - 240 FPS", width / 2, height / 2 + 180);
    text("Левый/Правый курсов - движение камеры", width / 2, height / 2 + 200);
    text("Лор - ОТСУТСТВУЕТ. Только МРАК", width / 2, height / 2 + 220);
}

function changeFrameRate(rate) {
    if (rate >= 15 && rate <= 240) {
        frameRate(rate); // Изменяем частоту кадров
    }
}

function keyPressed() {
    if (gameState === "menu") {
        if (keyCode === ENTER) {
            gameState = "play"; // Начинаем игру
            beginning.play();
            generateCanyons();
            generateEnemies();
        }
        if (keyCode === ESCAPE) {
            noLoop(); // Остановим цикл отрисовки
            exit(); // Закрыть игру
        }
        if (keyCode === 71) { // 'G' для помощи
            showHelp();
        }
    } else if (gameState === "play") {
        if (keyCode === 72) { // 'H' для паузы
            isPaused = !isPaused; // Переключаем флаг паузы
        }
        if (keyCode === 81) { // 'Q' для возврата в меню
            gameState = "menu"; // Возвращаемся в меню
            score = 0; // Обнуляем счёт
        }
        if (keyCode === 32 && player.grounded) { // Пробел для прыжка
            player.speedGravity = -15; // Прыжок
            player.grounded = false;
        }
    }
}

function showHelp() {
    // Показать информацию по управлению
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Помощь", width / 2, height / 2 - 40);
    textSize(20);
    text("Управление:", width / 2, height / 2);
    text("Левый курсор - движение влево", width / 2, height / 2 + 45);
    text("Правый курсор - движение вправо", width / 2, height / 2 + 60);
    text("Пробел - прыжок", width / 2, height / 2 + 90);
    text("H - пауза", width / 2, height / 2 + 120);
    text("Q - вернуться в меню", width / 2, height / 2 + 150);
}

function keyReleased() {
    if (keyCode === 49) { // '1'
        changeFrameRate(30);
    } else if (keyCode === 50) { // '2'
        changeFrameRate(45);
    } else if (keyCode === 51) { // '3'
        changeFrameRate(120);
    } else if (keyCode === 52) { // '4'
        changeFrameRate(240);
    }
      else if (keyCode === 48) { // '0'
        changeFrameRate(60);
    }
}

function showSettings() {
    // Реализуйте интерфейс для настройки игры
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Настройки", width / 2, height / 2 - 40);
    textSize(20);
    text("Настройки игры будут здесь...", width / 2, height / 2);
}

function cameraControl() {
    // Следует за игроком, если он достигнет середины экрана
    if (player.x > width / 2) {
        cameraOffsetX = player.x - width / 2;
    }
}

// Генерация каньонов
function generateCanyons() {
    canyons = []; // Сброс каньонов
    for (let i = 0; i < 8; i++) {
        let canyonWidth = random(25, 100);
        let canyonX = i * (canyonWidth + 100) + 300; // добавляем зазор между каньонами
        canyons.push(new Canyon(canyonX, height - 20, canyonWidth, 20));
    }
}

// Генерация врагов
function generateEnemies() {
    enemies = []; // Сброс врагов
    for (let i = 0; i < 6; i++) {
        enemies.push(new Enemy(random(200, 800), height - 70, 40, 40));
    }
}

class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedGravity = 0;
        this.grounded = true;
        this.dead = false;
        this.animationFrame = 0; // Для анимации
        this.initialPosition = { x: x, y: y }; // Сохраняем начальную позицию
        this.deathTime = 0; // Время смерти
    }

    update() {
        if (this.dead) return; // Игрок мертв, пропускаем обновление

        this.y += this.speedGravity;

        // Обрабатываем управление игроком с WAD
        if (keyIsDown(65)) { // A
            this.x -= 5;
            this.animationFrame = (this.animationFrame + 1) % 4; // Анимация при движении влево
        }
        if (keyIsDown(68)) { // D
            this.x += 5;
            this.animationFrame = (this.animationFrame + 1) % 4; // Анимация при движении вправо
        }

        this.speedGravity += 0.8; // Гравитация

        // Остановка на полу
        if (this.y + this.height >= height - 20) {
            this.y = height - 20 - this.height;
            this.speedGravity = 0;
            this.grounded = true;
        }
    }

    draw() {
        if (this.dead) {
            fill(180); // Серый цвет при смерти
        } else {
            fill(0); // Цвет игрока черный
        }
        rect(this.x - cameraOffsetX, this.y, this.width, this.height); // Обновленное положение с учетом камеры
        
        // Рисуем глаза и рот
        fill(255);
        let eyeOffsetX = this.width / 4;
        let eyeOffsetY = this.height / 4;
        
        let eyeDirection = keyIsDown(65) ? -5 : keyIsDown(68) ? 5 : 0;

        // Глаза
        rect(this.x + eyeOffsetX - cameraOffsetX + eyeDirection, this.y + eyeOffsetY, 10, 10); // Левый глаз
        rect(this.x + 3 * eyeOffsetX - cameraOffsetX + eyeDirection, this.y + eyeOffsetY, 10, 10); // Правый глаз
        // Рот
        rect(this.x + eyeOffsetX - cameraOffsetX, this.y + eyeOffsetY + 20, 20, 5); // Рот
    }

    displayDeath() {
        this.dead = true; // Устанавливаем состояние мёртвым
        this.deathTime += deltaTime; // Увеличиваем время смерти
        
        fill(0, 0, 0, 100); // Полупрозрачный черный цвет для эффекта
        rect(this.x - cameraOffsetX, this.y, this.width, this.height);
        
        if (this.deathTime >= 1000) { // Если прошло больше 1 секунды
            this.respawn(); // Возвращаем игрока
        }
    }

    checkCanyon(canyons) {
        for (let canyon of canyons) {
            if (this.y + this.height >= canyon.y &&
                this.x + this.width > canyon.x &&
                this.x < canyon.x + canyon.width) {
                this.grounded = false;
                this.dead = true; // Умирает при столкновении с каньоном
                death.play();
                this.speedGravity = 2; // Замедляем движение
            }
        }
    }

 checkEnemy(enemies) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (this.checkCollision(enemies[i])) {
                // Если игрок прыгает и касается противника сверху, убираем врага
                if (this.speedGravity > 0 && this.y + this.height < enemies[i].y + 10) {
                    enemies.splice(i, 1); // Уничтожаем врага
                    defeat.play();
                    score += 100; // Добавляем 100 очков
                } else {
                    this.dead = true; // Игрок умирает
                }
            }
        }
    }

    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height> enemy.y;
    }

respawn() {
        this.x = this.initialPosition.x; // Возвращаем игрока в начальное положение
        this.y = this.initialPosition.y;
        score = 0; // Обнуляем счёт
        this.dead = false; // Возвращаем игрока к жизни
        this.deathTime = 0; // Сбрасываем время смерти
        generateCanyons(); // Генерируем новые каньоны
        generateEnemies(); // Генерируем новых врагов
    }
}

// Класс платформы
class Floor {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        fill(180);
        rect(this.x, this.y, this.width, this.height);
    }
}

// Класс каньона
class Canyon {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color(150, 0, 0); // Начальный цвет каньона
    }

    draw() {
        fill(this.color);
        rect(this.x, this.y, this.width, this.height);
    }
}

// Класс врага
class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 4; // Скорость врага
        this.animationFrame = 0; // Для анимации
    }

    update() {
        this.x += this.speed;
        
        // Изменяем направление движения врага, когда он достигает края
        if (this.x > width - this.width || this.x < 0) {
            this.speed *= -1; // Меняем направление
            this.animationFrame = (this.animationFrame + 1) % 2; // Анимация врага
        }
    }

    draw() {
        fill(255, 0, 0); // Цвет врага
        rect(this.x - cameraOffsetX, this.y, this.width, this.height); // Учитываем смещение камеры
        
        // Глаза
        fill(255);
        let eyeOffsetX = this.width / 4;
        let eyeOffsetY = this.height / 4;

        // Глаза
        rect(this.x + eyeOffsetX - cameraOffsetX, this.y + eyeOffsetY, 10, 10); // Левый глаз
        rect(this.x + 3 * eyeOffsetX - cameraOffsetX, this.y + eyeOffsetY, 10, 10); // Правый глаз
        
        // Рот
        fill(0);
        rect(this.x + eyeOffsetX - cameraOffsetX, this.y + eyeOffsetY + 20, 20, 5); // Рот
    }
}