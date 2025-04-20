import { ModuleType } from "@def/ModuleConst";
import { emitter } from "@base/MessageMgr";
import { CommonEvent, IOpenCloseData } from "@def/misc";

export interface ISceneUpdate extends IPoolObject {
  update: (elapsed: number) => void;
}

export interface IPoolObject {
  onAlloc: () => void;
  onRelease: () => void;
}

export const enum BaseEvent {
  STAGE_CLICK = "base_stage_click", // 点击舞台
}

export interface PathNode {
  x: number;
  y: number;
}

export function openView(m: ModuleType, v: number | string, param?: any): void {
  emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
    module: m,
    view: v,
    param: param,
  });
}

export function closeView(m: ModuleType, v: number | string): void {
  emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
    module: m,
    view: v,
  });
}
