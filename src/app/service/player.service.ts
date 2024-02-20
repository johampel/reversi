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
  private readonly worker?: Worker;

  constructor(private readonly store: Store<AppState>) {
    this.store.subscribe(appState => this.board = appState.board);
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../app.worker', import.meta.url));
      this.worker.onmessage = ({data}) => {
        this.store.dispatch(computerMove({board: data as BoardState}));
      };
    } else {
      console.log("Not supported - Game will not run on your host!");
    }

  }

  triggerComputeMove(): void {
    if (!this.board) {
      return;
    }
    this.worker?.postMessage({
      code: COMMAND_CALCULATE_NEXT_MOVE,
      data: this.board
    });
  }
}
