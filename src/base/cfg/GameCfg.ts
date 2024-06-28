/**
 * 配置初始化，加载，读取
 * @date 2024/6/27
 */

export type MaybeUndefined<T> = T | undefined;

type ConfigName = keyof ConfigMap;
type ConfigMultiName<K extends ConfigName> = keyof ConfigMultiMap<K>;
type ConfigTableMap<K extends ConfigName> = Omit<ConfigMap, ConfigMultiName<K>>; //集合上的差集，属A不属于B（从A中剔除B）
type ConfigTableName<K extends ConfigName> = keyof ConfigTableMap<K>;

class GameCfg {
  private static jsonPath = "json/";
  private static jsonCfgListPath = "json/cfgList.json";
  public static cfgMap: {
    [key in ConfigName]?: Record<string, ConfigMap[key]>;
  } = {};
  public static cfgListMap: { [key in ConfigName]?: ConfigMap[key][] } = {};

  public static init(): void {
    //
  }
}

export function initConfig(): void {
  GameCfg.init();
}

/**
 * 配置表（单key）
 * @param name
 */
export function getConfigByName<K extends ConfigTableName<K>>(
  name: K,
): Record<string, ConfigMap[K]> | undefined {
  return <Record<string, ConfigMap[K]>>GameCfg.cfgMap[name] ?? undefined;
}

/**
 * 配置表（单key）
 * @param name
 * @param id
 */
export function getConfigByNameId<K extends ConfigTableName<K>>(
  name: K,
  id: number | string,
): ConfigMap[K] | undefined {
  const cfgObj = getConfigByName(name);
  return cfgObj ? <ConfigMap[K]>cfgObj[id] : undefined;
}

/**
 * 配置表（单|多key）
 * @param name
 */
export function getConfigListByName<K extends ConfigName>(
  name: K,
): ConfigMap[K][] {
  return <ConfigMap[K][]>GameCfg.cfgListMap[name];
}

/**
 * 配置表（多key）
 * @param name
 */
export function getConfigMoreByName<K extends ConfigMultiName<K>>(
  name: K,
): ConfigMultiMap<K>[K] | undefined {
  return <any>GameCfg.cfgMap[name];
}
