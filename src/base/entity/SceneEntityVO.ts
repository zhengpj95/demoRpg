export const enum SceneEntityType {
  PLAYER = 1,
  MONSTER = 2,
  DROP = 3,
}

export interface SceneEntityVO {
  entityId: number;
  name: string;
  hp: number;
  maxHp: number;
  power: number;
  type: SceneEntityType;
}

export interface ScenePlayerVO extends SceneEntityVO {
  vip: number;
}

export interface SceneMonsterVo extends SceneEntityVO {
  //
}

export interface SceneDropVO extends SceneEntityVO {
  //
}
