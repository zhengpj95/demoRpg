export interface IPoolObject {
  onAlloc: () => void;
  onRelease: () => void;
}

export const enum BaseEvent {
  ADD_TO_SCENE = "base_add_to_scene", // 添加到场景
  REMOVE_FROM_SCENE = "base_remove_from_scene", // 从场景移除
  STAGE_CLICK = "base_stage_click", // 点击舞台
}
