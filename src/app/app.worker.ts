
import {PlayerService} from "./service/player.service";
import {BoardState} from "./shared/state/state";

export const COMMAND_CALCULATE_NEXT_MOVE = "calculateNextMove";

export interface Command {
  code: string,
  data?: object
}

addEventListener('message', ( {data}) => {
  if (data.code === COMMAND_CALCULATE_NEXT_MOVE) {
    const board = data.data as BoardState;
    PlayerService.computeMove(board);
  }
});
