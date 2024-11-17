/**
 * 文本滚动
 * PS: 文本需限制长度
 * @date 2024/11/17
 */
import Script = Laya.Script;
import Text = Laya.Text;
import Label = Laya.Label;
import { findMediator } from "./ClickScale";

export default class ScrollLabel extends Script {
  private _comp: Label;
  private _mdr: Laya.Scene;
  private _text: Text;

  public onAwake() {
    super.onAwake();
    this._comp = <Label>this.owner;
    this._mdr = findMediator(this._comp);
    if (!this._mdr) {
      console.error(`ScrollLabel: 没有mdr`);
      return;
    }
    if (!this._comp.width) {
      console.error(`ScrollLabel: 没有限制Label的长度`);
      return;
    }
    this._text = this._comp.textField;
    this._text.overflow = "scroll";
    // Object.defineProperty(this._comp, "text", {
    //   configurable: true,
    //   enumerable: true,
    //   set: this.setTxt,
    // });
  }

  public onEnable() {
    super.onEnable();
  }

  private setTxt(v): void {
    console.log(11111, v);
  }

  public onDestroy() {
    super.onDestroy();
    this._comp = undefined;
    this._mdr = undefined;
    this._text = undefined;
  }

  private _pauseTime = 0; //在开始或终点，滚动暂停一下
  private _setMax = false;
  private _setZero = true;

  public onUpdate() {
    super.onUpdate();
    if (this._setZero && this._pauseTime < 50) {
      this._pauseTime++; // 起点暂停下
      return;
    }
    if (this._setMax && this._pauseTime < 100) {
      this._pauseTime++; // 终点暂停下
      return;
    }
    if (this._text.scrollX >= this._text.textWidth - this._comp.width) {
      if (this._pauseTime >= 100) {
        this._text.scrollX = 0;
        this._pauseTime = 0;
        this._setMax = false;
        this._setZero = true;
      } else {
        this._setMax = true;
        this._setZero = false;
      }
    } else {
      this._pauseTime = 0;
      this._setMax = false;
      this._setZero = false;
      this._text.scrollX += 1;
    }
  }
}
