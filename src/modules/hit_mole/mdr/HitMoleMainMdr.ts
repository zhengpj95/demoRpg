/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { GEvent } from "@base/core/GEvent";
import Box = Laya.Box;
import Image = Laya.Image;
import Tween = Laya.Tween;
import Handler = Laya.Handler;
import Point = Laya.Point;

type BoxHole = Box & {
  imgBg: Image;
  imgAnimal: Image;
};

export class HitMoleMainMdr extends ui.modules.hit_mole.HitMoleMainUI {
  private _boxList: BoxHole[] = [];
  private _preIdx = -1;
  private _animalTweenTime = 300;
  private _score = 0;
  private _timeSec = 90;
  private _setTimeMap = {};

  onEnable() {
    super.onEnable();
    this._animalTweenTime = 300;
    this.boxOver.visible = false;

    for (let i = 1; i <= 9; i++) {
      const box = <BoxHole>this.getChildByName("boxHole" + i);
      this._boxList.push(box);
    }

    this._boxList.forEach((item) => this.initHole(item));

    this.timerLoop(1200, this, this.startTick);
    this.timerLoop(1000, this, this.updateTime);
    this.updateTime();

    // Laya.stage.on(Event.CLICK, this, this.onClickStage);
    emitter.on(BaseEvent.STAGE_CLICK, this.onClickStage, this);
    this.boxHammer.visible = false;
  }

  private initHole(box: BoxHole): void {
    box.imgAnimal = <Image>box.getChildByName("imgAnimal");

    box.imgAnimal.skin = "";
    box.imgAnimal.y = 80;
    box.imgAnimal.tag = undefined;
    box.tag = 0;
  }

  private updateTime(): void {
    if (this._timeSec <= 30) {
      this._animalTweenTime = 150;
      if (!this._setTimeMap[3]) {
        this.timerLoop(700, this, this.startTick);
        this._setTimeMap[3] = 1;
      }
    } else if (this._timeSec <= 60) {
      this._animalTweenTime = 200;
      if (!this._setTimeMap[2]) {
        this.timerLoop(1000, this, this.startTick);
        this._setTimeMap[2] = 1;
      }
    }

    this._timeSec--;
    this.timeBar.value = Math.max(0, this._timeSec / 90);

    if (this._timeSec < 0) {
      this.timer.clearAll(this);
      this.showOverBox();
    }
  }

  private showOverBox(): void {
    this.boxOver.visible = true;
    this.labOverValue.text = this._score + "";
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
    const localPos = this.globalToLocal(point);
    this.boxHammer.x = localPos.x + this.boxHammer.width / 2;
    this.boxHammer.y = localPos.y + this.boxHammer.height / 2;
    this.boxHammer.rotation = 0;
    this.boxHammer.visible = true;
    const hit = this.checkHit(localPos);
    if (hit[0]) {
      // console.log(`11111 ${this._preIdx}, ${hit}`);
      const tag = hit[1];
      if (hit[2] === 1) {
        this.showTips(tag);
      }
    }
    Tween.to(
      this.boxHammer,
      { rotation: 45 },
      100,
      undefined,
      Handler.create(this, this.clickEnd),
    );
  }

  private clickEnd(): void {
    Tween.to(
      this.boxHammer,
      { rotation: 0 },
      100,
      undefined,
      Handler.create(this, () => {
        this.boxHammer.visible = false;
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
    this.boxTips.addChild(img);
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
    this.boxOver.visible = false;
    this._animalTweenTime = 300;
    this._score = 0;
    this._setTimeMap = {};
    this._preIdx = -1;
    this._timeSec = 90;
    this._boxList.forEach((item) => this.initHole(item));
    this.timerLoop(1200, this, this.startTick);
    this.timerLoop(1000, this, this.updateTime);
    this.updateTime();
  }
}
