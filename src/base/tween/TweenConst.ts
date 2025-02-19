/**
 * @author zpj
 * @date 2025/2/19
 */

export interface IEase {
  in: EaseFunc;
  out: EaseFunc;
  inOut: EaseFunc;
}

export type EaseFunc = (t: number) => number; // 缓动函数类型

export const EaseNone: EaseFunc = (p) => p;
