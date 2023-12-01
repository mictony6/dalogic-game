import TransitioningState from "./TransitioningState";
import Game from "../Game";
import GameState from "./GameState";

export default class PlayerTurn  extends GameState implements TransitioningState{

  onEnter(){
    console.log("Entering PlayerTurn State")
  }

  onExit(){
    console.log("Exiting PlayerTurn State")
  }

  onUpdate(delta : number){

  }
}