import { EaseFunc, EaseNone } from "./TweenConst";

/**
 * @author zpj
 * @date 2025/2/19
 */
type TweenProperties = Record<string, number>; // 目标属性的键值对
type OnCompleteCallback = () => void; // 缓动完成时的回调函数

export class Tween {
  public target: any; // 缓动目标对象
  private duration: number; // 缓动持续时间
  private properties: TweenProperties; // 目标属性
  private startTime: number | null = null; // 缓动开始时间
  private startProperties: TweenProperties = {}; // 初始属性值
  private loop: boolean; // 是否无限循环
  private yoyo: boolean; // 是否启用 yoyo 效果
  private isReversing: boolean = false; // 是否正在反向播放
  private repeat: number; // 重复次数
  private repeatCount: number = 0; // 当前重复次数
  private ease: EaseFunc; // 缓动函数
  private onComplete?: OnCompleteCallback; // 完成回调
  private timeScale = 1; //时间缩放

  public init(
    target: any,
    vars?: { loop?: boolean; yoyo?: boolean; repeat?: number; scale?: number },
  ): this {
    this.target = target;
    this.loop = (vars && vars.loop) || false;
    this.yoyo = (vars && vars.yoyo) || false;
    this.repeat = (vars && vars.repeat) || 0;
    this.timeScale = (vars && vars.scale) || 1;
    this.ease = EaseNone;
    this.duration = 0;
    this.properties = {};
    this.onComplete = undefined;
    return this;
  }

  public to(
    properties: TweenProperties,
    duration: number,
    ease: EaseFunc = EaseNone,
    onComplete?: OnCompleteCallback,
  ): void {
    this.properties = properties;
    this.duration = duration;
    this.ease = ease || EaseNone;
    this.onComplete = onComplete;
    this.start();
  }

  public from(
    properties: TweenProperties,
    duration: number,
    ease: EaseFunc = EaseNone,
    onComplete?: OnCompleteCallback,
  ): void {
    this.properties = properties;
    this.duration = duration;
    this.ease = ease || EaseNone;
    this.onComplete = onComplete;
    this.start(true);
  }

  // 启动缓动
  private start(isFrom = false): void {
    this.startTime = Date.now();
    if (isFrom) {
      for (const prop in this.properties) {
        this.startProperties[prop] = this.properties[prop];
        this.properties[prop] = this.target[prop];
      }
    } else {
      for (const prop in this.properties) {
        this.startProperties[prop] = this.target[prop];
      }
    }
  }

  // 更新缓动
  public update(currentTime: number): boolean {
    if (this.startTime === null) return false;

    const elapsed = currentTime - this.startTime;
    let t = (elapsed * this.timeScale) / this.duration;

    if (t >= 1) {
      // 缓动完成
      if (this.yoyo && !this.isReversing) {
        // 启用 yoyo 且未反向播放时，重置并反向播放
        this.isReversing = true;
        this.startTime = currentTime;
        return false;
      } else if (this.loop || (this.repeat && this.repeatCount < this.repeat)) {
        // 启用 loop 或 repeat 时，重置并重新开始
        this.isReversing = false;
        this.startTime = currentTime;
        this.repeatCount++;
        return false;
      } else {
        // 设置最终值
        for (const prop in this.properties) {
          this.target[prop] = this.isReversing
            ? this.startProperties[prop]
            : this.properties[prop];
        }
        if (this.onComplete) {
          this.onComplete();
        }
        return true; // 缓动完成
      }
    } else {
      // 计算当前值
      if (this.isReversing) {
        t = 1 - t; // 反向播放
      }
      t = this.ease(t); // 应用缓动函数
      for (const prop in this.properties) {
        const startValue = this.startProperties[prop];
        const endValue = this.properties[prop];
        this.target[prop] = startValue + (endValue - startValue) * t;
      }
      return false; // 缓动未完成
    }
  }

  public checkTarget(target: any): boolean {
    return this.target && this.target === target;
  }
}
