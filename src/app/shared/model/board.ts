import {BoardState} from "../state/state";

const DIRECTIONS: [number, number][] = [[-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]]

export class Board {

  private fields?: Array<number>;
  private candidates?: Array<number>;
  private lastMoves?: [[number, number], [number, number]];

  constructor(private readonly state: BoardState) {
    this.fields = undefined;
    this.candidates = undefined;
  }

  toState(togglePlayer: boolean): BoardState {
    if (this.fields || this.candidates || this.lastMoves) {
      return {
        size: this.state.size,
        fields: this.fields || this.state.fields,
        candidates: this.candidates || this.state.candidates,
        lastMoves: this.lastMoves || this.state.lastMoves,
        score: [
          this.fields?.filter(f => f === 1).length || this.state.score[0],
          this.fields?.filter(f => f === 2).length || this.state.score[1]
        ],
        playersCanMove: this.candidates ? this.candidates.reduce((a, b) => a | b, 0) : this.state.playersCanMove,
        currentPlayer: togglePlayer ? 3 - this.state.currentPlayer : this.state.currentPlayer,
        computerPlayer: this.state.computerPlayer
      };
    } else if (togglePlayer) {
      return {...this.state, currentPlayer: 3 - this.state.currentPlayer}
    } else {
      return this.state;
    }
  }

  size(): number {
    return this.state.size;
  }


  getLastMove(player: number): [number, number] {
    let last = this.lastMoves || this.state.lastMoves;
    switch (player) {
      case 1:
        return last[0];
      case 2:
        return last[1];
    }
    return [-1, -1];
  }

  getScores(): [number, number] {
    let players = [0, 0, 0];
    for (let field of this.fields || []) {
      players[field]++;
    }
    return [players[1], players[2]];
  }

  getCandidatesAt(row: number, column: number): number {
    if (this.candidates) {
      return this.candidates[row * this.state.size + column] || 0;
    } else {
      return this.state.candidates[row * this.state.size + column] || 0;
    }
  }

  getPlayerAt(row: number, column: number): number {
    if (this.fields) {
      return this.fields[row * this.state.size + column] || 0;
    } else {
      return this.state.fields[row * this.state.size + column] || 0;
    }
  }

  setPlayerAt(row: number, column: number, player: number, callback?: (row: number, column: number) => void): Board {
    if (!(this.getCandidatesAt(row, column) & player)) {
      return this;
    }
    if (!this.lastMoves) {
      this.lastMoves = [...this.state.lastMoves]
    }
    this.lastMoves[player - 1] = [row, column];
    this.lastMoves[2 - player] = [-1, -1];
    return this.setPlayerAtInternal(row, column, player, callback)
      .flipLinesAtForPlayer(row, column, player, callback)
      .updateCandidates();
  }

  protected flipLinesAtForPlayer(row: number, column: number, player: number, callback?: (row: number, column: number) => void): Board {
    for (let direction of DIRECTIONS) {
      let len = this.getLineLengthAtForDirectionAndPlayer(row, column, direction[0], direction[1], player);
      for (let i = 1; i <= len; i++) {
        this.setPlayerAtInternal(row + i * direction[0], column + i * direction[1], player, callback);
      }
    }
    return this;
  }

  protected updateCandidates(): Board {
    if (!this.candidates || !this.fields) {
      return this;
    }
    for (let r = 0; r < this.state.size; r++) {
      for (let c = 0; c < this.state.size; c++) {
        let index = r * this.state.size + c;
        this.candidates[index] = 0;
        if (!this.fields[index]) {
          if (this.isCandidateAtForPlayer(r, c, 1)) {
            this.candidates[index] += 1;
          }
          if (this.isCandidateAtForPlayer(r, c, 2)) {
            this.candidates[index] += 2;
          }
        }
      }
    }
    return this;
  }

  protected isCandidateAtForPlayer(row: number, column: number, player: number): boolean {
    for (let direction of DIRECTIONS) {
      if (this.getLineLengthAtForDirectionAndPlayer(row, column, direction[0], direction[1], player)) {
        return true;
      }
    }
    return false;
  }

  protected getLineLengthAtForDirectionAndPlayer(row: number, column: number, dr: number, dc: number, player: number): number {
    for (let i = 1; i < this.state.size; i++) {
      let r = row + dr * i;
      if (r < 0 || r >= this.state.size) {
        return 0;
      }
      let c = column + dc * i;
      if (c < 0 || c >= this.state.size) {
        return 0;
      }
      let p = this.getPlayerAt(r, c);
      if (!p) {
        return 0;
      }
      if (p === player) {
        return i - 1;
      }
    }
    return 0;
  }

  protected setPlayerAtInternal(row: number, column: number, player: number, callback?: (row: number, column: number) => void): Board {
    if (!this.fields) {
      this.fields = [...this.state.fields];
    }
    if (!this.candidates) {
      this.candidates = [...this.state.candidates];
    }
    if (callback) {
      callback(row, column)
    }
    this.fields[row * this.state.size + column] = player;
    return this;
  }

  static newGame(size: number): Board {
    return Board.empty(size)
      .setPlayerAtInternal(size / 2 - 1, size / 2 - 1, 1)
      .setPlayerAtInternal(size / 2 - 1, size / 2, 2)
      .setPlayerAtInternal(size / 2, size / 2 - 1, 2)
      .setPlayerAtInternal(size / 2, size / 2, 1)
      .updateCandidates();
  }

  static empty(size: number): Board {
    if (size <= 2 || size % 2 != 0) {
      throw Error(`Board size must be even and bigger than 2, but is ${size}`)
    }
    return new Board({
      size: size,
      fields: Array(size * size).fill(0),
      candidates: Array(size * size).fill(0),
      score: [0, 0],
      lastMoves: [[-1, -1], [-1, -1]],
      playersCanMove: 0,
      currentPlayer: 1,
      computerPlayer: 2
    });
  }
}
