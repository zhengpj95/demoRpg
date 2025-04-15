/**
 * @date 2024/6/16
 */
export const enum SceneViewType {
  SCENE = 1,
}

export const enum SceneEvent {
  ADD_TO_SCENE = "base_add_to_scene", // 添加到场景
  REMOVE_FROM_SCENE = "base_remove_from_scene", // 从场景移除
  MOVE_END = "scene_move_end", // 移动结束
}
