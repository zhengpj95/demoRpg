/**
 * json配置定义
 * @date 2024/6/27
 */

declare const enum ConfigName {
  ITEM = "item",
  BAG_TYPE = "bag_type",
  TEST2 = "test2",
  TEST3 = "test3",
}

declare interface ConfigMap {
  [ConfigName.ITEM]: ItemConfig;
  [ConfigName.BAG_TYPE]: BagTypeConfig;
  [ConfigName.TEST2]: Test2Config;
  [ConfigName.TEST3]: Test3Config;
}

declare interface ConfigMultiMap<K extends ConfigName> {
  [ConfigName.TEST2]: ConfigMap2<K>;
  [ConfigName.TEST3]: ConfigMap3<K>;
}

// 二维表定义
type ConfigMap2<K extends ConfigName> = Record<
  string,
  Record<string, ConfigMap[K]>
>;
// 三维表定义
type ConfigMap3<K extends ConfigName> = Record<
  string,
  Record<string, Record<string, ConfigMap[K]>>
>;

// 道具表
declare interface ItemConfig {
  readonly id: number;
  readonly icon: number;
  readonly desc: string;
  readonly name: string;
}

// 背包类型表
declare interface BagTypeConfig {
  readonly type: number;
  readonly name: string;
  readonly cnt: number;
}

// 二维表
declare interface Test2Config {
  readonly id: number;
  readonly id1: number;
  readonly name: string;
  readonly desc: string;
}

// 三维表
declare interface Test3Config {
  readonly id: number;
  readonly id1: number;
  readonly id2: number;
  readonly name: string;
  readonly desc: string;
}
