import { IPoolObject } from "../BaseConst";

export class SceneEntity implements IPoolObject {
  onAlloc(): void {}

  onRelease(): void {}
}

export class ScenePlayer extends SceneEntity {}

export class SceneMonster extends SceneEntity {}

export class SceneDrop extends SceneEntity {}
