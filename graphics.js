function setup() {

    createCanvas(100, 100).mouseClicked(handleClick)
    windowResized()
    
    board = loadBoard()
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    textSize(R)
    textAlign(CENTER, CENTER)
}

function windowResized() {
    R = floor(min(windowWidth/10, windowHeight/11)/2)
    D = 2 * R
    width = 10 * D
    height = 11 * D
    halfStrokeWeight = ceil(D/70)
    strokeWeight(2 * halfStrokeWeight)

    bx = width/2 - 2*D
    by = height - R
    wx = width/2 + 2*D
    wy = height - R

    resizeCanvas(width, height)
}

function draw() {
    clear()
    
    push()
    stroke(0)
    translate(D, D)

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
    rectMode(RADIUS)
    fill('black')
    noStroke()

    
    if (keyIsDown(LEFT_ARROW)) {
        textSize(D + 12)
    } else if (dist(mouseX, mouseY, bx, by) < D) {
        if (mouseIsPressed) textSize(D + 12)
        else textSize(D + 6)
    } else {
        textSize(D)
    }
    text('Black', bx, by)

    fill('white')
    if (keyIsDown(RIGHT_ARROW)) {
        textSize(D + 12)
    } else if (dist(mouseX, mouseY, wx, wy) < D) {
        if (mouseIsPressed) textSize(D + 12)
        else textSize(D + 6)
    } else {
        textSize(D)
    }
    text('White', wx, wy)
    pop()
}

charToInt = {
	'O': 1,
	'X': -1,
	'.': 0,
}

function loadBoard() {
	let textBoard = random(boards).split('\n').map(row => row.split(' '))
    let board = {width: textBoard[0].length, height: textBoard.length}

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
			board[x][y] = charToInt[textBoard[b][a]] * (-1)**invert
        }
    }
    document.bgColor = 'seagreen'
    return board
			
}

function handleClick() {
    if (dist(mouseX, mouseY, bx, by) < D) {
        submit('black')
    } else if (dist(mouseX, mouseY, wx, wy) < D) {
        submit('white')
    }
    mouseX = undefined
    mouseY = undefined
}

function submit(submission) {
    if (submission === correct) {
        board = loadBoard()
    } else {
        document.bgColor = 'crimson'
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
    mouseX = undefined
    mouseY = undefined
}