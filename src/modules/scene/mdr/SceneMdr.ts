import { SceneMap } from "./SceneMap";
import { CompMgr } from "@base/comps/CompMgr";
import { ScenePlayerVO } from "@base/entity/SceneEntityVO";
import { Action, SceneEntityType } from "@base/entity/EntityConst";
import { ScenePlayer } from "@base/entity/SceneEntity";
import { BaseEvent } from "@base/BaseConst";
import { emitter } from "@base/MessageMgr";
import { AvatarComp } from "@base/comps/AvatarComp";
import { GEvent } from "@base/core/GEvent";
import { CompType } from "@base/comps/CompsConst";
import Sprite = Laya.Sprite;

/**
 * 场景
 * @date 2024/6/16
 */
export class SceneMdr extends Laya.Scene {
  private _map: SceneMap;
  private _entitySprite: Sprite;
  private _singleMap: Sprite;
  private _player: ScenePlayer;

  constructor() {
    super();
  }

  onEnable() {
    super.onEnable();
    emitter.on(BaseEvent.ADD_TO_SCENE, this.onAddEntity, this);
    emitter.on(BaseEvent.REMOVE_FROM_SCENE, this.onDelEntity, this);
  }

  private createEntitySprite(): Sprite {
    const sprite = new Sprite();
    sprite.width = Laya.stage.width;
    sprite.height = Laya.stage.height;
    sprite.name = "_entitySprite";
    sprite.mouseEnabled = false;
    sprite.mouseThrough = true;
    return sprite;
  }

  open(closeOther?: boolean, param?: any) {
    super.open(closeOther, param);

    this._singleMap = new Sprite();
    this.addChild(this._singleMap);
    this._singleMap.loadImage("map/single_map/s320_s.jpg");

    // this._map = new SceneMap();
    // this._map.init(1001);
    // this.addChild(this._map);

    if (!this._entitySprite) {
      this._entitySprite = this.createEntitySprite();
      this.addChild(this._entitySprite);
    }

    const playerVo: ScenePlayerVO = {
      entityId: 1001,
      name: "zpj",
      hp: 10000,
      maxHp: 10000,
      power: 999999,
      type: SceneEntityType.PLAYER,
      vip: 0,
      point: { x: 0, y: 568 },
      action: Action.STAND,
    };
    this._player = new ScenePlayer();
    this._player.init(playerVo);

    // todo
    Laya.timer.loop(10 * 1000, this, this.updatePlayerVo);

    // todo
    CompMgr.start();
  }

  private onAddEntity(e: GEvent<AvatarComp>): void {
    const avatar = e.data;
    if (avatar) {
      this._entitySprite.addChild(avatar.display);
    }
  }

  private onDelEntity(e: GEvent<AvatarComp>): void {
    const avatar = e.data;
    if (avatar.display) {
      avatar.display.removeSelf();
    }
  }

  private updatePlayerVo(): void {
    if (this._player) {
      const ary: Action[] = [
        Action.MOVE,
        Action.STAND,
        Action.ATTACK,
        Action.ATTACKED,
        Action.DIE,
      ];
      const action = ary[Math.floor(Math.random() * ary.length)];
      this._player.vo.action = action || Action.STAND;
      const comp = this._player.getComp(CompType.AVATAR) as AvatarComp;
      console.log(`11111 `, comp);
    }
  }
}
