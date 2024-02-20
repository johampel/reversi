import {Component} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {AppState, BoardState, selectBoard} from "../shared/state/state";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {humanPass, newGame} from "../shared/state/actions";

@Component({
  selector: 'app-game-state',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './game-state.component.html',
  styleUrl: './game-state.component.css'
})
export class GameStateComponent {

  protected board$: Observable<BoardState>;
  protected status$: Observable<Status>;

  constructor(private store: Store<AppState>) {
    this.board$ = this.store.select(selectBoard);
    this.status$ = this.board$.pipe(select(board => {
      if (board.playersCanMove) {
        if (board.computerPlayer != board.currentPlayer) {
          return (board.playersCanMove & board.currentPlayer) ? Status.HumanMustPlay : Status.HumanMustPass;
        } else {
          return Status.ComputerMustPlay;
        }
      } else {
        if (board.score[0] != board.score[1]) {
          return board.score[0] > board.score[1] ? Status.Won : Status.Lost;
        }
        return Status.Remis;
      }
    }));
  }

  onPass() {
    this.store.dispatch(humanPass());
  }

  onNewGame() {
    this.store.dispatch(newGame({size: 8}));
  }

  public Status = Status
}

export enum Status {
  HumanMustPlay,
  HumanMustPass,
  ComputerMustPlay,
  Won,
  Remis,
  Lost
}
