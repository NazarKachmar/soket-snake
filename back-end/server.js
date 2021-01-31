const FRONT_URL = "http://127.0.0.1:8080"
const httpServer = require("http").createServer()
const { createGameState, gameLoop, getUpdatedVelocity } =  require('./game')
const { FRAME_RATE } =  require('./constants')

const io = require('socket.io')(httpServer, {
  cors: {
    origin: FRONT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on('connection', client =>{
  const state = createGameState()
  client.on('keydown', handleKeyDown)

  function handleKeyDown(keyCode) {
    try{
      keyCode = parseInt(keyCode)
    } catch(error){
      console.log(error)
      return
    }

    const vel = getUpdatedVelocity(keyCode)
    if (vel) {
      state.player.vel = vel
    }
  }

  startGameInterval(client, state)
})

function startGameInterval(client, state) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(state)
    if(!winner){
      client.emit('gameState', JSON.stringify(state))
    } else {
      client.emit('gameOver')
      clearInterval(intervalID)
    }
  }, 1000 / FRAME_RATE)
}

io.listen(3000)