import Game from "./classes/Game";
import "./styles.css";
import { GAMEMODE, socket } from "./classes/helpers";
import Player from "./classes/Player";
import gameEventListener from "./classes/GameEventListener";
import Move from "./classes/Move";
import {
  GameEvent,
  MoveEvent,
  ScoreEvent,
  StateChangeEvent,
} from "./classes/GameEvent";
import bg from "./assets/bg.png";
import titleSprite from "./assets/titleSprite.png";
const body = document.querySelector("body")!;
body.style.backgroundImage = `url(${bg})`;

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

// buttons hehe
const trainButton = document.getElementById("trainButton")!;
const findMatchButton = document.getElementById("findMatchButton")!;
const aiMatchButton = document.getElementById("aiMatchButton")!;

let game!: Game;

// button listeners
aiMatchButton.onclick = () => {
  document.location.replace("/ai-match");
};

trainButton.onclick = () => {
  document.location.replace("/training");
};

findMatchButton.onclick = () => {
  document.location.replace("/player-match");
};

let playerId = 0;
let player: Player | undefined;
socket.on("joinSuccess", (socketId) => {
  playerId = socketId;
  player = new Player(0xf9731c, playerId);
  player.setDirection(-1);
  playerReady();
});

function playerReady() {
  socket.emit("findMatch", player);
  game.stateMachine.transitionTo(game.stateMachine.states.findingMatch);
}

function startGame() {
  game.stateMachine.transitionTo(game.stateMachine.states.switchTurn);
  game.startGame();
}

// handle the 'startGame' event to start the game
socket.on("startGame", (gameData) => {
  console.log("Both players are ready. Starting the game!");
  console.log(gameData);
  let myPieces = gameData.pieces.filter((p: any) => p.playerId === playerId);

  let otherPieces = gameData.pieces.filter((p: any) => p.playerId !== playerId);
  // generate actual pieces
  game.board.convertPieceRepToPiece(game.getPlayers(), myPieces, otherPieces);
  game.currentPlayer = game.players.find(
    (p) => p.id === gameData.currentPlayer,
  )!;
  startGame(); // Call the function to initialize the game
});

// Handle match found event
socket.on("matchFound", (matchedPlayers) => {
  console.log("Match found:", matchedPlayers);
  // Implement logic to transition to the game or notify the user
  let otherPlayer = matchedPlayers.find((p: Player) => p.id != playerId);
  console.log("Other player is", otherPlayer);
  if (otherPlayer) {
    game.setPlayers(player!, new Player(0xeec811, otherPlayer.id));
  }

  socket.on("flipBoard", () => {
    player!.flipped = true;
  });
  socket.emit("playerReady", { playerId: playerId, rows: 8, columns: 8 });
});

gameEventListener.on("stateChange", (e: StateChangeEvent) => {
  socket.emit("stateChange", e.state);
});

gameEventListener.on("move", (e: MoveEvent) => {
  let moveData = {
    player: game.currentPlayer.id,
    srcPos: { row: e.move.srcPos.tile.row, column: e.move.srcPos.tile.column },
    destPos: {
      row: e.move.destPos.tile.row,
      column: e.move.destPos.tile.column,
    },
  };
  socket.emit("move", moveData);
});

socket.on("move", (moveData) => {
  let srcPos = game.board.getBoardPosition([
    moveData.srcPos.row,
    moveData.srcPos.column,
  ]);
  let destPos = game.board.getBoardPosition([
    moveData.destPos.row,
    moveData.destPos.column,
  ]);
  let move = new Move(srcPos!, destPos!);
  game.currentPlayer.selectPiece(srcPos!.piece!, game.board);
  game.currentPlayer.selectTile(destPos!.tile, game.board);
});

function startAIMatch() {
  if (game) {
    game.removeFromStage();
  }
  game = new Game(8, GAMEMODE.AIVsAI);
  game.createPlayers();
  game.board.initPieces(game.app, game.players[0], game.players[1]);
  game.stateMachine.transitionTo(game.stateMachine.states.onMenu);
}

function startPlayerMatch() {
  if (game) {
    game.removeFromStage();
  }
  game = new Game(8, GAMEMODE.PlayerVsPlayer);
  socket.emit("joinGame");
}

function startTraining() {
  if (game) {
    game.removeFromStage();
  }
  game = new Game(8, GAMEMODE.PlayerVsAI);
  game.createPlayers();
  game.board.initPieces(game.app, game.players[0], game.players[1]);
  game.stateMachine.transitionTo(game.stateMachine.states.onMenu);
}

switch (document.location.pathname) {
  case "/":
    let logoImageEl = document.getElementById("titleImage") as HTMLImageElement;
    logoImageEl.src = titleSprite;
    break;
  case "/ai-match":
    startAIMatch();
    break;
  case "/player-match":
    startPlayerMatch();
    break;
  case "/training":
    startTraining();
    break;
}
function createScoreElement(playerId: string | number) {
  let scoreboard = document.getElementsByName("logPanel")[0];
  if (scoreboard) {
    let newScorePanel = document.createElement("div");
    newScorePanel.className = "scorePanel";
    const nameEl = document.createElement("h4");
    nameEl.innerText = `Player ${playerId}`;
    newScorePanel.appendChild(nameEl);
    const scoreEl = document.createElement("p");
    scoreEl.id = playerId.toString();
    newScorePanel.appendChild(scoreEl);
    scoreboard.appendChild(newScorePanel);
  }
}
gameEventListener.on("score", (e: ScoreEvent) => {
  let player = e.scoringPlayer!;
  console.log(player);
});
