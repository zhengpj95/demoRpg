import { IPoolObject } from "@base/BaseConst";
import { SceneEntity } from "@base/entity/SceneEntity";
import Label = Laya.Label;
import Sprite = Laya.Sprite;

/**
 * @author zpj
 * @date 2025/4/14
 */
export class HeadUI extends Sprite implements IPoolObject {
  private _entity: SceneEntity;
  private _lab: Label;

  public get entity(): SceneEntity {
    return this._entity;
  }

  public set entity(value: SceneEntity) {
    this._entity = value;
    if (value && value.vo.name) {
      this.createName();
      this._lab.text = value.vo.name;
    }
  }

  public onAlloc(): void {
    this.onRelease();
    this.width = 120;
    this.height = 22;

    // const img = new Image("comp/img_blank.png");
    // img.width = this.width;
    // img.height = this.height;
    // this.addChild(img);

    this.createName();
  }

  public onRelease(): void {
    if (this._lab) {
      this._lab.text = "";
    }
    this._entity = <any>undefined;
  }

  private createName(): void {
    if (!this._lab) {
      this._lab = new Label();
      this._lab.fontSize = 22;
      this._lab.color = "#ffffff";
      this._lab.align = "center";
      this._lab.centerX = 0;
      this.addChild(this._lab);
    }
  }
}
