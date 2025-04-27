/**
 * @date 2024/4/10
 */
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { BaseProxy } from "./BaseProxy";
import { BaseCommand } from "./BaseCommand";
import { emitter } from "../MessageMgr";
import { DebugMgr } from "@base/DebugMgr";
import { BaseMediator } from "@base/mvc/BaseMediator";

type MdrCls = new () => BaseMediator;
type CmdCls = new () => BaseCommand;

export abstract class BaseModule {
  public name: ModuleType;

  private _cmdMap: { [type: number]: CmdCls } = {};
  private _proxyInsMap: { [type: number]: BaseProxy } = {};
  private _mdrMap: { [type: number]: MdrCls } = {};
  private _mdrInsMap: { [view: number]: BaseMediator } = {};

  protected constructor(module: ModuleType) {
    this.name = module;
  }

  public onReg(): void {
    this.initCmd();
    this.initProxy();
    this.initMdr();
  }

  // 子类继承
  protected abstract initCmd(): void;

  // 子类继承
  protected abstract initProxy(): void;

  // 子类继承
  protected abstract initMdr(): void;

  public regCmd(event: string, cls: CmdCls): void {
    emitter.on(event, this.exeCmd, this, [event]);
    this._cmdMap[event] = cls;
  }

  private exeCmd(event: string, args?: any): void {
    const cls = this._cmdMap[event];
    if (cls) {
      const cmd: BaseCommand = new cls();
      cmd.exec(args);
    }
  }

  public regProxy(type: ProxyType, proxy: new () => BaseProxy): void {
    if (this._proxyInsMap[type]) {
      return;
    }
    const cls = new proxy(); // 单例模式，实例化保存
    cls.init();
    this._proxyInsMap[type] = cls;
    DebugMgr.ins().debugProxy(cls);
  }

  public retProxy<T extends BaseProxy>(type: ProxyType): T {
    return <T>this._proxyInsMap[type];
  }

  public regMdr(viewType: number, mdr: MdrCls): void {
    if (this._mdrMap[viewType]) {
      return;
    }
    this._mdrMap[viewType] = mdr;
  }

  public retMdr(viewType: number): MdrCls {
    return this._mdrMap[viewType];
  }

  public regMdrIns(mdr: BaseMediator): void {
    if (this._mdrInsMap[mdr.getViewType()]) {
      return;
    }
    this._mdrInsMap[mdr.getViewType()] = mdr;
  }

  public retMdrIns(viewType: number): BaseMediator {
    return this._mdrInsMap[viewType];
  }

  public removeMdrIns(viewType: number): void {
    const mdrIns = this.retMdrIns(viewType);
    if (mdrIns) {
      mdrIns.close();
      this._mdrInsMap[viewType] = undefined;
      delete this._mdrInsMap[viewType];
    }
  }
}
