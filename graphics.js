function preload() {
    seconds = prompt('Seconds per board: (leave empty for no timer)', window.localStorage.seconds || '')
    seconds = round(parseInt(seconds))
    if (!seconds || seconds <= 0) {seconds = Infinity}
    maxTime = seconds * 1000
    if (seconds == Infinity) seconds = ''
    window.localStorage.seconds = seconds
}

function setup() {
    createCanvas().mouseClicked(handleClick)
    windowResized()
    
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    noStroke()
    score = 0
    started = false

    loadBoard()
}

function windowResized() {
    R = floor(min(window.innerWidth/10, window.innerHeight/12)/2)
    D = 2 * R
    width = 10 * D
    height = 12 * D
    halfStrokeWeight = ceil(D/70)
    strokeWeight(2 * halfStrokeWeight)

    sx = width/2
    sy = 1.5*R
    bx = width/2 - 2*D
    by = height - 1.5*R
    wx = width/2 + 2*D
    wy = height - 1.5*R
    
    resizeCanvas(width, height)
}

function draw() {
    clear()
    
    push()
    stroke(0)
    translate(D, 2*D)

    for (let x = 0; x < board.width; x ++) {
        line(x * D, 0, x * D, (board.height - 1) * D)
    }

    for (let y = 0; y < board.height; y ++) {
        line(0, y * D, (board.width - 1) * D, y * D)
    }

    for (let x = 0; x < board.width; x ++) {
        for (let y = 0; y < board.height; y ++) {
            if (board[x][y]) {
                fill((board[x][y] === -1) * 255)
                circle(x * D, y * D, R - halfStrokeWeight)
            }
        }
    }
    pop()

    push()
    textSize(R)
    if (dist(mouseX, mouseY, 2*D, 0.5*R) < 1.5*R) textSize(R * 1.1)
    fill('black')
    text('restart', 2*D, R)

    push()
    fill('white')
    textSize(D)
    
    textFont('courier')    
    text(score, width/2, R)
    
    pop()

    textSize(R)
    if (dist(mouseX, mouseY, width - 2*D, 0.5*R) < 1.5*R) textSize(R * 1.1)
    fill('black')
    text('about', width - 2*D, R)
    pop()

    push()

    let dx = map(timer, 0, maxTime, 0, width/2 - D)
    
    fill(255)
    stroke('white')
    strokeCap(ROUND)
    if (timer > 0) line(width/2 - dx, D, width/2 + dx, D)
    pop()

    
    if (timer > 0) {
        
        textAlign(CENTER, CENTER)

        fill('black')
        if (keyIsDown(LEFT_ARROW)) {
            textSize(D + 12)
        } else if (dist(mouseX, mouseY, bx, by) < D) {
            if (mouseIsPressed) textSize(D + 12)
            else textSize(D + 6)
        } else {
            textSize(D)
        }
        text('black', bx, by)
    
        fill('white')
        if (keyIsDown(RIGHT_ARROW)) {
            textSize(D + 12)
        } else if (dist(mouseX, mouseY, wx, wy) < D) {
            if (mouseIsPressed) textSize(D + 12)
            else textSize(D + 6)
        } else {
            textSize(D)
        }
        text('white', wx, wy)
        if (started) {
            timer -= deltaTime
        }
        if (timer <= 0) {
            document.bgColor = "royalblue"
        }
    } else {
        textSize(R)
        noStroke()
        fill(0, 200)
        let plurality = (score == 1) ? 'board' : 'boards'
        if (seconds == '') {
            text(`Game over!\nYou solved ${score} ${plurality}.`, width/2, by)
        } else {
            text(`Game over!\nYou solved ${score} ${plurality} in ${seconds}s per board.`, width/2, by)
        }
        
    }

}

function loadBoard() {
	let textBoard = random(boards).split('\n').map(row => row.split(' '))
    board = {width: textBoard[0].length, height: textBoard.length}

	let flipX = random() < 0.5
	let flipY = random() < 0.5
	let transpose = (board.width == board.height) && (random() < 0.5)
    let invert = random() < 0.5
    correct = invert ? "white" : "black"

	for (let x = 0; x < board.width; x ++) {
        board[x] = {}
		for (let y = 0; y < board.height; y ++) {
			let a = flipX ? board.width - 1 - x : x
			let b = flipY ? board.height - 1 - y : y
			if (transpose) [a, b] = [b, a]
			board[x][y] = {'O':1,'X':-1,'.':0}[textBoard[b][a]] * (-1)**invert
        }
    }
    failed = false
    document.bgColor = 'seagreen'
    startTime = millis()
    timer = maxTime
}

function handleClick() {
    if (dist(mouseX, mouseY, 2*D, R) < R) {
        setup()
    }

    if (dist(mouseX, mouseY, width - 2*D, R) < R) {
        window.location.href = "http://count.4tc.xyz/about.html"
    }
    if (timer > 0) {
        if (dist(mouseX, mouseY, bx, by) < D) {
            submit('black')
        } else if (dist(mouseX, mouseY, wx, wy) < D) {
            submit('white')
        }
    }
    
    mouseX = -1
    mouseY = -1
}

function submit(guess) {
    started = true
    if (guess === correct) {
        score ++
        maxTime -= 1000
        loadBoard()
    } else {
        if (!failed) {
            timer = -1
            document.bgColor = 'crimson'
        }
    }
}

function keyPressed() {
    if (keyCode === ENTER) setup()
    if (timer > 0) {
        if (keyCode === LEFT_ARROW)  submit('black')
        if (keyCode === RIGHT_ARROW) submit('white')
    }
    
}

function mouseReleased() {
    return false
}

function touchEnded() {
    mouseX = -1
    mouseY = -1
}