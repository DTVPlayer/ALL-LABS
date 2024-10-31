
// The attributes of the player.
let player = {
    x: 200,
    y: 200,
    x_speed: 0,
    y_speed: 0,
    jump : true,
    height: 20,
    width: 20
}
//enemy
let EnPosX = 150;
let EnPosY = 160;
let EnSizeX = 15;
let EnSizeY = 15;
let EnState = enemyRight;
let EnDotLeft = 200;
let EnDotRight = 300;
let EnDirection = 1;
let EnRand;

// The status of the arrow keys
let keys = {
    right: false,
    left: false,
    up: false,
    };
// The friction and gravity to show realistic movements    
let gravity = 0.5;
let friction = 0.8;
// The number of platforms
let num = 3;
// The platforms
let platforms = [];
// Function to render the canvas

function rendercanvas(){
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, 270, 270);
}
// Function to render the player
function renderplayer(){
    ctx.fillStyle = "black";
    ctx.fillRect((player.x) - 20, (player.y) - 20, player.width, player.height);
}
// Function to create platforms
function createplat(){
    for(i = 0; i < num; i++) {
        platforms.push(
            {
                x: 75 * i,
                y: 175 + (30 * i),
                width: 110,
                height: 10
            }
        );
    }
}

function enemyMovement() {
    EnPosX += EnRand * EnDirection;
    if (EnPosX <= EnDotLeft) {
        EnPosX += EnDotLeft - EnPosX;
        EnDirection *= -1;
        EnState = "enemyRight";
    } else if (EnPosX >= EnDotRight) {
        EnPosX -= EnPosX - EnDotRight;
        EnDirection *= -1;
        EnState = "enemyLeft";
    }
}

// Function to render platforms
function renderplat(platform){
    ctx.fillStyle = "blue";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}
// This function will be called when a key on the keyboard is pressed
function keydown(e) {
    // 37 is the code for the left arrow key
    if(e.keyCode == 65) {
        keys.left = true;
    }
    // 37 is the code for the up arrow key
    if(e.keyCode == 87) { 
        if(player.jump == false) {
            player.y_speed = -7;
        }
    }
    // 39 is the code for the right arrow key
    if(e.keyCode == 68) {
        keys.right = true;
    }
}
// This function is called when the pressed key is released
function keyup(e) {
    if(e.keyCode == 65) {
        keys.left = false;
    }
    if(e.keyCode == 87) {
        if(player.y_speed < -2) {
        player.y_speed = -3;
        }
    }
    if(e.keyCode == 68) {
        keys.right = false;
    }
} 

function enemyLeft() {
    stroke("#000000");
    strokeWeight(2);
    fill("#5e29b1");
    rect(EnPosX - EnSizeX, EnPosY, EnSizeX * 2, EnSizeY * -2);
    fill("#ffffff");
    circle(EnPosX - EnSizeX, EnPosY - EnSizeY, 10); //left eye
}

function enemyRight() {
    stroke("#000000");
    strokeWeight(2);
    fill("#5e29b1");
    rect(EnPosX - EnSizeX, EnPosY, EnSizeX * 2, EnSizeY * -2);
    fill("#ffffff");
    circle(EnPosX + EnSizeX, EnPosY - EnSizeY, 10); //right eye
}

function loop() {
    // If the player is not jumping apply the effect of frictiom
    if(player.jump == false) {
        player.x_speed *= friction;
    } else {
        // If the player is in the air then apply the effect of gravity
        player.y_speed += gravity;
    }
    player.jump = true;
    // If the left key is pressed increase the relevant horizontal velocity
    if(keys.left) {
        player.x_speed = -2;
    }
    if(keys.right) {
        player.x_speed = 2;
    }
    // Updating the y and x coordinates of the player
    player.y += player.y_speed;
    player.x += player.x_speed;
    // A simple code that checks for collions with the platform
    let i = -1;
    if(platforms[0].x < player.x && player.x < platforms[0].x + platforms[0].width &&
    platforms[0].y < player.y && player.y < platforms[0].y + platforms[0].height){
        i = 0;
    }
    if(platforms[1].x < player.x && player.x < platforms[1].x + platforms[1].width &&
    platforms[1].y < player.y && player.y < platforms[1].y + platforms[1].height){
        i = 1;
    }
    if(platforms[2].x < player.x && player.x < platforms[2].x + platforms[2].width &&
    platforms[2].y < player.y && player.y < platforms[2].y + platforms[2].height){
        i = 2;
    }
        if (i > -1){
        player.jump = false;
        player.y = platforms[i].y;    
    }
    // Rendering the canvas, the player and the platforms
    rendercanvas();
    renderplayer();
    //for (let i = 0; i < platforms.length; i++)
        //renderplat(platforms[i]);
    platforms.forEach(function (element){
        renderplat(element);
    });
    if (player.y + player.h >= platforms.y) {
player.y = platforms.y - player.h;
player.y.speed = 0;
}
}

canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");
ctx.canvas.height = 260;
ctx.canvas.width = 260;
createplat();
// Adding the event listeners
document.addEventListener("keydown",keydown);
document.addEventListener("keyup",keyup);
setInterval(loop,22);

let collectables = [
    {
        position: { x: 50, y: 100 },
        color: 'red',
        size: 10,
        // Вложенная функция для отрисовки объекта
        draw: function(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
            context.fill();
        }
    },
    {
        position: { x: 150, y: 200 },
        color: 'blue',
        size: 15,
        draw: function(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
            context.fill();
        }
    },
    {
        position: { x: 250, y: 150 },
        color: 'green',
        size: 12,
        draw: function(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
            context.fill();
        }
    }
];

// Функция для отрисовки всех подбираемых объектов
function drawCollectables(context) {
    collectables.forEach(collectable => {
        collectable.draw(context);
    });
}

// Пример использования с <canvas>
window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');

    // Очищаем канвас перед отрисовкой
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовываем все подбираемые объекты
    drawCollectables(context);
};
