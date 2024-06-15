let cols = 3;
let rows = 3;
let size;
let board = [];
let button;
let players = ['X', 'O'];
let playerScores = {
  'X': 0,
  'O': 0
};
let currentPlayer;
let round = 1;
let roundInfo;
let winner = false;
let winnerLoc = [];
let winnerText;
let startButton;
let imgx;
let imgo;
let nimgx;
let nimgo;
let aud;
let winsound;
let tiesound;

function preload(){
  imgx = loadImage('assets/imgx.png');
  imgo = loadImage('assets/imgo.png');
  nimgx = loadImage('assets/nimgx.jpg');
  nimgo = loadImage('assets/nimgo.jpg');
  aud = createAudio('assets/hsound.mpeg');
  winsound = createAudio('assets/winsound.mpeg');
  tiesound = createAudio('assets/tiesound.mpeg');
}

function setup() {
  createCanvas(1000, 800); //600,400
  size = 800 / cols;
  roundInfo = createP('');
  roundInfo.position(840, 420);
  startButton = createButton('Start New Round');
  
  startButton.style('font-family', 'Ink Free, Arial, sans-serif');
  startButton.style('background', 'linear-gradient(#8A2BE2, #5E3266)'); // 
  startButton.style('border-radius', '10px'); // Yuvarlak kenar
  startButton.style('color', 'white');
  startButton.style('font-size', '16px');
  startButton.position(830,700);
  startButton.mousePressed(startNewRound);
  startButton.mouseOver(() => { // Hover efekti
  startButton.style('background', 'linear-gradient(#800080, #7F62B2)'); // Koyu pembe arka plan
});
  startButton.mouseOut(() => {
  startButton.style('background', 'linear-gradient(#8A2BE2, #D39DDD)'); // Lila arka plan
  
});
  
  currentPlayer = players[floor(random(2))];
  initializeBoard();
}

function startNewRound() {
  round++;
  currentPlayer = players[floor(random(2))];
  initializeBoard();
  winner = false;
  winnerText = ""; 
}


function initializeBoard() {
  for (let i = 0; i < cols; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
    }
  }
  updateRoundInfo(); 
}

function draw() {
  background('#DAB9F5');
  drawBoard();
  drawWinner();
  drawPlayerScores(); 
  updateRoundInfo(); 
}

function updateRoundInfo() {
  roundInfo.html("Round " + round + ": " + currentPlayer + "'s turn."); 
}

function drawBoard() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      rect(i * size, j * size, size, size);
      if (board[i][j] !== 0) {
        let xCoord = i * size + size / 2;
        let yCoord = j * size + size / 2;
        let imageSize = min(size * 0.8, min(imgx.width, imgo.width)); 
        if (board[i][j] === 'X') {
          image(imgx, xCoord - imageSize / 2, yCoord - imageSize / 2, imageSize, imageSize);
        } else {
          image(imgo, xCoord - imageSize / 2, yCoord - imageSize / 2, imageSize, imageSize);
        }
      }
    }
  }
}


function placePieces(x, y) {
  if (board[x] && board[x][y] === 0) {
    board[x][y] = currentPlayer;
    winnerText = currentPlayer;
    if (currentPlayer == 'X') {
      currentPlayer = 'O';
    } else {
      currentPlayer = 'X';
    }
    checkWinner();
let newAud = new Audio(aud.src);
newAud.play();

    
    setTimeout(function(){
      newAud.pause();
    }, 1600); // 
  } 
}

function mousePressed() {
  if (!winner && winnerText !== "TIE") { // kazanan yoksa ve oyun berabere bitmediyse
    let index = [floor(mouseX / size), floor(mouseY / size)];
    let x = index[0];
    let y = index[1];

    if (x >= 0 && x < cols && y >= 0 && y < rows && board[x][y] === 0) {
      placePieces(x, y);
    }
    else{
      print('spot not available');
    }
  }
}


function checkWinner() {
  for (let i = 0; i < cols; i++) {
    if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != 0) {
      winner = true;
      winnerLoc = [1, i];
    }
  }

  for (let i = 0; i < rows; i++) {
    if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != 0) {
      winner = true;
      winnerLoc = [2, i];
    }
  }

  if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != 0) {
    winner = true;
    winnerLoc = [3, 0];
  }

  if (board[2][0] == board[1][1] && board[1][1] == board[0][2] && board[2][0] != 0) {
    winner = true;
    winnerLoc = [4, 0];
  }

  if (!winner && boardIsFull()) {
    winnerText = "TIE";
  }

  if (winner && winnerText !== "TIE") {
    playerScores[winnerText]+=2;
    
    let newWinSound = new Audio(winsound.src);
    newWinSound.play();
  }
  else if (winnerText === "TIE") {
    playerScores['X']++;
    playerScores['O']++;
    
    let newTiesound = new Audio(tiesound.src);
    newTiesound.play();
  }

}

function drawWinner() {
  stroke('#8A2BE2');
  strokeWeight(3);
  if (winner) {
    textAlign(CENTER);
    fill('white');
    textSize(50);
    text(winnerText + " wins!", 900, 775);
    if (winnerLoc[0] == 1) {
      line(size / 2 + winnerLoc[1] * size, size / 2, size / 2 + winnerLoc[1] * size, size / 2 + 2 * size);
    } else if (winnerLoc[0] == 2) {
      line(size / 2, winnerLoc[1] * size + size / 2, size / 2 + 2 * size, size / 2 + winnerLoc[1] * size);
    } else if (winnerLoc[0] == 3) {
      line(size / 2, size / 2, size / 2 + 2 * size, size / 2 + 2 * size);
    } else if (winnerLoc[0] == 4) {
      line(size / 2 + 2 * size, size / 2, size / 2, size / 2 + 2 * size);
    }
  } else if (winnerText === "TIE") {
    textAlign(CENTER);
    fill('white');
    textSize(50);
    text("TIE!", 900, 775);
  }
  
}

function drawPlayerScores() {
  textSize(20);
  textAlign(LEFT);
  image(nimgx,825,495,75,75);
  image(nimgo,825,605,75,75);
  textSize(50);
   fill('white');
  text(playerScores['X'], 945, 550);
  text(playerScores['O'], 945, 660);
 
}

function boardIsFull() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}
