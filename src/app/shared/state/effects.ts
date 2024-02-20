import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {humanMove, humanPass, idle} from "./actions";
import {map, tap} from "rxjs";
import {PlayerService} from "../../service/player.service";

@Injectable()
export class BoardEffects {

  readonly effectComputerMove$ = createEffect(
    () => this.actions$.pipe(
      ofType(humanMove, humanPass),
      tap(move => this.playerService.triggerComputeMove()),
      map(move => idle())
    ));

  constructor(private actions$: Actions, private playerService: PlayerService) {
  }

}
