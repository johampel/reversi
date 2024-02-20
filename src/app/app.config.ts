import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideState, provideStore} from '@ngrx/store';
import {routes} from './app.routes';
import {boardStateReducer} from "./shared/state/reducers";
import {provideEffects} from "@ngrx/effects";
import {BoardEffects} from "./shared/state/effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideState('board', boardStateReducer),
    provideEffects(BoardEffects)
  ],
};
