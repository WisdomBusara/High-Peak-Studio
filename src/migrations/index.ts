import * as migration_20260928_212722_initial from './20260928_212722_initial';
import * as migration_20260929_092549_team_press_featured from './20260929_092549_team_press_featured';

export const migrations = [
  {
    up: migration_20260928_212722_initial.up,
    down: migration_20260928_212722_initial.down,
    name: '20260928_212722_initial',
  },
  {
    up: migration_20260929_092549_team_press_featured.up,
    down: migration_20260929_092549_team_press_featured.down,
    name: '20260929_092549_team_press_featured'
  },
];
