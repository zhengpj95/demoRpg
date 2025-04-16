import SingletonClass from "@base/core/SingletonClass";

/**
 * @author zpj
 * @date 2025/4/16
 */
export class TimerMgr extends SingletonClass {
  public static ins: () => TimerMgr;
  private _timerList: { thisObj: any; func: (elapsed: number) => void }[] = [];
  private _lastLoop: number = 0;

  public addTimer(thisObj: any, func: (elapsed: number) => void): void {
    for (const item of this._timerList) {
      if (item.thisObj === thisObj && item.func === func) {
        return;
      }
    }
    this._timerList.push({ thisObj, func });
  }

  public update(): void {
    const now = Date.now();
    const elapsed = now - this._lastLoop;
    for (const item of this._timerList) {
      if (item) {
        item.func.call(item.thisObj, elapsed);
      }
    }
    this._lastLoop = now;
  }
}
