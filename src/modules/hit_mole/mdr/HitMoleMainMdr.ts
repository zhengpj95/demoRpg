/**
 * @date 2024/11/16
 */
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { GEvent } from "@base/core/GEvent";
import { BaseMediator } from "@base/mvc/BaseMediator";
import { LayerIndex } from "@base/LayerMgr";
import { ui } from "@ui/layaMaxUI";
import Box = Laya.Box;
import Image = Laya.Image;
import Tween = Laya.Tween;
import Handler = Laya.Handler;
import Point = Laya.Point;
import HitMoleMainUI = ui.modules.hit_mole.HitMoleMainUI;

type BoxHole = Box & {
  imgBg: Image;
  imgAnimal: Image;
};
const FUN_TIME = 90;

export class HitMoleMainMdr extends BaseMediator<HitMoleMainUI> {
  private _boxList: BoxHole[] = [];
  private _preIdx = -1;
  private _animalTweenTime = 300;
  private _score = 0;
  private _timeSec = FUN_TIME;
  private _setTimeMap = {};

  constructor() {
    super("modules/hit_mole/HitMoleMain.scene", LayerIndex.WIN);
  }

  protected addEvents(): void {}

  protected initUI(): void {}

  protected onClose(): void {}

  protected removeEvents(): void {}

  protected onOpen(): void {
    this._animalTweenTime = 300;
    this.ui.boxOver.visible = false;

    for (let i = 1; i <= 9; i++) {
      const box = <BoxHole>this.ui.getChildByName("boxHole" + i);
      this._boxList.push(box);
    }

    this._boxList.forEach((item) => this.initHole(item));

    this.ui.timerLoop(1200, this, this.startTick);
    this.ui.timerLoop(1000, this, this.updateTime);
    this.updateTime();

    emitter.on(BaseEvent.STAGE_CLICK, this.onClickStage, this);
    this.ui.boxHammer.visible = false;
  }

  private initHole(box: BoxHole): void {
    box.imgAnimal = <Image>box.getChildByName("imgAnimal");

    box.imgAnimal.skin = "";
    box.imgAnimal.y = 80;
    box.imgAnimal.tag = undefined;
    box.tag = 0;
  }

  private updateTime(): void {
    if (this._timeSec <= FUN_TIME / 3) {
      this._animalTweenTime = 150;
      if (!this._setTimeMap[3]) {
        this.ui.timerLoop(800, this, this.startTick);
        this._setTimeMap[3] = 1;
      }
    } else if (this._timeSec <= FUN_TIME / 2) {
      this._animalTweenTime = 200;
      if (!this._setTimeMap[2]) {
        this.ui.timerLoop(1000, this, this.startTick);
        this._setTimeMap[2] = 1;
      }
    }

    this._timeSec--;
    this.ui.timeBar.value = Math.max(0, this._timeSec / FUN_TIME);

    if (this._timeSec < 0) {
      this.ui.timer.clearAll(this);
      this.showOverBox();
    }
  }

  private showOverBox(): void {
    this.ui.boxOver.visible = true;
    this.ui.labOverValue.text = this._score + "";
  }

  private getRandomIdx(): number {
    if (this._preIdx < 0) {
      const idx = (Math.random() * this._boxList.length) >> 0;
      this._preIdx = idx;
      return idx;
    }
    const list: number[] = [];
    for (let i = 0; i < 9; i++) {
      if (i !== this._preIdx) {
        list.push(i);
      }
    }
    const newIdx = list[(Math.random() * list.length) >> 0];
    this._preIdx = newIdx;
    return newIdx;
  }

  private startTick(): void {
    const preIdx = this._preIdx;
    const preBox = this._boxList[preIdx];
    if (preBox) {
      this.removeTween(preBox);
    }
    const randomIdx = this.getRandomIdx();
    const curBox = this._boxList[randomIdx];
    this.tweenBox(curBox);
  }

  private tweenBox(box: BoxHole): void {
    if (!box) return;
    const random = (Math.random() * 2) >> 0;
    box.imgAnimal.skin = `modules/hit_mole/mouse_normal_${random + 1}.png`;
    box.imgAnimal.tag = random + 1;
    Tween.to(box.imgAnimal, { y: 0 }, this._animalTweenTime);
  }

  private removeTween(box: BoxHole): void {
    if (!box) return;
    Tween.to(
      box.imgAnimal,
      { y: 80 },
      this._animalTweenTime,
      undefined,
      Handler.create(this, () => {
        this.initHole(box);
      }),
    );
  }

  private onClickStage(e: GEvent<number[]>): void {
    if (this._timeSec <= 0) {
      return;
    }
    const pos = e.data;
    const point = new Point(pos[0], pos[1]);
    const localPos = this.ui.globalToLocal(point);
    this.ui.boxHammer.x = localPos.x + this.ui.boxHammer.width / 2;
    this.ui.boxHammer.y = localPos.y + this.ui.boxHammer.height / 2;
    this.ui.boxHammer.rotation = 0;
    this.ui.boxHammer.visible = true;
    const hit = this.checkHit(localPos);
    if (hit[0]) {
      // console.log(`11111 ${this._preIdx}, ${hit}`);
      const tag = hit[1];
      if (hit[2] === 1) {
        this.showTips(tag);
      }
    }
    Tween.to(
      this.ui.boxHammer,
      { rotation: 45 },
      100,
      undefined,
      Handler.create(this, this.clickEnd),
    );
  }

  private clickEnd(): void {
    Tween.to(
      this.ui.boxHammer,
      { rotation: 0 },
      100,
      undefined,
      Handler.create(this, () => {
        this.ui.boxHammer.visible = false;
      }),
    );
  }

  private checkHit(pos: Point): [boolean, number, number] {
    const curBox = this._boxList[this._preIdx];
    if (!curBox || curBox.imgAnimal.y > 30) {
      if (curBox) {
        curBox.tag = 0;
      }
      return [false, 0, 0];
    }
    const tag = curBox.imgAnimal.tag;
    const hit = curBox.hitTestPoint(pos.x, pos.y);
    if (!hit) {
      curBox.tag = 0;
    } else {
      curBox.tag = (curBox.tag || 0) + 1;
      curBox.imgAnimal.skin = `modules/hit_mole/mouse_hit_${tag}.png`;
    }
    return [hit, tag, curBox.tag];
  }

  private showTips(state: number): void {
    if (!state) return;
    const img = new Image();
    img.skin = `modules/hit_mole/score_${state}.png`;
    img.visible = true;
    img.centerX = 0;
    img.centerY = 0;
    this.ui.boxTips.addChild(img);
    Tween.to(
      img,
      { y: -200 },
      800,
      undefined,
      Handler.create(this, () => {
        img.removeSelf();
      }),
    );
    this.setScore(state === 2 ? 100 : -100);
  }

  private setScore(val: number): void {
    this._score += val || 0;
  }

  private btnRestartFunc(): void {
    this.ui.boxOver.visible = false;
    this._animalTweenTime = 300;
    this._score = 0;
    this._setTimeMap = {};
    this._preIdx = -1;
    this._boxList.forEach((item) => this.initHole(item));
    this.ui.timerOnce(500, this, this.restartFunc);
  }

  private restartFunc(): void {
    this._timeSec = FUN_TIME;
    this.ui.timerLoop(1200, this, this.startTick);
    this.ui.timerLoop(1000, this, this.updateTime);
    this.updateTime();
  }
}
