import GameConfig from "./GameConfig";
import App from "./App";
import { ModuleType } from "@def/ModuleConst";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import "@base/FixLaya"; // 引入兼容一些laya内容
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { initConfig } from "@base/cfg/GameCfg";
import { HitMoleViewType } from "@def/hit_mole";
import { tweenMgr } from "@base/tween/TweenManager";
import Event = Laya.Event;

class Main {
  constructor() {
    //根据IDE设置初始化引擎
    if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    //兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString("debug") === "true")
      Laya.enableDebugPanel();
    if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
      Laya["PhysicsDebugDraw"].enable();
    if (GameConfig.stat) Laya.Stat.show();
    Laya.alertGlobalError(true);

    //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    Laya.ResourceVersion.enable(
      "version.json",
      Laya.Handler.create(this, this.onVersionLoaded),
      Laya.ResourceVersion.FILENAME_VERSION,
    );

    initLoop();
  }

  onVersionLoaded(): void {
    console.log(`version.json success`);
    initConfig();
    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable(
      "fileconfig.json",
      Laya.Handler.create(this, this.onConfigLoaded),
    );
  }

  onConfigLoaded(): void {
    console.log(`fileconfig.json success`);
    //加载IDE指定的场景
    // 这种方式加载scene的，如果不设置runtime，scene对应的代码文件不会执行到。
    // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);

    App.init();

    // 分离模式处理，把scene对应的代码文件加到舞台上即可，代码中自动绑定对应的scene了
    // const mdr = new HpSingle();
    // Laya.stage.addChild(mdr);

    emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
      module: ModuleType.HIT_MOLE,
      view: HitMoleViewType.START,
    });

    Laya.stage.on(Event.CLICK, this, this.onClick);
  }

  private onClick(e: Event) {
    emitter.emit(BaseEvent.STAGE_CLICK, [e.stageX, e.stageY]);
  }
}

let _rawLoop: () => boolean;
let stage: {
  _loop: () => boolean;
};

function _loop(): boolean {
  try {
    if (_rawLoop) {
      _rawLoop.call(Laya.stage);
    }
  } catch (e) {
    console.log(e);
  }
  tweenMgr.update();
  return true;
}

function initLoop(): void {
  stage = <any>Laya.stage;
  _rawLoop = stage._loop;
  stage._loop = _loop;
}

//激活启动类
new Main();
