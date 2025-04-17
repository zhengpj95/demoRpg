import GameConfig from "./GameConfig";
import App from "./App";
import { ModuleType } from "@def/ModuleConst";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import "@base/FixLaya"; // 引入兼容一些laya内容
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { initConfig } from "@base/cfg/GameCfg";
import { loopTween } from "@base/tween/TweenManager";
import { SceneViewType } from "@def/scene";
import { UpdateMgr } from "@base/UpdateMgr";
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

    // 游戏切到后台（例如切换到其他标签页、锁屏等）
    Laya.stage.on(Laya.Event.BLUR, this, () => {
      // console.log("Laya.stage 触发 BLUR 游戏失去焦点");
      // 你可以在这里暂停游戏、暂停音乐等
    });

    // 游戏回到前台
    Laya.stage.on(Laya.Event.FOCUS, this, () => {
      // console.log("Laya.stage 触发 FOCUS 游戏获得焦点");
      // 你可以在这里恢复游戏、恢复音乐等
    });

    Laya.stage.on(Laya.Event.VISIBILITY_CHANGE, this, () => {
      if (!Laya.stage.isVisibility) {
        // console.log("页面不可见，切到后台或且切页签");
        // 执行暂停逻辑
      } else {
        // console.log("页面重新可见");
        // 执行恢复逻辑
      }
    });

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
      module: ModuleType.SCENE,
      view: SceneViewType.SCENE,
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
let _lastLoop = 0;

const enum UpdateFrame {
  FAST = 16,
  SLOW = 33,
  SLEEP = 1000,
}

function _loop(): boolean {
  const now = Date.now();
  const elapsed = now - _lastLoop;
  if (elapsed < UpdateFrame.SLOW) {
    return false;
  }
  _lastLoop = now;
  try {
    if (_rawLoop) {
      _rawLoop.call(Laya.stage);
    }
  } catch (e) {
    console.log(e);
  }
  loopTween();
  UpdateMgr.ins().update();
  return true;
}

// 在切后台或页签时，requestAnimationFrame执行频率会降低到1fps或更低，甚至完全暂停。所以这里特殊处理下
setInterval(_bgLoop, 1);

function _bgLoop(): void {
  const now = Date.now();
  const elapsed = now - _lastLoop;
  if (elapsed < UpdateFrame.SLOW * 1.5) {
    return;
  }
  _loop();
}

function initLoop(): void {
  stage = <any>Laya.stage;
  _rawLoop = stage._loop;
  stage._loop = _loop;
}

//激活启动类
new Main();
