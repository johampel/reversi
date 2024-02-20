import {createAction, props} from '@ngrx/store';
import {BoardState} from "./state";

export const newGame = createAction('[Board] New Game', props<{ size: number }>());
export const idle = createAction('[Board] Idle action');
export const humanMove = createAction('[Board] Human move', props<{ row: number, column: number }>());
export const humanPass = createAction('[Board] Human pass');
export const computerMove = createAction('[Board] Computer move', props<{board: BoardState}>());

