import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BoardComponent} from "./board/board.component";
import {select, Store} from "@ngrx/store";
import {AppState, BoardState, selectBoard} from "./shared/state/state";
import {newGame} from "./shared/state/actions";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {GameStateComponent} from "./game/game-state.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent, AsyncPipe, GameStateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'reversi';

  protected board$: Observable<BoardState>

  constructor(private appState: Store<AppState>) {
    this.board$ = appState.pipe(select(selectBoard));
  }

  ngOnInit(): void {
    this.appState.dispatch(newGame({size: 8}));
  }
}
