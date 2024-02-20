import {Injectable} from '@angular/core';
import {AppState, BoardState} from "../shared/state/state";
import {Store} from "@ngrx/store";
import {COMMAND_CALCULATE_NEXT_MOVE} from "../app.worker";
import {computerMove} from "../shared/state/actions";
import {Board} from "../shared/model/board";


export interface ComputeNextMoveCommand {
  service: PlayerService,
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private board?: BoardState;

  constructor(private readonly store: Store<AppState>) {
    this.store.subscribe(appState => this.board = appState.board);
  }

  triggerComputeMove(): void {
    if (!this.board) {
      return;
    }

    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../app.worker', import.meta.url));
      worker.onmessage = ({data}) => {
        this.store.dispatch(computerMove({board: data as BoardState}));
      };
      worker.postMessage({
        code: COMMAND_CALCULATE_NEXT_MOVE,
        data: this.board
      });
    } else {
      console.log("Not supported - Game will not run on your host!");
    }
  }

  static computeMove(boardState: BoardState) {
    if (!boardState) {
      return;
    }
    const board = new Board(boardState);
    const bestMove = PlayerService.tryMoves(board, boardState.computerPlayer, 4);
    if (bestMove) {
      postMessage(bestMove.board.toState(true));
    } else {
      postMessage(board.toState(true));
    }
  }


  static tryMoves(board: Board, movingPlayer: number, level: number): Move | undefined {
    let best: Move | undefined = undefined;

    for (let r = 0; r < board.size(); r++) {
      for (let c = 0; c < board.size(); c++) {
        if (!(board.getCandidatesAt(r, c) & movingPlayer)) {
          continue;
        }
        let move = PlayerService.setPlayerAt(board, r, c, movingPlayer);
        if (level > 0) {
          let nextLevelMove = PlayerService.tryMoves(move.board, 3 - movingPlayer, level--);
          if (nextLevelMove) {
            move.score -= nextLevelMove.score;
          }
        }

        if (best) {
          best = best.score > move.score ? best : move;
        } else {
          best = move;
        }
      }
    }

    return best;
  }

  static setPlayerAt(board: Board, row: number, column: number, movingPlayer: number): Move {
    let score = 0;
    board = new Board(board.toState(false));
    board.setPlayerAt(row, column, movingPlayer, (r, c) => score += PlayerService.getWeight(board, row, column));
    return {
      row,
      column,
      player: movingPlayer,
      board,
      score
    };
  }

  static getWeight(board: Board, row: number, column: number): number {
    //  50 -20  10   5  2
    // -20 -30   1   1  1
    //  10   1   1   1  1
    //   5   1   1   1  1
    //   2   1   1   1  1
    const weights0 = [50, -20, 10, 5, 2];
    const weights1 = [-20, -30];
    let size = board.size();
    if (row >= size / 2) {
      row = size - 1 - row;
    }
    if (column >= size / 2) {
      column = size - 1 - column;
    }

    if (row === 0) {
      return weights0[column] || 2;
    } else if (column === 0) {
      return weights0[row] || 2;
    } else if (row === 1) {
      return weights1[column] || 1;
    } else if (column === 1) {
      return weights1[row] || 1;
    } else {
      return 1;
    }
  }
}

interface Move {
  row: number,
  column: number,
  player: number,
  board: Board,
  score: number
}
