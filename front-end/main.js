const BACK_URL = 'http://localhost:3000'
const BG_COLOR = "#4d375d"
const SNAKE_COLOR = "#ffe227"
const FOOD_COLOR = "#eb596e"
const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newGameButton')
const joinGameBtn = document.getElementById('joinGameButton')
const gameCodeInput = document.getElementById('gameCodeInput')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')
const socket = io(BACK_URL, {
  withCredentials: true,
  serveClient: false
})

socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)
socket.on('gameCode', handleGameCode)
socket.on('unknownCode', handleUnknownCode)
socket.on('tooManyPlayers', handleTooManyPlayers)


newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)

let canvas, ctx, playerNumber;
let gameActive = false

function newGame() {
  socket.emit('newGame')
  initialize()
}

function joinGame() {
  socket.emit('joinGame', gameCodeInput.value)
  initialize()
}

function initialize() {
  initialScreen.style.display = "none"
  gameScreen.style.display = "block"
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  canvas.width = canvas.height = 700
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  document.addEventListener('keydown', keydown)
  gameActive = true
}

function keydown(event) {
  socket.emit('keydown', event.keyCode)
}

function renderGame(state) {
  console.log(state)
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const food = state.food
  const gridsize = state.gridsize
  const size = canvas.width / gridsize

  ctx.fillStyle = FOOD_COLOR
  ctx.fillRect(food.x * size, food.y * size, size, size)

  renderPlayer(state.players[0], size, SNAKE_COLOR)
  renderPlayer(state.players[1], size, 'red')
}

function renderPlayer(playerState, size, color) {
  const snake = playerState.snake
  ctx.fillStyle = color

  for(let cell of snake){
    ctx.fillRect(cell.x * size, cell.y * size, size, size)
  }
}

function handleInit(number) {
  playerNumber = number
}

function handleGameState(gameState) {
  if (!gameActive) {
    return
  }

  gameState = JSON.parse(gameState)
  // console.log(gameState)
  requestAnimationFrame(() => renderGame(gameState) )
}

function handleGameOver(data) {
  if(!gameActive){
    return
  }

  data = JSON.parse(data)
  if (data.winner === playerNumber){
    alert('You are winner!')
  } else {
    alert('You are die!')
  }

  gameActive = false
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode
}

function handleUnknownCode() {
  reset()
  alert('Unknown Game Code!')
}

function handleTooManyPlayers(gameCode) {
  alert('Room is full!')
}

function reset() {
  playerNumber = null
  gameCodeInput.value = ''
  gameCodeDisplay.innerText('')
  initialScreen.style.display = 'block'
  gameScreen.style.display = 'none'
}
// renderGame(gameState)