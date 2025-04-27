/**
 * 富文本处理
 * @date 2024/11/17
 */
import Script = Laya.Script;
import UIComponent = Laya.UIComponent;
import HTMLDivElement = Laya.HTMLDivElement;
import { BaseMediator, findMediator } from "@base/mvc/BaseMediator";

export default class HtmlLabel extends Script {
  /** @prop {name:defaultText,tips:"默认文本",type:String,default=""} */
  public defaultText: string = "";

  private _comp: UIComponent;
  private _mdr: BaseMediator | undefined;
  private _div: HTMLDivElement;

  public onAwake() {
    super.onAwake();
    this._comp = <UIComponent>this.owner;
    this._mdr = findMediator(this._comp);
    this._div = new HTMLDivElement();
    this._div.style.color = "#ffffff";
    this._div.style.fontSize = 22;
    this._comp.addChild(this._div);
    this._div.innerHTML = this.defaultText;
  }

  public onEnable() {
    super.onEnable();
  }

  public onDestroy() {
    super.onDestroy();
  }
}
