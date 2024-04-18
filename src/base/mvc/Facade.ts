/**
 * @date 2024/4/10
 */
import { BaseModule } from "./BaseModule";
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { DebugMgr } from "../DebugMgr";
import { BaseProxy } from "@base/mvc/BaseProxy";

export let facade: Facade;

export function initFacade(): void {
  facade = new Facade();
  DebugMgr.ins().debug("facade", facade);
}

// 获取proxy
export function getProxy<T extends BaseProxy>(
  module: ModuleType,
  proxy: ProxyType,
): T {
  const m = facade.retModule(module);
  if (!m) {
    console.error(`getProxy error，不存在module: ${module}`);
    return undefined;
  }
  const p = m.retProxy<T>(proxy);
  if (!p) {
    console.error(`getProxy error，不存在proxy: ${proxy}`);
    return;
  }
  return p;
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
