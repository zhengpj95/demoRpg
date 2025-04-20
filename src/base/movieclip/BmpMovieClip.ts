import { IPoolObject } from "@base/BaseConst";
import { MergedBitmap } from "@base/movieclip/MergedBitmap";
import { CallBack } from "@base/CallBack";
import { BitmapBase } from "@base/core/BitmapBase";
import PoolMgr from "@base/core/PoolMgr";
import Sprite = Laya.Sprite;

const INIT_FPS = 16;

/**
 * 序列帧
 * @date 2024/7/1
 */
export class BmpMovieClip extends BitmapBase implements IPoolObject {
  private _mergedBitmap: MergedBitmap;
  private _callBack: CallBack | undefined;
  private _total: number = 0;
  private _current: number = 0;
  private _playCnt: number = 1;
  private _interval: number = 1000 / INIT_FPS;
  private _remove = false;
  private _removeParent = false;
  private _container?: Sprite;

  public center = true;

  public play(
    url: string,
    cnt: number = 1,
    container?: Sprite,
    callBack?: CallBack,
    remove?: boolean,
    removeParent?: boolean,
  ): void {
    this._playCnt = cnt;
    this._container = container;
    this._callBack = callBack;
    this._remove = remove;
    this._removeParent = removeParent;
    MergedBitmap.onLoad(url, CallBack.alloc(this, this.onLoadedMergedBitmap));
  }

  private onLoadedMergedBitmap(bitmap: MergedBitmap): void {
    if (!bitmap) {
      throw new Error(`BmpMovieClip load alta fail`);
    }
    this._mergedBitmap = bitmap;
    this._total = bitmap.getTextureList().length;
    this._current = 0;
    if (!this._container.contains(this)) {
      this._container.addChild(this);
    }
    Laya.timer.loop(this._interval, this, this.onUpdate);
  }

  private onUpdate(): void {
    this._current++;
    if (this._current <= this._total) {
      this.source = this._mergedBitmap.getTextureList()[this._current - 1];
      return;
    }
    if (this._playCnt < 0) {
      // 循环
      this._current = 0;
      this.source = this._mergedBitmap.getTextureList()[this._current];
      return;
    }
    this._playCnt--;
    if (this._playCnt) {
      this._current = 0;
      this.source = this._mergedBitmap.getTextureList()[this._current];
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
    if (this._removeParent && this._container) {
      this._container.removeSelf();
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
  }
}
