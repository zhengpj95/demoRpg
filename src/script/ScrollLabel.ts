/**
 * 文本滚动
 * PS: 文本需限制长度
 * 1. 代码设置text生效缓动
 * 2. 皮肤设置文本，且skinTween=true生效缓动，根据皮肤文本缓动
 * @date 2024/11/17
 */
import Script = Laya.Script;
import Label = Laya.Label;
import Rectangle = Laya.Rectangle;
import TimeLine = Laya.TimeLine;

export default class ScrollLabel extends Script {
  /** @prop {name:skinTween,tips:"根据皮肤文本开启缓动，默认true",type:Boolean,default="true"} */
  public skinTween = true;
  private _lab: Label;
  private _timeLine: TimeLine;

  public onAwake() {
    super.onAwake();
    const lab = (this._lab = <Label>this.owner);
    if (!this._lab) {
      return;
    }
    lab.getStyle();
    lab.scrollRect = new Rectangle(0, 0, lab.width, lab.height);
    const labDescriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(lab),
      "text",
    );
    const labSet = labDescriptor.set;
    const labGet = labDescriptor.get;
    Object.defineProperty(lab, "text", {
      enumerable: true,
      configurable: true,
      get: labGet,
      set: (val: string): void => {
        if (lab.text === val) return;
        lab.width = NaN;
        labSet.call(lab, val);
        this.setScroll(val);
      },
    });
  }

  public onDestroy() {
    super.onDestroy();
    this._lab.scrollRect.x = 0;
    if (this._timeLine) {
      this._timeLine.destroy();
    }
    this.skinTween = false;
  }

  public onUpdate() {
    super.onUpdate();
    if (this.skinTween) {
      this._lab.width = NaN;
      this.setScroll(this._lab.text);
    }
  }

  private setScroll(val: string): void {
    this.skinTween = false;
    if (!this._timeLine) {
      this._timeLine = new TimeLine();
    }
    this._timeLine.reset();
    const dis = this._lab.width - this._lab.scrollRect.width;
    if (dis > 0) {
      const disTime = ((dis / 100) * 2000) >> 0;
      this._timeLine
        .to(this._lab.scrollRect, { x: dis }, disTime, undefined, 1000)
        .to(this._lab.scrollRect, { x: 0 }, 0, undefined, 1000)
        .play(0, true);
    } else {
      this._lab.width = this._lab.scrollRect.width;
    }
  }
}
