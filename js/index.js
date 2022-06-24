const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

/// CREATE GRAVITY
const gravity = 0.5

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position:{
        x:600,
        y:129
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

// CREATE PLAYER AND ENEMY SPRITES
const player = new Fighter({
    position: {
        x:0,
        y:10
    },
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x:215,
        y:157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: './img/samuraiMack/Attack2.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x:60,
            y:0
        },
        width: 200, height: 150
    }
})

const enemy = new Fighter({
    position: {
        x:400,
        y:100
},
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x:215,
        y:170
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        attack2: {
            imageSrc: './img/kenji/Attack2.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset: {
            x:-160,
            y:0
        },
        width: 170, height: 130
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // PLAYER MOVEMENT
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')

    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // ENEMY MOVEMENT
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')

    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // COLLISION DETECTION
    if (rectangularCollision({ rectangle1:player, rectangle2:enemy }) && player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
        if (player.health > 0 && enemy.health > 0 && timer > 0) { enemy.health -= 12 }
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // IF PLAYER MISSES
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision({ rectangle1:enemy, rectangle2:player }) && enemy.isAttacking) {
        enemy.isAttacking = false
        if (player.health > 0 && enemy.health > 0 && timer > 0) { player.health -= 10 }
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // IF ENEMY MISSES
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    // PLAYER MOVEMENT
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -15
            break
        case ' ':
            player.attack('1')
            break
        case 'f':
            player.attack('2')
            break;

    // ENEMY MOVEMENT
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack('1')
            break
        case 'l':
            enemy.attack('2')
    }
})

window.addEventListener('keyup', (event) => {
    // PLAYER MOVEMENT
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
        case 'a':
            keys.a.pressed = false
    }

    // ENEMY MOVEMENT
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
    }
})



player.draw()
enemy.draw()

console.log(player)