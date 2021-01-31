const BACK_URL = 'http://localhost:3000'
const BG_COLOR = "#4d375d"
const SNAKE_COLOR = "#ffe227"
const FOOD_COLOR = "#eb596e"
const gameScreen = document.getElementById('gameScreen')
const socket = io(BACK_URL, {
  withCredentials: true,
  serveClient: false
})

socket.on('init', handleSocket)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)

let canvas, ctx;

function initialize() {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  canvas.width = canvas.height = 700
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  document.addEventListener('keydown', keydown)
}

function keydown(event) {
  socket.emit('keydown', event.keyCode)
}

function renderGame(state) {
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const food = state.food
  const gridsize = state.gridsize
  const size = canvas.width / gridsize

  ctx.fillStyle = FOOD_COLOR
  ctx.fillRect(food.x * size, food.y * size, size, size)

  renderPlayer(state.player, size, SNAKE_COLOR)
}

function renderPlayer(playerState, size, color) {
  const snake = playerState.snake
  ctx.fillStyle = color

  for(let cell of snake){
    ctx.fillRect(cell.x * size, cell.y * size, size, size)
  }
}

function handleSocket(data) {
  console.log(data)
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState)
  // console.log(gameState)
  requestAnimationFrame(() => renderGame(gameState) )
}

function handleGameOver() {
  alert('You are die!')
}

initialize()
// renderGame(gameState)