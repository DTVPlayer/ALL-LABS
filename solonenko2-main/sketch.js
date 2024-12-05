let player;
let floor;
let countCanyons = 2;
let canyons = [];
let collectables = [];
let enemies = [];
let eyeOpen = true; // Переменная для контроля анимации глаз
let blinkTimer = 0; // Таймер для отслеживания времени между морганиями

function setup() {
    createCanvas(800, 800);
    
    // Создание пола
    floor = {
        height: 200,
        color: color(10, 100, 10),
        draw: function() {
            fill(this.color);
            rect(0, height - this.height, width, this.height);
        }
    };

    // Создание каньонов
    for (let i = 0; i < countCanyons; i++) {
        canyons.push({
            x: 250 + i * 400,
            y: height - floor.height,
            width: 100,
            draw: function() {
                fill(100);
                rect(this.x, this.y, this.width, floor.height);
            }
        });
    }

    // Создание подбираемых объектов
    for (let i = 0; i < 5; i++) {
        collectables.push({
            x: random(width),
            y: random(height - floor.height - 50),
            size: 30,
            color: color(random(255), random(255), random(255)),
            draw: function() {
                fill(this.color);
                ellipse(this.x, this.y, this.size);
            }
        });
    }

    // Создание противников
    for (let i = 0; i < 3; i++) { // Создаем 3 статичных противника
        enemies.push({
            x: 300 + i * 200,
            y: height - floor.height - 50, // Позиция над полом
            width: 40,
            height: 40,
            draw: function() {
                fill(255, 0, 0); // Цвет противника
                rect(this.x, this.y, this.width, this.height);
            },
            checkCollision: function(player) {
                // Проверка на столкновение с игроком
                return (player.x < this.x + this.width &&
                        player.x + player.width > this.x &&
                        player.y < this.y + this.height &&
                        player.y + player.height > this.y);
            }
        });
    }

    // Создание игрока
    player = {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        speedGravity: -5,
        color: color(200, 150, 0),
        grounded: false,
        dead: false,
        draw: function() {
            fill(this.color);
            rect(this.x, this.y, this.width, this.height);
            this.drawEyes(); // Отрисовка глаз после отрисовки тела
        },
        drawEyes: function() {
            fill(0); // Цвет глаз
            let eyeWidth = 10;
            let eyeHeight = 10;
            let eyeYOffset = 15; // Смещение по Y для глаз
            let eyeXOffset = 12; // Смещение по X для глаз

            // Отрисовка глаз в зависимости от состояния
            if (this.dead) {
                fill(200); // Цвет закрытых глаз
                ellipse(this.x + eyeXOffset, this.y + eyeYOffset, eyeWidth, eyeHeight);
                ellipse(this.x + this.width - eyeXOffset, this.y + eyeYOffset, eyeWidth, eyeHeight);
            } else {
                // Рисуем открытые глаза с анимацией моргания
                if (eyeOpen) {
                    ellipse(this.x + eyeXOffset, this.y + eyeYOffset, eyeWidth, eyeHeight);
                    ellipse(this.x + this.width - eyeXOffset, this.y + eyeYOffset, eyeWidth, eyeHeight);
                } else {
                    fill(200); // Цвет закрытых глаз
                    ellipse(this.x + eyeXOffset, this.y + eyeYOffset, eyeWidth, eyeHeight);
                    ellipse(this.x + this.width - eyeXOffset, this.y + eyeYOffset, eyeWidth, eyeHeight);
                }
}
        },
        updateEyes: function() {
            blinkTimer++;
            if (blinkTimer > 60) { // Каждый 60 кадров мы будем моргать
                eyeOpen = !eyeOpen; // Меняем состояние глаз
                blinkTimer = 0; // Сбрасываем таймер
            }
        },
        gravity: function(floorHeight) {
            if (this.speedGravity < 15) {
                this.speedGravity++;
            }
            this.y += this.speedGravity;
            if (this.dead) {
                if (this.y > height) {
                    this.y = floorHeight;
                    this.x = 100;
                    this.dead = false;
                }
            } else if (this.y + this.height > height - floorHeight) {
                this.y = height - floorHeight - this.height; // Устанавливаем игрока на уровень пола
                this.grounded = true;
            } else {
                this.grounded = false;
            }
        },
        jump: function() {
            if (this.grounded) {
                this.speedGravity = -20;
                this.grounded = false;
            }
        },
        moveLeft: function() { this.x -= 4; },
        moveRight: function() { this.x += 4; },
        movement: function() {
            if (!this.dead) {
                if (this.grounded && keyIsDown(87)) this.jump(); // W для прыжка
                if (keyIsDown(68)) this.moveRight(); // D для движения вправо
                if (keyIsDown(65)) this.moveLeft(); // A для движения влево
            }
        },
        checkCanyon: function() {
            for (let i = 0; i < canyons.length; i++) {
                if (this.y + this.height >= height - floor.height && 
                    this.x + this.width > canyons[i].x && 
                    this.x < canyons[i].x + canyons[i].width) {
                    this.grounded = false;
                    this.dead = true;
                    this.speedGravity = 3; // Замедляем движение во время падения
                }
            }
        },
        checkEnemy: function(enemies) {
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].checkCollision(this)) {
                    // Если игрок прыгает и касается противника сверху, убираем противника
                    if (this.speedGravity < 0) {
                        enemies.splice(i, 1); // Уничтожаем противника
                    } else {
                        this.dead = true; // Умирает при столкновении
                    }
                }
            }
        }
    };

    // Инициализация других элементов
}

function draw() {
    background(255);
    floor.draw();
    
    for (let i = 0; i < canyons.length; i++) {
        canyons[i].draw();
    }

    for (let i = 0; i < collectables.length; i++) {
        collectables[i].draw();
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }

    player.updateEyes(); // Обновляем состояние глаз
    player.gravity(floor.height);
    player.movement();
    player.checkCanyon();
    player.checkEnemy(enemies); // Проверяем столкновения с противниками
    player.draw(); // Отрисовка игрока
}