function setup() {
    R = floor(min(windowWidth/10, windowHeight/11)/2)
    D = 2 * R
    board = loadBoard()
    width = 10 * D
    height = 11 * D
    createCanvas(width, height).mouseClicked(handleClick)
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    textSize(R)
    textAlign(CENTER, CENTER)
}

function draw() {
    clear()
    
    push()
    stroke(0)
    strokeWeight(2)
    translate(D, D)

    for (let x = 0; x < board.width; x ++) {
        line(x * D, 0, x * D, (board.height - 1) * D)
    }

    for (let y = 0; y < board.height; y ++) {
        line(0, y * D, (board.width - 1) * D, y * D)
    }

    strokeWeight(2)

    for (let x = 0; x < board.width; x ++) {
        for (let y = 0; y < board.height; y ++) {
            if (board[x][y]) {
                fill((board[x][y] === -1) * 255)
                circle(x * D, y * D, R - 1)
            }
        }
    }
    pop()

    push()
    rectMode(RADIUS)
    fill('black')
    noStroke()

    bx = width/2 - 2*D
    by = height - R
    textSize(D + (dist(mouseX, mouseY, bx, by) < D) * (6 + mouseIsPressed*6))
    // rect(bx, by, 2*R - 1, R-1)
    text('Black', bx, by)

    fill('white')
    wx = width/2 + 2*D
    wy = height - R
    textSize(D + (dist(mouseX, mouseY, wx, wy) < D) * (6 + mouseIsPressed*6))
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