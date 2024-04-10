/**
 * @date 2024/4/10
 */
import { ModuleType, ProxyType } from "../ModuleConst";
import { BaseProxy } from "./BaseProxy";

type MdrCls = new () => Laya.Scene;

export class BaseModule {
  public name: ModuleType;
  private _proxyMap: { [type: number]: BaseProxy } = {};
  private _mdrMap: { [type: number]: MdrCls } = {};

  public constructor(module: ModuleType) {
    this.name = module;
  }

  public onReg(): void {
    this.initProxy();
    this.initMdr();
  }

  public initProxy(): void {
    //
  }

  public initMdr(): void {
    //
  }

  public regProxy(type: ProxyType, proxy: new () => BaseProxy): void {
    if (this._proxyMap[type]) {
      return;
    }
    const cls = new proxy(); // 单例模式，实例化保存
    cls.init();
    this._proxyMap[type] = cls;
  }

  public retProxy<T extends BaseProxy>(type: ProxyType): T {
    return <T>this._proxyMap[type];
  }

  public regMdr(viewType: number, mdr: MdrCls): void {
    if (this._mdrMap[viewType]) {
      return;
    }
    this._mdrMap[viewType] = mdr;
  }

  public retMdr(viewType: number): MdrCls {
    return this._mdrMap[viewType] ?? undefined;
  }
}
