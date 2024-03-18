/**
 * 点击缩放效果
 */
export default class BtnClick extends Laya.Script {
  private _owner: Laya.UIComponent;

  constructor() {
    super();
  }

  public onAwake(): void {
    super.onAwake();
    this._owner = <Laya.UIComponent>this.owner;
  }

  public onEnable(): void {
    super.onEnable();
  }
}
