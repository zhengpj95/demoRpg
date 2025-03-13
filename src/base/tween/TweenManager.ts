import { TweenImpl } from "./Tween";
import { TweenManger } from "@base/tween/TweenConst";

let TWEEN_ID = 0;
const TWEEN_ID_FLAG = "$TWEEN_ID";

/**
 * @author zpj
 * @date @date 2025/2/19
 */
class TweenManagerImpl implements TweenManger {
  private tweens: TweenImpl[] = []; // 存储所有缓动实例
  private _tmpTweens: TweenImpl[] = [];

  private reg(tw: TweenImpl): TweenImpl {
    tw[TWEEN_ID_FLAG] = ++TWEEN_ID;
    this._tmpTweens.push(tw);
    return tw;
  }

  public get(
    target: any,
    vars?: { loop?: boolean; yoyo?: boolean; repeat?: number; scale?: number },
  ): TweenImpl {
    return this.reg(new TweenImpl().init(target, vars));
  }

  // 移除目标对象的所有缓动
  public remove(target: any): void {
    if (this._tmpTweens.length) {
      this.tweens.push(...this._tmpTweens);
      this._tmpTweens.length = 0;
    }
    this.tweens = this.tweens.filter((tween) => !tween.checkTarget(target));
  }

  // 更新所有缓动
  public update(): void {
    const currentTime = Date.now();
    if (this._tmpTweens.length) {
      this.tweens.push(...this._tmpTweens);
      this._tmpTweens.length = 0;
    }
    this.tweens = this.tweens.filter((tween) => !tween.update(currentTime));
  }
}

export const tweenMgr: TweenManger = new TweenManagerImpl();

export function loopTween(): void {
  (<TweenManagerImpl>tweenMgr).update();
}
