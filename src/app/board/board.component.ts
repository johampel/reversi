import {Component} from '@angular/core';
import {AppState} from "../shared/state/state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {FieldComponent} from "./field.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    FieldComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  protected size$: Observable<number>

  constructor(private store: Store<AppState>) {
    this.size$ = this.store.select(state => state.board.size);
  }
}
