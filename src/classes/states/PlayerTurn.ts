import GameState from "./GameState";

export default class PlayerTurn extends GameState{

  onEnter(){
    console.log("Entering PlayerTurn State")
  }

  onExit(){
    console.log("Exiting PlayerTurn State")
  }

  onUpdate(delta : number){

  }
}