import { BaseComponent } from "./BaseComponent";
import { ComponentType } from "./ComponentConst";
import { emitter } from "@base/MessageMgr";
import { Action, Direction } from "@base/entity/EntityConst";
import { RpgMovieClip } from "@base/movieclip/RpgMovieClip";
import { CallBack } from "@base/CallBack";
import { HeadUI } from "@base/entity/HeadUI";
import PoolMgr from "@base/core/PoolMgr";
import { SceneEvent } from "@def/scene";
import { HeadHp } from "@base/entity/HeadHp";
import Sprite = Laya.Sprite;

function getDirectionScale(dir: number): { x: number; y: number } {
  if (dir === Direction.LEFT) {
    return { x: -1, y: 1 };
  }
  return { x: 1, y: 1 };
}

/**
 * 场景模型
 */
export class AvatarComponent extends BaseComponent {
  private _display: Sprite;
  private _curAction: Action;
  private _isLoadAtlas = false;
  private _rpg: RpgMovieClip;
  private _headUI: HeadUI;
  private _headHp: HeadHp;

  public get display(): Sprite {
    return this._display;
  }

  public set display(value: Laya.Sprite) {
    this._display = value;
  }

  constructor() {
    super();
    this.type = ComponentType.AVATAR;
  }

  public start(): void {
    super.start();
    if (!this.display) {
      this.display = new Sprite();
      this.display.name = "avatarComp";
      const point = this.entity.vo.point;
      this.display.x = point ? point.x : 0;
      this.display.y = point ? point.y : 0;
    }
    if (!this._rpg) {
      this._rpg = new RpgMovieClip();
      this._rpg.play(
        this.entity.vo.avatarName,
        -1,
        this.display,
        CallBack.alloc(this, this.onLoadRpg),
        CallBack.alloc(this, this.playEnd),
      );
    }
    const scale = getDirectionScale(this.entity.vo.dir);
    this._rpg.scale(scale.x, scale.y);

    if (!this._headUI) {
      this._headUI = PoolMgr.alloc(HeadUI);
      this._headUI.entity = this.entity;
      this.display.addChild(this._headUI);
      this._headUI.y = -50;
      this._headUI.x = -(this._headUI.width / 2) + -scale.x * 20;
    }
    if (!this._headHp) {
      this._headHp = PoolMgr.alloc(HeadHp);
      this._headHp.setHp(this.entity.vo.hp, this.entity.vo.maxHp);
      this._headHp.y = -70;
      this._headHp.x = -(this._headHp.width / 2) + -scale.x * 20;
      this.display.addChild(this._headHp);
    }

    emitter.emit(SceneEvent.ADD_TO_SCENE, this.entity);
  }

  public stop(): void {
    super.stop();
    this._isLoadAtlas = false;
    emitter.emit(SceneEvent.REMOVE_FROM_SCENE, this.entity);
    if (this._headUI) {
      PoolMgr.release(this._headUI);
      this._headUI = <any>undefined;
    }
    if (this._headHp) {
      PoolMgr.release(this._headHp);
      this._headHp = <any>undefined;
    }
  }

  private onLoadRpg(): void {
    this._isLoadAtlas = true;

    // const img = new Laya.Image("comp/img_blank.png");
    // img.width = 128;
    // img.height = 128;
    // this._rpg.addChild(img);
  }

  private playEnd(): void {
    if (this.entity) {
      this.entity.isDone = true;
    }
  }

  public tick(delta: number): void {
    const vo = this.entity.vo;
    const point = this.entity.vo.point;
    if (this.display.x !== point.x) {
      this.display.x = point.x || 0;
    }
    if (this.display.y !== point.y) {
      this.display.y = point.y || 0;
    }
    if (vo.action && vo.action !== this._curAction) {
      this._curAction = vo.action;
      this._rpg.setAction(vo.action);
      this._rpg.setCnt(vo.action === Action.DEATH ? 1 : -1);
    }

    if (vo.action === Action.DEATH) {
      return;
    }
    if (vo.hp <= 0) {
      vo.hp = 0;
      vo.action = Action.DEATH;
      console.log(`AvatarComp: ${vo.name} is death!`);
    }
    this._headHp.setHp(vo.hp, vo.maxHp);
  }
}
