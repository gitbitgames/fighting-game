const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

/// CREATE GRAVITY
const gravity = 0.7



// CREATE PLAYER AND ENEMY SPRITES
const player = new Fighter({
    position: {
        x:0,
        y:10
    },
    velocity: {
        x:0,
        y:10
    },
    offset: {
        x:0,
        y:0
    }
})

const enemy = new Fighter({
    position: {
        x:400,
        y:100
},
    velocity: {
        x:0,
        y:10
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
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

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player, enemy, timerID }) {
    clearTimeout(timerID)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerID
function decreaseTimer() {
    if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerID })
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // PLAYER MOVEMENT
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }
    // ENEMY MOVEMENT
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // COLLISION DETECTION
    if (rectangularCollision({ rectangle1:player, rectangle2:enemy }) && player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangularCollision({ rectangle1:enemy, rectangle2:player }) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
        console.log('ENEMY ATTACKY!!!')
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
            player.attack()
            break

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
            enemy.isAttacking = true
            break
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