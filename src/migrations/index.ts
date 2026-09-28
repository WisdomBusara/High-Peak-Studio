import * as migration_20260928_212722_initial from './20260928_212722_initial';

export const migrations = [
  {
    up: migration_20260928_212722_initial.up,
    down: migration_20260928_212722_initial.down,
    name: '20260928_212722_initial'
  },
];
