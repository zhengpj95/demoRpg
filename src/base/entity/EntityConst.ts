/**
 * @date 2024/6/18
 */

export const enum SceneEntityType {
  PLAYER = 1,
  MONSTER = 2,
  DROP = 3,
}

export const enum Action {
  Walk = "Walk",
  Idle = "Idle",
  ATTACK = "Attack",
  Hurt = "Hurt",
  Death = "Death",
}

export const enum Direction {
  Top = 0,
  TopRight = 1,
  Right = 2,
  BottomRight = 3,
  Bottom = 4,
  BottomLeft = 5,
  Left = 6,
  TopLeft = 7,
}

export const enum MonsterType {
  BOSS = 1,
  MONSTER = 2,
}
