const { GRID_SIZE } = require('./constants')

module.exports = {
  createGameState,
  gameLoop,
  getUpdatedVelocity
}

function createGameState() {
  return {
    player: {
      pos: {
        x: 3,
        y: 10
      },
      vel: {
        x: 1,
        y: 0
      },
      snake: [
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 3, y: 10 },
      ]
    },
    food: {
      x: 7,
      y: 7,
    },
    gridsize: GRID_SIZE
  }
}

function gameLoop(state) {
  if (!state){
    return
  }
  const playerOne = state.player
  playerOne.pos.x += playerOne.vel.x
  playerOne.pos.y += playerOne.vel.y

  if (isOutOfField(playerOne)){
    return 2;
  }

  if (isTakeFood(playerOne, state)){
    playerOne.snake.push({...playerOne.pos})

    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    randomFood(state)

    if (playerOne.vel.x || playerOne.vel.x){
      for (let cell of playerOne.snake){
        if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y){
          return 2
        }
      }
    }
  }
  playerOne.snake.push({ ...playerOne.pos })
  playerOne.snake.shift()

  return false
}

function isOutOfField(player) {
  return player.pos.x < 0 || player.pos.x > GRID_SIZE ||
    player.pos.y < 0 || player.pos.y > GRID_SIZE
}

function isTakeFood(player, state) {
  return player.pos.x === state.food.x && player.pos.y === state.food.y 
}

function randomFood(state) {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  }
  for(let ceil of state.player.snake){
    if (ceil.x === food.x && ceil.y === food.y){
      randomFood(state)
    }
  }
  state.food = food
}

function getUpdatedVelocity(keyCode) {
  switch (keyCode){
    case 37:{
      return { x: -1, y: 0 }
    }
    case 38:{
      return { x: 0, y: -1 }
    }
    case 39:{
      return { x: 1, y: 0 }
    }
    case 40:{
      return { x: 0, y: 1 }
    }
  }
}