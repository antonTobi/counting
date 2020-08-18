S = window.localStorage
maxTime = 10 * 1000

function setup() {
    if (!S.highscore) S.highscore = 0
    if (!S.score) S.score = 0

    createCanvas().mouseClicked(handleClick)
    windowResized()
    
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    noStroke()

    timer = maxTime

    loadBoard()
}

function windowResized() {
    R = floor(min(windowWidth/10, windowHeight/12)/2)
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

function getScoreGain() {
    if (failed) return 0
    let passedTime = (millis() - startTime)*0.001
    if (passedTime < 1) return 30 * passedTime
    return max(30 - passedTime, 5)
}

function pad(s, length) {
    s += ''
    while (s.length < length) s = '0' + s
    return s
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

    // push()
    // textFont('courier')
    // textSize(D)

    // fill('white')
    // textAlign(LEFT, CENTER)
    // text(pad(S.score, 4), D, sy)

    // textAlign(CENTER, CENTER)
    // text(pad(getScoreGain(), 2), sx, sy)

    // fill('black')
    // textAlign(RIGHT, CENTER)
    // text(pad(window.localStorage.highscore, 4), width - D, sy)

    // pop()

    push()
    textSize(R)
    if (dist(mouseX, mouseY, D, R) < R) textSize(R * 1.2)
    fill('white')
    // textAlign(LEFT, TOP)
    text("restart", D, R)

    textSize(R)
    if (dist(mouseX, mouseY, width - D, R) < R) textSize(R * 1.2)
    fill('black')
    // textAlign(RIGHT, TOP)
    text("help", width - D, R)
    pop()

    push()

    let x1 = map(S.score, 0, 360, D, width - D)
    let x2 = map(S.score - (-getScoreGain()), 0, 360, D, width - D)

    let dx = map(timer, 0, maxTime, 0, width/2 - D)
    
    fill(255)
    stroke('white')
    if (timer > 0) line(width/2 - dx, D, width/2 + dx, D)
    // rect(D, R, xt - D, R)
    // fill(255, 50)
    // rect(x1, R, x2 - x1, R)

    // noFill()
    // stroke('black')
    // rect(D, R, width - 2*D, R)

    pop()

    timer -= deltaTime
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
}

function handleClick() {
    if (dist(mouseX, mouseY, D, R) < R) {
        setup()
    }

    if (dist(mouseX, mouseY, width - D, R) < R) {
        window.open('help.html')
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

function submit(submission) {
    if (submission === correct) {
        S.score = parseInt(S.score) + getScoreGain()
        S.highscore = max(S.score, S.highscore)
        loadBoard()
    } else {
        if (!failed) {
            failed = true
            // S.score = floor(S.score/2)
            S.score = 0
            document.bgColor = 'crimson'
        }
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW)  submit('black')
    if (keyCode === RIGHT_ARROW) submit('white')
}

function mouseReleased() {
    return false
}

function touchEnded() {
    mouseX = -1
    mouseY = -1
}