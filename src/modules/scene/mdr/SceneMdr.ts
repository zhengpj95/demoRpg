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
import { CompType } from "@base/comps/CompsConst";
import { SceneEvent } from "@def/scene";
import { TimerMgr } from "@base/TimerMgr";
import { DebugMgr } from "@base/DebugMgr";
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
  private _entityList: SceneEntity[] = [];

  constructor() {
    super();
    DebugMgr.ins().debug("SceneMdr", this);
  }

  public onEnable(): void {
    super.onEnable();
    emitter.on(SceneEvent.ADD_TO_SCENE, this.onAddEntity, this);
    emitter.on(SceneEvent.REMOVE_FROM_SCENE, this.onDelEntity, this);
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

  public open(closeOther?: boolean, param?: any): void {
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
      avatarName: `player/knight`,
      dir: Direction.RIGHT,
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
      point: { x: 550, y: 100 },
      action: Action.WALK,
      avatarName: `player/rogue`,
      monsterType: MonsterType.MONSTER,
      dir: Direction.LEFT,
    };
    const monster = new SceneMonster();
    monster.init(monsterVo);
    monster.addPath({ x: 150, y: 100 });
    this._player.battle = monster;
    TimerMgr.ins().addTimer(this, this.update);
  }

  private onAddEntity(e: GEvent<SceneEntity>): void {
    const entity = e.data;
    if (!entity) return;
    const avatar = entity.getComp(CompType.AVATAR);
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
    const avatar = entity.getComp(CompType.AVATAR);
    if (avatar && avatar.display) {
      avatar.display.removeSelf();
    }
    if (idx > -1) {
      this._entityList.splice(idx, 1);
    }
  }

  public update(elapsed: number): void {
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
