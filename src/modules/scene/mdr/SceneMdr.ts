import { SceneMap } from "./SceneMap";
import { SceneMonsterVo, ScenePlayerVO } from "@base/entity/SceneEntityVO";
import {
  Action,
  Direction,
  MonsterType,
  SceneEntityType,
} from "@base/entity/EntityConst";
import { ScenePlayer } from "@base/entity/ScenePlayer";
import { emitter } from "@base/MessageMgr";
import { GEvent } from "@base/core/GEvent";
import { SceneMonster } from "@base/entity/SceneMonster";
import { SceneEntity } from "@base/entity/SceneEntity";
import { ComponentType } from "@base/component/ComponentConst";
import { SceneEvent } from "@def/scene";
import { UpdateMgr } from "@base/UpdateMgr";
import { DebugMgr } from "@base/DebugMgr";
import PoolMgr from "@base/core/PoolMgr";
import { LayerIndex } from "@base/LayerMgr";
import { BaseMediator } from "@base/mvc/BaseMediator";
import Sprite = Laya.Sprite;
import Handler = Laya.Handler;

function createMonster(): SceneMonsterVo {
  return {
    entityId: 2001,
    name: "monster" + ((Math.random() * 10) >> 0),
    hp: 10000,
    maxHp: 10000,
    power: 999999,
    type: SceneEntityType.MONSTER,
    point: { x: 550, y: 100 },
    action: Action.WALK,
    avatarName: `player/rogue`,
    monsterType: MonsterType.MONSTER,
    dir: Direction.LEFT,
  };
}

/**
 * 场景
 * @date 2024/6/16
 */
export class SceneMdr extends BaseMediator {
  private _map: SceneMap;
  private _entitySprite: Sprite;
  private _singleMap: Sprite;
  private _player: ScenePlayer;
  private _entityList: SceneEntity[] = [];

  constructor() {
    super("", LayerIndex.MAP);
    DebugMgr.ins().debug("SceneMdr", this);
  }

  protected addEvents(): void {
    emitter.on(SceneEvent.ADD_TO_SCENE, this.onAddEntity, this);
    emitter.on(SceneEvent.REMOVE_FROM_SCENE, this.onDelEntity, this);
  }

  protected initUI(): void {
    //
  }

  protected initView(handler: Laya.Handler): void {
    const sprite = new Sprite();
    sprite.size(Laya.stage.width, Laya.stage.height);
    handler.runWith(sprite);
  }

  protected onClose(): void {
    //
  }

  protected removeEvents(): void {
    emitter.off(SceneEvent.ADD_TO_SCENE, this.onAddEntity, this);
    emitter.off(SceneEvent.REMOVE_FROM_SCENE, this.onDelEntity, this);
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

  public onOpen(): void {
    this._singleMap = new Sprite();
    this.ui.addChild(this._singleMap);
    this._singleMap.loadImage(
      "map/single_map/s320_s.jpg",
      Handler.create(this, () => {
        const offsetX = (this._singleMap.width - Laya.stage.width) / 2;
        const offsetY = (this._singleMap.height - Laya.stage.height) / 2;
        this._singleMap.pos(-offsetX, -offsetY);
      }),
    );

    // this._map = new SceneMap();
    // this._map.init(1001);
    // this.addChild(this._map);

    if (!this._entitySprite) {
      this._entitySprite = this.createEntitySprite();
      this.ui.addChild(this._entitySprite);
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
      name: "无尽猪猪",
      hp: 10000,
      maxHp: 10000,
      power: 999999,
      type: SceneEntityType.PLAYER,
      vip: 0,
      point: { x: 100, y: 100 },
      action: Action.IDLE,
      avatarName: `player/knight`,
      dir: Direction.RIGHT,
    };
    this._player = new ScenePlayer();
    this._player.init(playerVo);

    const monsterVo: SceneMonsterVo = createMonster();
    const monster = new SceneMonster();
    monster.init(monsterVo);
    monster.addPath({ x: 150, y: 100 });
    this._player.battle = monster;
    UpdateMgr.ins().addTimer(this, this.update);
  }

  private onAddEntity(e: GEvent<SceneEntity>): void {
    const entity = e.data;
    if (!entity) return;
    const avatar = entity.getComponent(ComponentType.AVATAR);
    if (avatar) {
      this._entitySprite.addChild(avatar.display);
    }
    if (this._entityList.indexOf(entity) < 0) {
      this._entityList.push(entity);
    }
  }

  private onDelEntity(e: GEvent<SceneEntity>): void {
    const entity = e.data;
    if (!entity) return;
    const idx = this._entityList.indexOf(entity);
    const avatar = entity.getComponent(ComponentType.AVATAR);
    if (avatar && avatar.display) {
      avatar.display.removeSelf();
    }
    if (idx > -1) {
      this._entityList.splice(idx, 1);
    }
  }

  private createMonster(): void {
    if (this._entityList.length > 1) return;
    const monsterVo = createMonster();
    const monster = PoolMgr.alloc(SceneMonster);
    monster.init(monsterVo);
    monster.addPath({ x: 150, y: 100 });
    this._player.battle = monster;
  }

  public update(elapsed: number): void {
    this.createMonster();

    const delTmp: SceneEntity[] = [];
    const list = this._entityList;
    for (const entity of list) {
      if (entity) {
        if (entity.isDone) {
          delTmp.push(entity);
        } else {
          entity.update(elapsed);
        }
      }
    }
    if (delTmp.length) {
      for (const item of delTmp) {
        item.destroy();
        const idx = this._entityList.indexOf(item);
        if (idx > -1) this._entityList.splice(idx, 1);
      }
      delTmp.length = 0;
    }
  }
}
