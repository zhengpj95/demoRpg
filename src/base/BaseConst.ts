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
