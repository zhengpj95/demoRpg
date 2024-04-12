/**
 * @date 2024/4/10
 */
import { BaseModule } from "./BaseModule";
import { ModuleType } from "../ModuleConst";
import App from "../../App";

export let facade: Facade;

export function initFacade(): void {
  facade = new Facade();
  App.debugMgr.debug("facade", facade);
}

type BaseModuleCls = new () => BaseModule;

class Facade {
  private readonly _moduleMap: { [type: number]: BaseModule } = {};
  private readonly _moduleList: BaseModuleCls[] = [];

  // 注册模块
  public regModule(m: BaseModule): void {
    this._moduleMap[m.name] = m;
  }

  // 获取模块
  public retModule(type: ModuleType): BaseModule {
    return this._moduleMap[type];
  }

  // 加入模块，用于实例化
  public push<T extends BaseModuleCls>(cls: T): void {
    this._moduleList.push(cls);
  }

  // 实例所有模块
  public instantiate(): void {
    const list = this._moduleList;
    for (const m of list) {
      const cls = new m();
      if (cls) {
        cls.onReg();
        this.regModule(cls);
      }
    }
  }
}
