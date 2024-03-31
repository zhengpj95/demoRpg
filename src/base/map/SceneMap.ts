import Sprite = Laya.Sprite;
import Image = Laya.Image;
import Handler = Laya.Handler;
import UIComponent = Laya.UIComponent;
import {IMapData, MapCellData} from "./MapConst";

export class SceneMap extends Sprite {
  private _miniImg: Image;
  private _sprite: Sprite;
  private _bmpMap: Record<string, MapBmp> = {};

  constructor() {
    super();

    this.setBg();
  }

  private setBg(): void {
    Laya.loader.load(`map/1001/info.json`, Handler.create(this, this.onLoad), null, Laya.Loader.JSON, 4);
  }

  private onLoad(mapData: IMapData): void {
    const img = new Image();
    img.skin = `map/1001/mini.jpg`;
    img.width = mapData["width"];
    img.height = mapData["height"];
    this.addChildAt(img, 0);

    this._sprite = new Sprite();
    this.addChildAt(this._sprite, 1);

    const rows = Math.ceil(mapData.height / mapData.sliceHeight);
    const cols = Math.ceil(mapData.width / mapData.sliceWidth);
    console.log(mapData, rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const bmp = new MapBmp();
        bmp.init(1001, i, j);
        this._sprite.addChild(bmp);
        this._bmpMap[bmp.name] = bmp;
      }
    }
  }
}

/**
 * 地图块
 */
class MapBmp extends UIComponent {
  private _bmp: Image;

  public init(mapId: number, row: number, col: number): void {
    const url = `map/${mapId}/${row}_${col}.jpg`;
    this.x = col * MapCellData.GameSliceWidth;
    this.y = row * MapCellData.GameSliceHeight;
    this.name = `${mapId}_${row}_${col}`;

    if (!this._bmp) {
      this._bmp = new Image();
      this.addChild(this._bmp);
    }

    this._bmp.skin = url;
  }
}