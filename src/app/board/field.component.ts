import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {AppState, selectBoard} from "../shared/state/state";
import {select, Store} from "@ngrx/store";
import {AsyncPipe} from "@angular/common";
import {humanMove} from "../shared/state/actions";

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.css'
})
export class FieldComponent {


  @Input('column') column!: number;
  @Input('row') row!: number;

  protected state$: Observable<State>;

  constructor(private store: Store<AppState>) {
    this.state$ = store
      .pipe(select(selectBoard))
      .pipe(select(board => {
        let lastMoveFor = 2;
        while (lastMoveFor > 0) {
          if (board.lastMoves[lastMoveFor - 1][0] == this.row && board.lastMoves[lastMoveFor - 1][1] == this.column) {
            break;
          }
          lastMoveFor--;
        }
        return {
          currentPlayer: board.currentPlayer,
          playerIsHuman: board.currentPlayer !== board.computerPlayer,
          field: board.fields[board.size * this.row + this.column],
          candidates: board.candidates[board.size * this.row + this.column],
          lastMoveFor
        }
      }));
  }

  onClick(): void {
    this.store.dispatch(humanMove({row: this.row, column: this.column}));
  }

  calculateStyle(state: State | null): string {
    let style = ""
    if (state?.field === 1) {
      style = "player1"
    } else if (state?.field === 2) {
      style = "player2"
    }

    if (state?.lastMoveFor === 1) {
      style += " lastMovePlayer1";
    } else if (state?.lastMoveFor === 2) {
      style += " lastMovePlayer2";
    }

    if ((state?.candidates || 0) & (state?.currentPlayer || 0) && state?.playerIsHuman) {
      style += "candidate";
    }

    return style;
  }
}

interface State {
  readonly currentPlayer: number;
  readonly playerIsHuman: boolean;
  readonly field: number;
  readonly candidates: number;
  readonly lastMoveFor: number;
}
