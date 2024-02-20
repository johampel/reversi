import {BoardState} from "./shared/state/state";
import {Board} from "./shared/model/board";

export const COMMAND_CALCULATE_NEXT_MOVE = "calculateNextMove";

export interface Command {
  code: string,
  data?: object
}

addEventListener('message', ( {data}) => {
  if (data.code === COMMAND_CALCULATE_NEXT_MOVE) {
    const board = data.data as BoardState;
    computeMove(board);
  }
});


function computeMove(boardState: BoardState) {
  if (!boardState) {
    return;
  }
  const board = new Board(boardState);
  const bestMove = tryMoves(board, boardState.computerPlayer, 3);
  if (bestMove) {
    postMessage(bestMove.board.toState(true));
  } else {
    postMessage(board.toState(true));
  }
}


function tryMoves(board: Board, movingPlayer: number, level: number): Move | undefined {
  let best: Move | undefined = undefined;

  for (let r = 0; r < board.size(); r++) {
    for (let c = 0; c < board.size(); c++) {
      if (!(board.getCandidatesAt(r, c) & movingPlayer)) {
        continue;
      }
      let move = setPlayerAt(board, r, c, movingPlayer);
      if (level > 0) {
        let nextLevelMove = tryMoves(move.board, 3 - movingPlayer, level--);
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

function setPlayerAt(board: Board, row: number, column: number, movingPlayer: number): Move {
  let score = 0;
  board = new Board(board.toState(false));
  board.setPlayerAt(row, column, movingPlayer, (r, c) => score += getWeight(board, row, column));
  return {
    row,
    column,
    player: movingPlayer,
    board,
    score
  };
}

function getWeight(board: Board, row: number, column: number): number {
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

interface Move {
  row: number,
  column: number,
  player: number,
  board: Board,
  score: number
}
