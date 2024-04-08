export const enum CompType {
  AVATAR = 1,
  MAP = 2,
  MOVE = 3,
  CAMERA = 4,
}

/**
 * 实体组件基类
 */
export class BaseComp {
  private _type: CompType;
  private _isRun: boolean;

  get isRun(): boolean {
    return this._isRun;
  }

  set isRun(value: boolean) {
    this._isRun = value;
  }

  get type(): CompType {
    return this._type;
  }

  set type(value: CompType) {
    this._type = value;
  }

  public start(): void {
    this.isRun = true;
  }

  public stop(): void {
    this.isRun = false;
  }

  public tick(delta: number): void {
    //
  }
}
