import Handler = Laya.Handler;
import Sprite = Laya.Sprite;
import Prefab = Laya.Prefab;
import SceneUtils = Laya.SceneUtils;

/**
 * @date 2024/4/17
 */
export class PrefabUtils {
  public static _urlHandler: { [url: string]: Handler } = {};
  public static _uiJson: { [url: string]: any } = {};

  private static replaceUrl(url: string): string {
    if (!url) return url;
    url.replace(/\.(scene|prefab|json)/, ".json");
  }

  // 加载
  public static load(url: string, handler: Handler): void {
    url = this.replaceUrl(url);
    this._urlHandler[url] = handler;
    Laya.loader.load(url, Handler.create(this, this.onLoaded, [url]));
  }

  private static onLoaded(url: string, data: any): void {
    this._uiJson[url] = data;
    const handler = this._urlHandler[url];
    if (handler) {
      handler.runWith(data);
    }
  }

  // 创建
  public static create<T extends Sprite | undefined>(url: string): T {
    url = this.replaceUrl(url);
    const json = this._uiJson[url];
    if (!json) {
      console.error(
        `PrefabUtils.create error，数据不存在，请加载再创建。${url}`,
      );
      return undefined;
    }
    const prefab = Laya.Pool.getItemByClass("prefab", Prefab);
    prefab.json = json;
    return prefab.create();
  }

  // 加载并创建对应的预制体组件
  public static loadAndCreate(url: string, handler: Handler): void {
    url = this.replaceUrl(url);
    this._urlHandler[url] = handler;
    Laya.loader.load(url, Handler.create(this, this.onLoadedAndCreate, [url]));
  }

  private static onLoadedAndCreate(url: string, data: any): void {
    this._uiJson[url] = data;
    const handler = this._urlHandler[url];
    if (handler) {
      const comp = SceneUtils.createComp(data);
      handler.runWith(comp);
    }
  }
}
