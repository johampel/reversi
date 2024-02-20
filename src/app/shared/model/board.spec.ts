import {Board} from './board';
import {BoardState} from "../state/state";


describe('Board', () => {

  describe('empty', () => {
    it('initializes an empty board of the wanted size, if size is >=4', () => {
      let board = Board.empty(4);
      expect(board.toState(false)).toEqual({
        size: 4,
        fields: str2Array('' +
          '0,0,0,0,' +
          '0,0,0,0,' +
          '0,0,0,0,' +
          '0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,' +
          '0,0,0,0,' +
          '0,0,0,0,' +
          '0,0,0,0'),
        score: [0, 0],
        playersCanMove: 0,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      });
    })

    it('fails is size is odd', () => {
      expect(() => Board.empty(5)).toThrow(new Error("Board size must be even and bigger than 2, but is 5"));
    })

    it('fails is size is <4', () => {
      expect(() => Board.empty(2)).toThrow(new Error("Board size must be even and bigger than 2, but is 2"));
    })
  })

  describe('newGame', () => {
    it('initializes the board correctly for ot', () => {
      let board = Board.newGame(6);
      expect(board.toState(false)).toEqual({
        size: 6,
        fields: str2Array('' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,1,2,0,0,' +
          '0,0,2,1,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,' +
          '0,0,2,1,0,0,' +
          '0,2,0,0,1,0,' +
          '0,1,0,0,2,0,' +
          '0,0,1,2,0,0,' +
          '0,0,0,0,0,0'),
        score: [2, 2],
        playersCanMove: 3,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      });
    })
  })

  describe('setPlayerAtInternal', () => {
    it('sets the given player at the specified location in the fields array (and nothing else)', () => {
      let board = new TestBoard(Board.empty(6).toState(false));
      board.setPlayerAtInternal(0, 1, 1);
      board.setPlayerAtInternal(2, 3, 2);
      board.setPlayerAtInternal(4, 5, 1);
      expect(board.toState(false)).toEqual({
        size: 6,
        fields: str2Array('' +
          '0,1,0,0,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,2,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,1,' +
          '0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0,' +
          '0,0,0,0,0,0'),
        score: [2, 1],
        playersCanMove: 0,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      });
    })

    it('invokes the callback, if provided', () => {
      let board = new TestBoard(Board.empty(6).toState(false));
      let recordedCalls: number[] = [];
      let callback = (r: number, c: number) => {
        recordedCalls.push(r);
        recordedCalls.push(c);
      };

      board.setPlayerAtInternal(0, 1, 1, callback);
      board.setPlayerAtInternal(2, 3, 2, callback);
      board.setPlayerAtInternal(4, 5, 1, callback);
      expect(recordedCalls).toEqual([0, 1, 2, 3, 4, 5]);
    })
  })

  describe('getLineLengthAtForDirectionAndPlayer', () => {

    let board: TestBoard;

    beforeEach(() => {
      board = new TestBoard({
        size: 8,
        fields: str2Array('' +
          '1,1,0,0,0,0,0,0,' +
          '2,0,0,0,0,1,0,0,' +
          '0,0,0,0,0,0,1,0,' +
          '0,0,0,0,0,0,0,2,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        score: [0, 0],
        playersCanMove: 0,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      })
    });

    it('returns 0, if line contains an empty field before the own one', () => {
      expect(board.getLineLengthAtForDirectionAndPlayer(3, 0, -1, 0, 1)).toEqual(0);
    })

    it('returns 0, if line not terminated by own stone', () => {
      expect(board.getLineLengthAtForDirectionAndPlayer(0, 0, 0, 1, 1)).toEqual(0);
      expect(board.getLineLengthAtForDirectionAndPlayer(0, 2, 0, -1, 1)).toEqual(0);
    })

    it('returns the length for correct lines', () => {
      expect(board.getLineLengthAtForDirectionAndPlayer(0, 4, 1, 1, 2)).toEqual(2);
      expect(board.getLineLengthAtForDirectionAndPlayer(2, 0, -1, 0, 1)).toEqual(1);
    })
  })

  describe('isCandidateAtForPlayer', () => {

    let board: TestBoard;

    beforeEach(() => {
      board = new TestBoard({
        size: 8,
        fields: str2Array('' +
          '1,1,0,0,0,0,0,0,' +
          '2,0,0,0,0,1,0,0,' +
          '0,0,0,0,0,0,1,0,' +
          '0,0,0,0,0,0,0,2,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        score: [0, 0],
        playersCanMove: 0,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      })
    });

    it('returns false, if it is not a candidate', () => {
      expect(board.isCandidateAtForPlayer(3, 0, 1)).toBeFalsy();
      expect(board.isCandidateAtForPlayer(2, 0, 2)).toBeFalsy();
    })

    it('returns true, if it is a candidate', () => {
      expect(board.isCandidateAtForPlayer(2, 0, 1)).toBeTruthy();
      expect(board.isCandidateAtForPlayer(0, 4, 2)).toBeTruthy();
    })
  })

  describe('updateCandidates', () => {
    it('recalculates the candidates al over the board', () => {
      let board: TestBoard = new TestBoard(Board.empty(6).toState(false));
      board.setPlayerAtInternal(0, 0, 2);
      board.setPlayerAtInternal(1, 1, 1);
      board.setPlayerAtInternal(2, 2, 1);
      board.setPlayerAtInternal(2, 3, 2);
      board.setPlayerAtInternal(1, 3, 2);
      board.setPlayerAtInternal(0, 3, 1);
      board.setPlayerAtInternal(4, 0, 1);
      board.setPlayerAtInternal(4, 1, 2);
      board.setPlayerAtInternal(5, 0, 2);
      board.setPlayerAtInternal(5, 1, 1);

      board.updateCandidates();

      expect(board.toState(false)).toEqual({
        size: 6,
        fields: str2Array('' +
          '2,0,0,1,0,0,' +
          '0,1,0,2,0,0,' +
          '0,0,1,2,0,0,' +
          '0,0,0,0,0,0,' +
          '1,2,0,0,0,0,' +
          '2,1,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,1,0,' +
          '0,0,0,0,0,0,' +
          '0,2,0,0,1,0,' +
          '2,3,0,3,0,0,' +
          '0,0,1,0,0,0,' +
          '0,0,2,0,0,0'),
        score: [5, 5],
        playersCanMove: 3,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      });
    })
  })

  describe('flipLinesAtForPlayer', () => {

    let board: TestBoard;

    beforeEach(() => {
      board = new TestBoard({
        size: 8,
        fields: str2Array('' +
          '1,0,0,2,0,0,1,0,' +
          '0,2,0,1,0,2,0,0,' +
          '0,0,2,1,2,0,0,0,' +
          '2,1,1,0,1,1,2,0,' +
          '0,0,2,1,2,0,0,0,' +
          '0,2,0,1,0,2,0,0,' +
          '1,0,0,2,0,0,1,0,' +
          '0,0,0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        score: [0, 0],
        playersCanMove: 0,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      })
    });

    it('flips the matching lines', () => {
      board.flipLinesAtForPlayer(3, 3, 1);

      expect(board.toState(false)).toEqual({
        size: 8,
        fields: str2Array('' +
          '1,0,0,2,0,0,1,0,' +
          '0,1,0,1,0,1,0,0,' +
          '0,0,1,1,1,0,0,0,' +
          '2,1,1,0,1,1,2,0,' +
          '0,0,1,1,1,0,0,0,' +
          '0,1,0,1,0,1,0,0,' +
          '1,0,0,2,0,0,1,0,' +
          '0,0,0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        score: [20, 4],
        playersCanMove: 0,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      });
    })

    it('invokes the callback, if provided', () => {
      let recordedCalls: number[] = [];
      let callback = (r: number, c: number) => {
        recordedCalls.push(r);
        recordedCalls.push(c);
      };

      board.flipLinesAtForPlayer(3, 3, 1, callback);

      expect(recordedCalls).toEqual([
        2, 2,
        1, 1,
        2, 4,
        1, 5,
        4, 2,
        5, 1,
        4, 4,
        5, 5
      ]);
    })
  })

  describe('setPlayerAt', () => {

    let board: TestBoard;

    beforeEach(() => {
      board = new TestBoard({
        size: 8,
        fields: str2Array('' +
          '1,0,0,2,0,0,1,0,' +
          '0,2,2,1,2,2,0,0,' +
          '0,0,2,1,2,0,0,0,' +
          '2,1,1,0,1,1,2,0,' +
          '0,2,2,1,2,2,0,0,' +
          '0,2,0,1,0,2,0,0,' +
          '1,0,0,2,0,0,1,0,' +
          '0,0,0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,3,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0,' +
          '0,0,0,0,0,0,0,0'),
        score: [0, 0],
        playersCanMove: 3,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[-1, -1], [-1, -1]]
      })
    });

    it('makes all adaptions for a move', () => {
      board.setPlayerAt(3, 3, 1);

      expect(board.toState(false)).toEqual({
        size: 8,
        fields: str2Array('' +
          '1,0,0,2,0,0,1,0,' +
          '0,1,2,1,2,1,0,0,' +
          '0,0,1,1,1,0,0,0,' +
          '2,1,1,1,1,1,2,0,' +
          '0,2,1,1,1,2,0,0,' +
          '0,1,0,1,0,1,0,0,' +
          '1,0,0,2,0,0,1,0,' +
          '0,0,0,0,0,0,0,0'),
        candidates: str2Array('' +
          '0,1,1,0,1,1,0,0,' +
          '2,0,0,0,0,0,2,0,' +
          '0,2,0,0,0,2,0,0,' +
          '0,0,0,0,0,0,0,1,' +
          '1,0,0,0,0,0,1,0,' +
          '1,0,2,0,2,0,1,0,' +
          '0,2,0,0,0,2,0,0,' +
          '0,0,0,1,0,0,0,0'),
        score: [21, 8],
        playersCanMove: 3,
        currentPlayer: 1,
        computerPlayer: 2,
        lastMoves: [[3, 3], [-1, -1]]
      });
    })

    it('invokes the callback, if provided', () => {
      let recordedCalls: number[] = [];
      let callback = (r: number, c: number) => {
        recordedCalls.push(r);
        recordedCalls.push(c);
      };

      board.setPlayerAt(3, 3, 1, callback);

      expect(recordedCalls).toEqual([
        3, 3,
        2, 2,
        1, 1,
        2, 4,
        1, 5,
        4, 2,
        5, 1,
        4, 4,
        5, 5
      ]);
    })
  })

  function str2Array(str: string): number[] {
    return str.split(',').map(n => parseInt(n));
  }
});

class TestBoard extends Board {

  constructor(state: BoardState) {
    super(state);
  }

  public override flipLinesAtForPlayer(row: number, column: number, player: number, callback?: (row: number, column: number) => void): Board {
    return super.flipLinesAtForPlayer(row, column, player, callback);
  }

  public override updateCandidates(): Board {
    return super.updateCandidates();
  }


  public override isCandidateAtForPlayer(row: number, column: number, player: number): boolean {
    return super.isCandidateAtForPlayer(row, column, player);
  }

  public override getLineLengthAtForDirectionAndPlayer(row: number, column: number, dr: number, dc: number, player: number): number {
    return super.getLineLengthAtForDirectionAndPlayer(row, column, dr, dc, player);
  }

  public override setPlayerAtInternal(row: number, column: number, player: number, callback?: (row: number, column: number) => void): Board {
    return super.setPlayerAtInternal(row, column, player, callback);
  }
}
