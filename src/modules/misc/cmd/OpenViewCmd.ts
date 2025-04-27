import { BaseCommand } from "@base/mvc/BaseCommand";
import { IOpenCloseData } from "@def/misc";
import { facade } from "@base/mvc/Facade";
import { LayerIndex, LayerMgr } from "@base/LayerMgr";
import { GEvent } from "@base/core/GEvent";
import { DebugMgr } from "@base/DebugMgr";
import { ModuleType } from "@def/ModuleConst";
import { BaseMediator } from "@base/mvc/BaseMediator";
import Handler = Laya.Handler;
import ClassUtils = Laya.ClassUtils;
import View = Laya.View;
import Scene = Laya.Scene;
import SceneUtils = Laya.SceneUtils;

/**创建mdr唯一标识*/
export function createMdrKey(data: IOpenCloseData): string {
  return `mv_${data.module}_${data.view}`;
}

/**
 * @date 2024/4/17
 */
export class OpenViewCmd extends BaseCommand {
  exec(e: GEvent<IOpenCloseData>): void {
    const data = e.data;
    const module = facade.retModule(data.module);
    if (!module) {
      console.error(`App.showView error, module:${data.module}`);
      return;
    }
    const mdrCls = module.retMdr(data.view);
    if (!mdrCls) {
      console.error(
        `App.showView error, module:${data.module}, viewType:${data.view}`,
      );
      return;
    }
    const layerIdx = module.retMdrIdx(data.view);
    const layer = LayerMgr.ins().getLayer(layerIdx);
    const mdrKey = createMdrKey(data);
    layer.doAddMdr(mdrCls, mdrKey);
    console.log(`OpenViewCmd 打开界面 m:${data.module},v:${data.view}`);
  }
}

// 通过皮肤资源加载的方式处理
export function showView(path: string): void {
  const url = path.indexOf(".") > -1 ? path : path + ".scene";
  const view = Laya.loader.getRes(url);
  if (view) {
    onLoaded(url, view);
  } else {
    Laya.loader.load(url, Handler.create(null, onLoaded, [url], true));
  }
}

// todo 如果没有runtime的情况下，需要兼容通过url找到对应的mdr，执行运行mdr。通过 ClassUtils 注册和获取即可
function onLoaded(url: string, obj: any): void {
  console.log(`11111 ${url} `, obj);
  const runtime = obj.props.runtime ? obj.props.runtime : obj.type;
  const clas = ClassUtils.getClass(runtime);
  const layer = LayerMgr.ins().getLayer(LayerIndex.WIN); //test
  let scene: Scene | View | undefined;
  if (obj.props.renderType === "instance") {
    scene = clas.instance || (clas.instance = new clas());
  } else {
    scene = new clas();
  }

  if (scene && scene instanceof Scene && obj.props.runtime) {
    // 配置了runtime的方式
    layer.removeAll();
    layer.addChild(scene);
    scene.url = url;
    scene.onOpened(null);
  } else {
    SceneUtils.createComp(obj, scene);
    layer.removeAll();
    layer.addChild(scene);
    scene.url = url;
    scene.onOpened(null); // todo 对应的mdr的方法没有执行到。因为这里scene是Scene或View的实例，不是mdr的实例
  }
}

const mdrInsObj = {};

export function showView2(
  moduleName: ModuleType,
  viewType: number,
  args?: any,
): void {
  const module = facade.retModule(moduleName);
  if (!module) {
    console.error(`App.showView error, module:${moduleName}`);
    return;
  }
  const mdrCls = module.retMdr2(viewType);
  if (!mdrCls) {
    console.error(
      `App.showView error, module:${moduleName}, viewType:${viewType}`,
    );
    return;
  }
  const mdrIns = new mdrCls();
  mdrIns.setName(`${mdrCls.name} m:${moduleName},v:${viewType}`);
  mdrIns.open(args);
  mdrInsObj[`_${moduleName}_${viewType}_`] = mdrIns;
}

export function hideView2(moduleName: ModuleType, viewType: number): void {
  const mdrKey = `_${moduleName}_${viewType}_`;
  if (mdrInsObj[mdrKey]) {
    (mdrInsObj[mdrKey] as BaseMediator).close();
  }
}

DebugMgr.ins().debug("showView2", showView2);
DebugMgr.ins().debug("hideView2", hideView2);
