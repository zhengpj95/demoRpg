/**
 * 配置初始化，加载，读取
 * @date 2024/6/27
 */
class GameConfig {
  public static init(): void {
    //
  }
}

export function initConfig(): void {
  GameConfig.init();
}

export function getConfigByName<K extends ConfigName>(
  name: K,
): ConfigMap[K] | undefined {
  return undefined;
}

export function getConfigByNameId<K extends ConfigName>(
  name: K,
  id: number | string,
): ConfigMap[K] | undefined {
  return undefined;
}
