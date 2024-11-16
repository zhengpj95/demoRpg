/**
 * @date 2024/4/10
 */

/**模块枚举*/
export const enum ModuleType {
  LOGIN = 1,
  MISC = 2,
  BAG = 3,
  SCENE = 4,
  HIT_MOLE = 10, // 打地鼠

  TEST = 999, // 测试
}

/**模块proxy枚举（模块view枚举在各自模块下）*/
export const enum ProxyType {
  LOGIN = 1,
  MISC = 2,
  BAG = 3,
  SCENE = 4,

  TEST = 999, // 测试
}
