import { IPoolObject } from "@base/BaseConst";
import { IFrameData, ITextureAtlas } from "@base/movieclip/MovieClipConst";
import { CallBack } from "@base/CallBack";
import PoolMgr from "@base/core/PoolMgr";
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import Texture = Laya.Texture;

/**
 * 整合序列帧相关的png纹理集图片和json配置文件
 * @date 2024/7/1
 */
export class MergedBitmap implements IPoolObject {
  private _url: string;
  private _atlas: ITextureAtlas;
  private _frames: IFrameData[];
  private _callback: CallBack<[MergedBitmap]>;
  private _texture: Texture;
  private _textureList: Texture[];

  public get frames(): IFrameData[] | undefined {
    return this._frames;
  }

  public get texture(): Texture | undefined {
    return this._texture;
  }

  public get loadComplete(): boolean {
    return !!this.frames && !!this.texture;
  }

  public static onLoad(url: string, callback: CallBack<[MergedBitmap]>): void {
    const bitmap = PoolMgr.alloc(MergedBitmap);
    bitmap._url = url;
    bitmap._callback = callback;
    Laya.loader.load(
      [
        {
          url: url + ".png",
          type: Loader.IMAGE,
          priority: 1,
        },
        {
          url: url + ".json",
          type: Loader.JSON,
          priority: 1,
        },
      ],
      Handler.create(this, this.onLoadComplete, [bitmap]),
    );
  }

  private static onLoadComplete(bitmap: MergedBitmap): void {
    const texture = <Texture>Laya.loader.getRes(bitmap._url + ".png");
    const json = <ITextureAtlas>Laya.loader.getRes(bitmap._url + ".json");
    bitmap._texture = texture;
    bitmap._atlas = json;
    bitmap._frames = json.frames;
    if (bitmap._callback) {
      bitmap._callback.exec(bitmap);
    }
  }

  public onLoad(url: string, callback: CallBack<[MergedBitmap]>): void {
    this._url = url;
    this._callback = callback;
    Laya.loader.load(
      url + ".png",
      Handler.create(this, this.onLoadPng),
      undefined,
      Loader.IMAGE,
    );
    Laya.loader.load(
      url + ".json",
      Handler.create(this, this.onLoadJson),
      undefined,
      Loader.JSON,
    );
  }

  private onLoadPng(data: Texture): void {
    this._texture = data;
    this.onLoadComplete();
  }

  private onLoadJson(data: ITextureAtlas): void {
    this._atlas = data;
    this._frames = data ? data.frames : <any>undefined;
    this.onLoadComplete();
  }

  private onLoadComplete(): void {
    if (this._callback && this.loadComplete) {
      this._callback.exec(this);
    }
  }

  public getTextureList(): Texture[] {
    if (!this.loadComplete) return [];
    if (this._textureList) return this._textureList;

    this._textureList = [];
    for (const f of this._frames) {
      const txt = Texture.create(
        this._texture,
        f.frame.x,
        f.frame.y,
        f.frame.w,
        f.frame.h,
        f.spriteSourceSize.x,
        f.spriteSourceSize.y,
        f.sourceSize.w,
        f.sourceSize.h,
      );
      this._textureList.push(txt);
    }
    return this._textureList;
  }

  onAlloc(): void {
    this.onRelease();
  }

  onRelease(): void {
    this._url = <any>undefined;
    this._atlas = <any>undefined;
    this._frames = <any>undefined;
    if (this._callback) {
      this._callback.free();
    }
    this._callback = <any>undefined;
    this._texture = <any>undefined;
    this._textureList = <any>undefined;
  }
}
