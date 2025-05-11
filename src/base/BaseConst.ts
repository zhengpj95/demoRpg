import { ModuleName } from "@def/ModuleConst";
import { emitter } from "@base/MessageMgr";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import { DebugMgr } from "@base/DebugMgr";

export interface IPoolObject {
  release?: () => void; // 内部自行清理并回收，放回对象池
  destroy?: () => void; // 销毁时调用，onRelease时若超出容量则会销毁

  onAlloc: () => void;
  onRelease: () => void;
}

export interface ISceneUpdate {
  update: (elapsed: number) => void;
}

export interface IComponent extends ISceneUpdate {
  start: () => void;
  stop: () => void;
}

export const enum BaseEvent {
  STAGE_CLICK = "base_stage_click", // 点击舞台
}

export interface PathNode {
  x: number;
  y: number;
}

export function openView(m: ModuleName, v: number | string, param?: any): void {
  emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
    module: m,
    view: v,
    param: param,
  });
}

export function closeView(m: ModuleName, v: number | string): void {
  emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
    module: m,
    view: v,
  });
}

DebugMgr.ins().debug("openView", openView);
DebugMgr.ins().debug("closeView", closeView);
