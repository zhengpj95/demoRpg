import { BitmapBase } from "@base/core/BitmapBase";
import { IPoolObject } from "@base/BaseConst";
import { MergedBitmap } from "@base/movieclip/MergedBitmap";
import { CallBack } from "@base/CallBack";
import PoolMgr from "@base/core/PoolMgr";
import Sprite = Laya.Sprite;
import Texture = Laya.Texture;

const INIT_FPS = 10;

/**
 * RPG序列帧，会把rpg所有的动作都打包成一张图集
 * @date 2024/7/1
 */
export class RpgMovieClip extends BitmapBase implements IPoolObject {
  private _mergedBitmap: MergedBitmap;
  private _callBack: CallBack | undefined;
  private _total: number = 0;
  private _current: number = 0;
  private _playCnt: number = 1;
  private _interval: number = 1000 / INIT_FPS;
  private _remove = false;
  private _container: Sprite | undefined;

  private _textureMap: { [key: string]: Texture[] } = {};
  private _currentAction = ""; // 当前动作
  private _nextAction = ""; // 下一个动作

  public override center = true;

  public setAction(action: string): void {
    if (this._currentAction !== action) {
      this._nextAction = action;
    }
  }

  public play(
    url: string,
    cnt: number = 1,
    container?: Sprite,
    callBack?: CallBack,
    remove?: boolean,
  ): void {
    this._playCnt = cnt;
    this._callBack = callBack;
    this._remove = remove;
    this._container = container;
    MergedBitmap.onLoad(url, CallBack.alloc(this, this.onLoadedMergedBitmap));
  }

  private onLoadedMergedBitmap(bitmap: MergedBitmap): void {
    if (!bitmap || !bitmap.loadComplete) {
      throw new Error(`BmpMovieClip load alta fail`);
    }
    this._mergedBitmap = bitmap;
    const frames = bitmap.frames || [];
    const texture = bitmap.texture;
    for (const f of frames) {
      const name = f.filename.split("/")[0];
      if (!this._textureMap[name]) {
        this._textureMap[name] = [];
      }
      const txt = Texture.create(
        texture,
        f.frame.x,
        f.frame.y,
        f.frame.w,
        f.frame.h,
        f.spriteSourceSize.x,
        f.spriteSourceSize.y,
        f.sourceSize.w,
        f.sourceSize.h,
      );
      this._textureMap[name].push(txt);
    }
    if (!this._container.contains(this)) {
      this._container.addChild(this);
    }
    Laya.timer.loop(this._interval, this, this.onUpdate);
  }

  private getTextureList(action?: string): Texture[] {
    return this._textureMap[action || this._currentAction] || [];
  }

  private onUpdate(): void {
    if (this._currentAction !== this._nextAction) {
      this._total = this.getTextureList(this._nextAction).length;
      this._current = 0;
      this._currentAction = this._nextAction;
    }
    this._current++;
    if (this._current <= this._total) {
      this.source = this.getTextureList()[this._current - 1];
      return;
    }
    if (this._playCnt < 0) {
      // 循环
      this._current = 0;
      this.source = this.getTextureList()[this._current];
      return;
    }
    this._playCnt--;
    if (this._playCnt) {
      this._current = 0;
      this.source = this.getTextureList()[this._current];
    } else {
      Laya.timer.clearAll(this);
      this.playEnd();
    }
  }

  private playEnd(): void {
    if (this._callBack) {
      this._callBack.exec();
    }
    if (this._remove) {
      this.removeSelf();
    }
  }

  public onAlloc(): void {
    super.onAlloc();
    this.onRelease();
    this._interval = 1000 / INIT_FPS;
    this.center = true;
  }

  public onRelease(): void {
    super.onRelease();

    if (this._mergedBitmap) {
      PoolMgr.release(this._mergedBitmap);
    }
    this._mergedBitmap = <any>undefined;
    if (this._callBack) {
      this._callBack.free();
    }
    this._callBack = <any>undefined;

    this._total = 0;
    this._current = 0;
    this._playCnt = 0;
    this._remove = false;

    this._textureMap = {};
    this._currentAction = "";
    this._nextAction = "";
  }
}
