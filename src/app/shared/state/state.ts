export interface BoardState {
  readonly size: number;
  readonly fields: ReadonlyArray<number>;
  readonly candidates: ReadonlyArray<number>;
  readonly lastMoves: [[number, number], [number, number]];
  readonly score: [number, number];
  readonly playersCanMove: number;
  readonly currentPlayer: number;
  readonly computerPlayer: number;
}

export const initialBoardState: BoardState = {
  size: 0,
  fields: [],
  candidates: [],
  lastMoves: [[-1, -1], [-1, -1]],
  score: [0,0],
  playersCanMove: 0,
  currentPlayer: 1,
  computerPlayer: 2
};

export interface AppState {
  board: BoardState;
}

export const selectBoard = (state: AppState) => state.board;
