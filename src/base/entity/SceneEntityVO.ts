import { MonsterType, SceneEntityType } from "./EntityConst";

export interface SceneEntityVO {
  entityId: number; //唯一id
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
  monsterType: MonsterType;
}

export interface SceneDropVO extends SceneEntityVO {
  itemId: number; // 道具id
}
