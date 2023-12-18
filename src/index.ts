import Game from "./classes/Game";
import "./styles.css";
import { GAMEMODE } from "./classes/helpers";
import { io } from "socket.io-client";
import { Ticker } from "pixi.js";
import Player from "./classes/Player";
import gameEventListener from "./classes/GameEventListener";
import Move from "./classes/Move";
import { GameEvent, MoveEvent, StateChangeEvent } from "./classes/GameEvent";

const trainButton = document.getElementById("trainButton")!;
trainButton.onclick = () => {
  Ticker.shared.stop();
  game = new Game(8, GAMEMODE.PlayerVsAI);
  game.createPlayers();
  game.board.initPieces(game.app, game.players[0], game.players[1]);
  game.currentPlayer = game.players[1];
  game.stateMachine.transitionTo(game.stateMachine.states.switchTurn);
  game.startGame();
};

const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

let game = new Game(8, GAMEMODE.PlayerVsPlayer);
function startGame(playerId: string) {
  console.log(game.getPlayers());
  game.currentPlayer = game.players.find((p) => p.id !== playerId)!;
  game.stateMachine.transitionTo(game.stateMachine.states.switchTurn);
  console.log(game.currentPlayer);
  game.startGame();
}

// handle the 'startGame' event to start the game
socket.on("startGame", (gameData) => {
  console.log("Both players are ready. Starting the game!");
  let myPieces = gameData.pieces.filter((p: any) => p.playerId === playerId);
  let otherPieces = gameData.pieces.filter((p: any) => p.playerId !== playerId);

  // generate actual pieces
  game.board.convertPieceRepToPiece(game.getPlayers(), myPieces, otherPieces);

  let currentPlayer = gameData.currentPlayer;
  startGame(currentPlayer); // Call the function to initialize the game
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

  socket.emit("playerReady", { playerId: playerId, rows: 8, columns: 8 });
});

socket.emit("joinGame");
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
}

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
