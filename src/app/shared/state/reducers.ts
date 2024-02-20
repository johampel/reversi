import {createReducer, on} from "@ngrx/store";
import {initialBoardState} from "./state";
import {computerMove, humanMove, humanPass, idle, newGame} from "./actions";
import {Board} from "../model/board";


export const boardStateReducer = createReducer(
  initialBoardState,

  on(newGame, (state, {size}) => Board.newGame(size).toState(false)),
  on(idle, state => state),
  on(computerMove, (oldState, {board}) => board),
  on(humanPass, state => new Board(state).toState(true)),
  on(humanMove, (state, {
    row,
    column
  }) => new Board(state).setPlayerAt(row, column, state.currentPlayer).toState(true))
)


