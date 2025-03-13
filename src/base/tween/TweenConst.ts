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
export type TweenProperties = Record<string, number>; // 目标属性的键值对
export type OnCompleteCallback = () => void; // 缓动完成时的回调函数
export const EaseNone: EaseFunc = (p) => p;

export interface TweenManger {
  /**
   * 获取缓动tween
   * @param target 缓动对象
   * @param vars 额外参数
   * @param vars.loop 是否循环播放动画，默认false
   * @param vars.yoyo 循环使用yoyo反向播放效果，默认false
   * @param vars.repeat 重复次数，默认0
   * @param vars.scale 动画时间缩放比例，默认1
   */
  get: (
    target: any,
    vars?: { loop?: boolean; yoyo?: boolean; repeat?: number; scale?: number },
  ) => Tween;

  /**
   * 移除缓动对象所有的缓动
   * @param target 缓动对象
   */
  remove: (target: any) => void;
}

export interface Tween {
  /**
   * 开始活动，从当前值变化到目标值
   * @param properties 目标属性集合
   * @param duration 持续时间，单位毫秒
   * @param ease 缓动函数
   * @param onComplete 完成回调
   */
  to: (
    properties: TweenProperties,
    duration: number,
    ease?: EaseFunc,
    onComplete?: OnCompleteCallback,
  ) => void;

  /**
   * 开始活动，从目标值变化到当前值
   * @param properties 目标属性集合
   * @param duration 持续时间，单位毫秒
   * @param ease 缓动函数
   * @param onComplete 完成回调
   */
  from: (
    properties: TweenProperties,
    duration: number,
    ease?: EaseFunc,
    onComplete?: OnCompleteCallback,
  ) => void;
}
