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
function startGame() {
  console.log(game.getPlayers());
  game.currentPlayer = game.players[1];
  game.stateMachine.transitionTo(game.stateMachine.states.switchTurn);
  game.startGame();
}

// handle the 'startGame' event to start the game
socket.on("startGame", (gameData) => {
  console.log("Both players are ready. Starting the game!");
  let myPieces = gameData.pieces.filter((p: any) => p.playerId === playerId);
  let otherPieces = gameData.pieces.filter((p: any) => p.playerId !== playerId);

  // generate actual pieces
  game.board.convertPieceRepToPiece(game.getPlayers(), myPieces, otherPieces);

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
  socket.emit("stateChange");
});
