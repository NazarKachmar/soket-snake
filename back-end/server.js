const FRONT_URL = "http://127.0.0.1:8080"
const httpServer = require("http").createServer()
const { initGame, gameLoop, getUpdatedVelocity } =  require('./game')
const { FRAME_RATE } =  require('./constants')
const { makeId } =  require('./utils')

const state = {};
const clientRooms = {};

const io = require('socket.io')(httpServer, {
  cors: {
    origin: FRONT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on('connection', client =>{
  client.on('keydown', handleKeyDown)
  client.on('newGame', handleNewGame)
  client.on('joinGame', handlejoinGame)

  function handlejoinGame(gameCode){
    const room = io.sockets.adapter.rooms[gameCode]
    let allUsers, numClients
    if (room) {
      allUsers = room.sockets
    }

    if (allUsers) {
      numClients = Object.keys(allUsers).length
    }

    if (numClients === 0) {
      client.emit('unknownCode')
      return
    } else if (numClients > 1) {
      client.emit('tooManyPlayers')
      return
    } else {
      clientRooms[client.id] = gameCode
      client.join(gameCode)
      client.number = 2
      client.emit('init', 2)
      startGameInterval(gameCode)
    }
  }

  function handleNewGame(){
    let roomName = makeId(5)

    clientRooms[client.id] = roomName
    client.emit('gameCode', roomName)
    state[roomName] = initGame()
    client.join(roomName)
    client.number = 1
    client.emit('init', 1)
    console.log(state)
  }

  function handleKeyDown(keyCode) {
    const roomName = clientRooms[client.id]

    if (!roomName){
      return
    }

    try{
      keyCode = parseInt(keyCode)
    } catch(error){
      console.log(error)
      return
    }

    const vel = getUpdatedVelocity(keyCode)
    if (vel) {
      state[roomName].players[client.number - 1].vel = vel
    }
  }
})

function startGameInterval(gameCode) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(state[gameCode])
    if(!winner){
      emitGameState(gameCode, state[gameCode])
    } else {
      emitGameOver(gameCode, winner)
      state[gameCode] = null
      clearInterval(intervalID)
    }
  }, 1000 / FRAME_RATE)
}

function emitGameState(roomName, state){
  console.log(state, roomName)
  io.sockets.in(roomName).emit('gameState', JSON.stringify(state))
}

function emitGameOver(roomName, winner){
  io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }))
}

io.listen(3000)