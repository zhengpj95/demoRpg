/**
 * @date 2024/4/10
 */
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { BaseProxy } from "./BaseProxy";
import { BaseCommand } from "./BaseCommand";
import { MessageMgr } from "../MessageMgr";
import { LayerIndex } from "@base/LayerMgr";

type MdrCls = new () => Laya.Scene;
type CmdCls = new () => BaseCommand;

export class BaseModule {
  public name: ModuleType;
  private _proxyMap: { [type: number]: BaseProxy } = {};
  private _mdrMap: { [type: number]: MdrCls } = {};
  private _cmdMap: { [type: number]: CmdCls } = {};
  private _mdrLayerIdxMap: { [type: number]: LayerIndex } = {}; // 所属层级

  public constructor(module: ModuleType) {
    this.name = module;
  }

  public onReg(): void {
    this.initCmd();
    this.initProxy();
    this.initMdr();
  }

  public initCmd(): void {
    //
  }

  public initProxy(): void {
    //
  }

  public initMdr(): void {
    //
  }

  public regCmd(event: string, cls: CmdCls): void {
    MessageMgr.ins().on(event, this.exeCmd, this, [event]);
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

  public regMdr(
    viewType: number,
    mdr: MdrCls,
    layerIdx = LayerIndex.WIN,
  ): void {
    if (this._mdrMap[viewType]) {
      return;
    }
    this._mdrMap[viewType] = mdr;
    this._mdrLayerIdxMap[viewType] = layerIdx;
  }

  public retMdr(viewType: number): MdrCls {
    return this._mdrMap[viewType];
  }

  public retMdrIdx(viewType: number): LayerIndex {
    return this._mdrLayerIdxMap[viewType];
  }
}
