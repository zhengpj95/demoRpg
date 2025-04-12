import { IPoolObject } from "@base/BaseConst";
import { IFrameData, ITextureAtlas } from "@base/movieclip/MovieClipConst";
import { CallBack } from "@base/CallBack";
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import Texture = Laya.Texture;

/**
 * 整合序列帧相关的png纹理集图片和atlas配置文件
 * @date 2024/7/1
 */
export class MergedBitmap implements IPoolObject {
  private _url: string;
  private _atlas: ITextureAtlas;
  private _frames: IFrameData[];
  private _callback: CallBack<[MergedBitmap]>;
  private _texture: Texture;
  private _textureList: Texture[];

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
    console.log(`11111 png: `, data, data instanceof Texture);
    this.onLoadComplete();
  }

  private onLoadJson(data: ITextureAtlas): void {
    this._atlas = data;
    this._frames = data.frames;
    console.log(`11111 json: `, data);
  }

  private onLoadComplete(): void {
    if (this._callback && this.isLoadComplete) {
      this._callback.exec(this);
    }
  }

  private isLoadComplete(): boolean {
    return !!this._frames && !!this._atlas;
  }

  public getTextureList(): Texture[] {
    if (!this.isLoadComplete()) return [];
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
    this._url = "";
    this._atlas = <any>undefined;
    this._frames = [];
    this._callback = <any>undefined;
    this._texture = <any>undefined;
    this._textureList = [];
  }
}
