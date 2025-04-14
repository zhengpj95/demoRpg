import { SceneMap } from "./SceneMap";
import { CompMgr } from "@base/comps/CompMgr";
import { SceneMonsterVo, ScenePlayerVO } from "@base/entity/SceneEntityVO";
import {
  Action,
  Direction,
  MonsterType,
  SceneEntityType,
} from "@base/entity/EntityConst";
import { ScenePlayer } from "@base/entity/ScenePlayer";
import { BaseEvent } from "@base/BaseConst";
import { emitter } from "@base/MessageMgr";
import { AvatarComp } from "@base/comps/AvatarComp";
import { GEvent } from "@base/core/GEvent";
import { SceneMonster } from "@base/entity/SceneMonster";
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

    // const img = new Image("modules/hit_mole/overBg.png");
    // img.x = img.y = 100;
    // img.anchorX = img.anchorY = 0.5;
    // img.height = img.width = 200;
    // // this.addChild(img);
    //
    // const box = new Box();
    // box.width = 200;
    // box.height = 200;
    // box.x = box.y = 100;
    // this.addChild(box);
    // const bmp = new RpgMovieClip();
    // bmp.setAction(Action.ATTACKED);
    // bmp.scale(-1, 1);
    // bmp.play("player/knight", -1, box);

    const playerVo: ScenePlayerVO = {
      entityId: 1001,
      name: "zpj",
      hp: 10000,
      maxHp: 10000,
      power: 999999,
      type: SceneEntityType.PLAYER,
      vip: 0,
      point: { x: 100, y: 100 },
      action: Action.ATTACK,
      avatarName: `player/rogue`,
      dir: Direction.Right,
    };
    this._player = new ScenePlayer();
    this._player.init(playerVo);

    const monsterVo: SceneMonsterVo = {
      entityId: 2001,
      name: "monster1",
      hp: 10000,
      maxHp: 10000,
      power: 999999,
      type: SceneEntityType.MONSTER,
      point: { x: 600, y: 100 },
      action: Action.Walk,
      avatarName: `player/knight`,
      monsterType: MonsterType.MONSTER,
      dir: Direction.Left,
    };
    const monster = new SceneMonster();
    monster.init(monsterVo);
    this._player.battle = monster;

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
}
