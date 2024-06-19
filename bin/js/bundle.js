(function () {
  'use strict';

  var Script = Laya.Script;
  var Handler = Laya.Handler;
  var Event = Laya.Event;
  var Tween = Laya.Tween;
  function findMediator(comp) {
      if (!comp) {
          return undefined;
      }
      if (comp instanceof Laya.Scene) {
          return comp;
      }
      let mdr;
      while (comp && !mdr) {
          comp = comp.parent;
          if (comp instanceof Laya.Scene) {
              mdr = comp;
          }
      }
      return mdr;
  }
  const DOWN_CLICK_SCALE = 1.1;
  const UP_CLICK_SCALE = 0.94;
  const CLICK_SCALE_TIME = 100;
  const ORI_PRO_KEY = ["left", "right", "top", "bottom", "centerX", "centerY"];
  class ClickScale extends Script {
      constructor() {
          super(...arguments);
          this.mdrCall = "";
          this.noScale = false;
          this.stopClickPropagation = false;
          this.clickInterval = false;
          this.originX = 0;
          this.originY = 0;
          this.originScaleX = 1;
          this.originScaleY = 1;
          this.downScaleX = 1;
          this.downScaleY = 1;
          this.upScaleX = 1;
          this.upScaleY = 1;
          this.prevClickTime = 0;
          this.isSetPos = false;
          this.isTweenUp = false;
      }
      onAwake() {
          this.comp = this.owner;
          this.mdr = findMediator(this.comp);
          this.originX = this.comp.x;
          this.originY = this.comp.y;
          this.originScaleX = this.comp.scaleX;
          this.originScaleY = this.comp.scaleY;
          this.downScaleX = this.comp.scaleX * DOWN_CLICK_SCALE;
          this.downScaleY = this.comp.scaleY * DOWN_CLICK_SCALE;
          this.upScaleX = this.comp.scaleX * UP_CLICK_SCALE;
          this.upScaleY = this.comp.scaleY * UP_CLICK_SCALE;
          if (!this._oriMap) {
              this._oriMap = {};
              for (const key of ORI_PRO_KEY) {
                  if (!isNaN(this.comp[key])) {
                      this._oriMap[key] = this.comp[key];
                  }
              }
          }
      }
      onEnable() {
          this.setAnchor();
          this.updateWidget(false);
          this.comp.on(Event.LOADED, this, this.setAnchor);
          this.comp.on(Event.CLICK, this, this.onClickComp);
          this.comp.on(Event.MOUSE_DOWN, this, this.onClickMouseDown);
          this.comp.on(Event.MOUSE_UP, this, this.onClickMouseUp);
          this.comp.on(Event.MOUSE_OUT, this, this.onClickMouseUp);
          if (this.mdr) {
              this.mdrCallback = Handler.create(this.mdr, this.mdr[this.mdrCall], undefined, false);
          }
      }
      onDestroy() {
          this.mdr = undefined;
          if (this.mdrCallback) {
              this.mdrCallback = undefined;
          }
      }
      setAnchor() {
          const comp = this.comp;
          if (comp.width === 0 ||
              comp.height === 0 ||
              this.isSetPos ||
              this.noScale) {
              return;
          }
          this.isSetPos = true;
          comp.anchorX = comp.anchorY = 0.5;
          comp.x = this.originX + comp.width * this.originScaleX * 0.5;
          comp.y = this.originY + comp.height * this.originScaleY * 0.5;
      }
      updateWidget(isAnim = false) {
          if (isAnim) {
              for (const key of ORI_PRO_KEY) {
                  this.comp[key] = NaN;
              }
          }
          else {
              for (const key in this._oriMap) {
                  this.comp[key] = this._oriMap[key];
              }
          }
      }
      onClickComp(e) {
          if (e && this.stopClickPropagation) {
              e.stopPropagation();
          }
          if (this.clickInterval) {
              if (Date.now() - this.prevClickTime < 220) {
                  return;
              }
              this.prevClickTime = Date.now();
          }
          if (this.mdrCallback) {
              this.mdrCallback.run();
          }
      }
      onClickMouseDown() {
          if (this.noScale) {
              return;
          }
          this.isTweenUp = false;
          Tween.clearAll(this.comp);
          Tween.to(this.comp, {
              scaleX: this.downScaleX,
              scaleY: this.downScaleY,
          }, CLICK_SCALE_TIME);
          this.updateWidget(true);
      }
      onClickMouseUp() {
          if (this.noScale ||
              this.isTweenUp ||
              (this.comp.scaleX === this.originScaleX &&
                  this.comp.scaleY === this.originScaleY)) {
              return;
          }
          this.isTweenUp = true;
          Tween.to(this.comp, {
              scaleX: this.upScaleX,
              scaleY: this.upScaleY,
          }, CLICK_SCALE_TIME, null, Handler.create(this, this.tweenOriginScale));
      }
      tweenOriginScale() {
          Tween.to(this.comp, {
              scaleX: this.originScaleX,
              scaleY: this.originScaleY,
          }, CLICK_SCALE_TIME, null, Handler.create(this, this.updateWidget, [false]));
      }
  }

  var View = Laya.View;
  var Scene = Laya.Scene;
  var REG = Laya.ClassUtils.regClass;
  var ui;
  (function (ui) {
      var modules;
      (function (modules) {
          var hp;
          (function (hp) {
              class HpSingleUI extends Scene {
                  constructor() { super(); }
                  createChildren() {
                      super.createChildren();
                      this.loadScene("modules/hp/HpSingle");
                  }
              }
              hp.HpSingleUI = HpSingleUI;
              REG("ui.modules.hp.HpSingleUI", HpSingleUI);
              class MainHpUI extends Scene {
                  constructor() { super(); }
                  createChildren() {
                      super.createChildren();
                      this.loadScene("modules/hp/MainHp");
                  }
              }
              hp.MainHpUI = MainHpUI;
              REG("ui.modules.hp.MainHpUI", MainHpUI);
          })(hp = modules.hp || (modules.hp = {}));
      })(modules = ui.modules || (ui.modules = {}));
  })(ui || (ui = {}));
  (function (ui) {
      var modules;
      (function (modules) {
          var login;
          (function (login) {
              class LoginUI extends Scene {
                  constructor() { super(); }
                  createChildren() {
                      super.createChildren();
                      this.loadScene("modules/login/Login");
                  }
              }
              login.LoginUI = LoginUI;
              REG("ui.modules.login.LoginUI", LoginUI);
          })(login = modules.login || (modules.login = {}));
      })(modules = ui.modules || (ui.modules = {}));
  })(ui || (ui = {}));
  (function (ui) {
      var modules;
      (function (modules) {
          var test;
          (function (test) {
              class TestPanelUI extends View {
                  constructor() { super(); }
                  createChildren() {
                      super.createChildren();
                      this.loadScene("modules/test/TestPanel");
                  }
              }
              test.TestPanelUI = TestPanelUI;
              REG("ui.modules.test.TestPanelUI", TestPanelUI);
              class TestPanelCloudUI extends Scene {
                  constructor() { super(); }
                  createChildren() {
                      super.createChildren();
                      this.loadScene("modules/test/TestPanelCloud");
                  }
              }
              test.TestPanelCloudUI = TestPanelCloudUI;
              REG("ui.modules.test.TestPanelCloudUI", TestPanelCloudUI);
              class TestSceneUI extends Scene {
                  constructor() { super(); }
                  createChildren() {
                      super.createChildren();
                      this.loadScene("modules/test/TestScene");
                  }
              }
              test.TestSceneUI = TestSceneUI;
              REG("ui.modules.test.TestSceneUI", TestSceneUI);
          })(test = modules.test || (modules.test = {}));
      })(modules = ui.modules || (ui.modules = {}));
  })(ui || (ui = {}));

  class GameControl extends Laya.Script {
      constructor() {
          super();
          this.createBoxInterval = 1000;
          this._time = 0;
          this._started = false;
      }
      onEnable() {
          this._time = Date.now();
          this._gameBox = this.owner.getChildByName("gameBox");
      }
      onUpdate() {
          const now = Date.now();
          if (now - this._time > this.createBoxInterval && this._started) {
              this._time = now;
              this.createBox();
          }
      }
      createBox() {
          const box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
          box.pos(Math.random() * (Laya.stage.width - 100), -100);
          this._gameBox.addChild(box);
      }
      onStageClick(e) {
          e.stopPropagation();
          const flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
          flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
          this._gameBox.addChild(flyer);
      }
      startGame() {
          if (!this._started) {
              this._started = true;
              this.enabled = true;
          }
      }
      stopGame() {
          this._started = false;
          this.enabled = false;
          this.createBoxInterval = 1000;
          this._gameBox.removeChildren();
      }
  }

  class GameUI extends ui.modules.test.TestSceneUI {
      constructor() {
          super();
          GameUI.instance = this;
          Laya.MouseManager.multiTouchEnabled = false;
      }
      onEnable() {
          this._control = this.getComponent(GameControl);
          this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
      }
      onTipClick(e) {
          this.tipLbll.visible = false;
          this._score = 0;
          this.scoreLbl.text = "";
          this._control.startGame();
      }
      addScore(value = 1) {
          this._score += value;
          this.scoreLbl.changeText("分数：" + this._score);
          if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
              this._control.createBoxInterval -= 20;
      }
      stopGame() {
          this.tipLbll.visible = true;
          this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
          this._control.stopGame();
      }
  }

  class Bullet extends Laya.Script {
      constructor() {
          super();
      }
      onEnable() {
          const rig = this.owner.getComponent(Laya.RigidBody);
          rig.setVelocity({ x: 0, y: -10 });
      }
      onTriggerEnter(other, self, contact) {
          this.owner.removeSelf();
      }
      onUpdate() {
          if (this.owner.y < -10) {
              this.owner.removeSelf();
          }
      }
      onDisable() {
          Laya.Pool.recover("bullet", this.owner);
      }
  }

  class DropBox extends Laya.Script {
      constructor() {
          super();
          this.level = 1;
      }
      onEnable() {
          this._rig = this.owner.getComponent(Laya.RigidBody);
          this.level = Math.round(Math.random() * 5) + 1;
          this._text = this.owner.getChildByName("levelTxt");
          this._text.text = this.level + "";
      }
      onUpdate() {
          this.owner.rotation++;
      }
      onTriggerEnter(other, self, contact) {
          const owner = this.owner;
          if (other.label === "buttle") {
              if (this.level > 1) {
                  this.level--;
                  this._text.changeText(this.level + "");
                  owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                  Laya.SoundManager.playSound("sound/hit.wav");
              }
              else {
                  if (owner.parent) {
                      const effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                      effect.pos(owner.x, owner.y);
                      owner.parent.addChild(effect);
                      effect.play(0, true);
                      owner.removeSelf();
                      Laya.SoundManager.playSound("sound/destroy.wav");
                  }
              }
              GameUI.instance.addScore(1);
          }
          else if (other.label === "ground") {
              owner.removeSelf();
              GameUI.instance.stopGame();
          }
      }
      createEffect() {
          const ani = new Laya.Animation();
          ani.loadAnimation("test/TestAni.ani");
          ani.on(Laya.Event.COMPLETE, null, recover);
          function recover() {
              ani.removeSelf();
              Laya.Pool.recover("effect", ani);
          }
          return ani;
      }
      onDisable() {
          Laya.Pool.recover("dropBox", this.owner);
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("script/ClickScale.ts", ClickScale);
          reg("script/GameUI.ts", GameUI);
          reg("script/GameControl.ts", GameControl);
          reg("script/Bullet.ts", Bullet);
          reg("script/DropBox.ts", DropBox);
      }
  }
  GameConfig.width = 640;
  GameConfig.height = 1136;
  GameConfig.scaleMode = "showall";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "middle";
  GameConfig.alignH = "center";
  GameConfig.startScene = "modules/login/Login.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class SingletonClass {
      static ins() {
          if (!this._instance) {
              this._instance = new this();
          }
          return this._instance;
      }
  }

  class DebugMgr extends SingletonClass {
      debug(name, cls) {
          if (name && cls) {
              window[name] = cls;
          }
      }
      debugProxy(proxy) {
          if (proxy.constructor.name) {
              window[proxy.constructor.name] = proxy;
          }
      }
  }

  class GameUtils {
      static getQualifiedClassName(value) {
          const type = typeof value;
          if (!value || (type !== "object" && !value.prototype)) {
              return type;
          }
          const prototype = value.prototype
              ? value.prototype
              : Object.getPrototypeOf(value);
          if (Object.prototype.hasOwnProperty.call(prototype, "__class__")) {
              return prototype["__class__"];
          }
          else if (type === "function" && value.name) {
              return value.name;
          }
          else if (prototype.constructor.name) {
              return prototype.constructor.name;
          }
          const constructorString = prototype.constructor.toString().trim();
          const index = constructorString.indexOf("(");
          let className = constructorString.substring(9, index);
          if (!className && type === "function") {
              className = "anonymous";
          }
          Object.defineProperty(prototype, "__class__", {
              value: className,
              enumerable: false,
              writable: true,
          });
          return className;
      }
  }

  class PoolMgr extends SingletonClass {
      static alloc(cls, ...args) {
          const className = GameUtils.getQualifiedClassName(cls);
          if (!this._poolMap[className]) {
              this._poolMap[className] = [];
          }
          const list = this._poolMap[className];
          if (list.length) {
              const vo = list.pop();
              if (vo["onAlloc"] && typeof vo["onAlloc"] == "function") {
                  vo["onAlloc"]();
              }
              return vo;
          }
          const clazz = new cls(...args);
          if (clazz["onAlloc"] && typeof clazz["onAlloc"] == "function") {
              clazz["onAlloc"]();
          }
          clazz.ObjectPoolKey = className;
          return clazz;
      }
      static release(obj) {
          if (!obj) {
              return false;
          }
          const refKey = obj.ObjectPoolKey;
          if (!refKey ||
              !this._poolMap[refKey] ||
              this._poolMap[refKey].indexOf(obj) > -1) {
              return false;
          }
          if (obj["onRelease"] && typeof obj["onRelease"] == "function") {
              obj["onRelease"]();
          }
          this._poolMap[refKey].push(obj);
          return true;
      }
      static clear() {
          this._poolMap = {};
      }
      static getContent() {
          return this._poolMap;
      }
      static setCount(count = 5) {
          for (const key in this._poolMap) {
              const list = this._poolMap[key];
              if (list.length > count) {
                  list.length = count;
              }
          }
      }
  }
  PoolMgr._poolMap = {};
  DebugMgr.ins().debug("PoolMgr", PoolMgr);

  class GEvent {
      get type() {
          return this._type;
      }
      set type(value) {
          this._type = value;
      }
      get data() {
          return this._data;
      }
      set data(value) {
          this._data = value;
      }
      static alloc(type, data) {
          const e = PoolMgr.alloc(GEvent);
          e.type = type;
          e.data = data;
          return e;
      }
      onAlloc() {
      }
      onRelease() {
          this.type = "";
          this.data = undefined;
      }
  }

  var Handler$1 = Laya.Handler;
  let emitter;
  function initEmitter() {
      emitter = MessageMgr.ins();
      DebugMgr.ins().debug("emitter", emitter);
  }
  class MessageMgr extends SingletonClass {
      constructor() {
          super(...arguments);
          this._messages = {};
      }
      createListener(caller, method, args) {
          return Handler$1.create(caller, method, args, false);
      }
      on(event, method, caller, args) {
          if (!this._messages[event]) {
              this._messages[event] = [];
          }
          const list = this._messages[event];
          for (const handler of list) {
              if (handler && handler.method === method && handler.caller === caller) {
                  return;
              }
          }
          this._messages[event].push(this.createListener(caller, method, args));
      }
      off(event, method, caller) {
          const list = this._messages[event];
          if (!list || !list.length) {
              return;
          }
          for (let i = 0; i < list.length; i++) {
              const item = list[i];
              if (item && item.method === method && item.caller === caller) {
                  list[i].recover();
                  list[i] = null;
                  break;
              }
          }
      }
      emit(event, args) {
          const list = this._messages[event];
          if (!list || !list.length) {
              return;
          }
          for (let i = 0; i < list.length; i++) {
              const handler = list[i];
              if (!handler) {
                  list.splice(i, 1);
                  i--;
                  continue;
              }
              const evt = GEvent.alloc(event, args);
              handler.runWith(evt);
              PoolMgr.release(evt);
              if (handler.once) {
                  list[i] = null;
              }
          }
          if (list.length === 0) {
              delete this._messages[event];
          }
      }
      offList(key) {
          const list = this._messages[key];
          if (!list || !list.length) {
              return;
          }
          for (const handler of list) {
              if (handler) {
                  handler.recover();
              }
          }
          delete this._messages[key];
      }
      offAll() {
          for (const event in this._messages) {
              this.offList(event);
          }
          this._messages = {};
      }
  }

  class BaseProxy {
      init() {
      }
      emit(event, args) {
          emitter.emit(event, args);
      }
      on(event, method, caller, args) {
          emitter.on(event, method, caller, args);
      }
  }

  class LoginProxy extends BaseProxy {
      init() {
          super.init();
      }
  }

  class LoginMdr extends ui.modules.login.LoginUI {
      onEnable() {
          super.onEnable();
      }
      onOpened(param) {
          super.onOpened(param);
      }
      close(type) {
          super.close(type);
      }
      onClick() {
          emitter.emit("open_view", {
              module: 4,
              view: 1,
          });
          emitter.emit("close_view", {
              module: 1,
              view: 1,
          });
      }
      onClickScale() {
          console.log(`11111 onClickScale: ${Date.now()}`);
      }
  }

  class BaseModule {
      constructor(module) {
          this._proxyMap = {};
          this._mdrMap = {};
          this._cmdMap = {};
          this._mdrLayerIdxMap = {};
          this.name = module;
      }
      onReg() {
          this.initCmd();
          this.initProxy();
          this.initMdr();
      }
      initCmd() {
      }
      initProxy() {
      }
      initMdr() {
      }
      regCmd(event, cls) {
          emitter.on(event, this.exeCmd, this, [event]);
          this._cmdMap[event] = cls;
      }
      exeCmd(event, args) {
          const cls = this._cmdMap[event];
          if (cls) {
              const cmd = new cls();
              cmd.exec(args);
          }
      }
      regProxy(type, proxy) {
          if (this._proxyMap[type]) {
              return;
          }
          const cls = new proxy();
          cls.init();
          this._proxyMap[type] = cls;
          DebugMgr.ins().debugProxy(cls);
      }
      retProxy(type) {
          return this._proxyMap[type];
      }
      regMdr(viewType, mdr, layerIdx = 1) {
          if (this._mdrMap[viewType]) {
              return;
          }
          this._mdrMap[viewType] = mdr;
          this._mdrLayerIdxMap[viewType] = layerIdx;
      }
      retMdr(viewType) {
          return this._mdrMap[viewType];
      }
      retMdrIdx(viewType) {
          return this._mdrLayerIdxMap[viewType];
      }
  }

  class LoginModule extends BaseModule {
      constructor() {
          super(1);
      }
      initCmd() {
          super.initCmd();
      }
      initProxy() {
          super.initProxy();
          this.regProxy(1, LoginProxy);
      }
      initMdr() {
          super.initMdr();
          this.regMdr(1, LoginMdr);
      }
  }

  let facade;
  function initFacade() {
      facade = new Facade();
      DebugMgr.ins().debug("facade", facade);
  }
  function getProxy(module, proxy) {
      const m = facade.retModule(module);
      if (!m) {
          console.error(`getProxy error，不存在module: ${module}`);
          return undefined;
      }
      const p = m.retProxy(proxy);
      if (!p) {
          console.error(`getProxy error，不存在proxy: ${proxy}`);
          return;
      }
      return p;
  }
  class Facade {
      constructor() {
          this._moduleMap = {};
          this._moduleList = [];
      }
      regModule(m) {
          this._moduleMap[m.name] = m;
      }
      retModule(type) {
          return this._moduleMap[type];
      }
      push(cls) {
          this._moduleList.push(cls);
      }
      instantiate() {
          const list = this._moduleList;
          for (const m of list) {
              const cls = new m();
              if (cls) {
                  cls.onReg();
                  this.regModule(cls);
              }
          }
      }
  }

  class BaseCommand {
  }

  var UIComponent = Laya.UIComponent;
  class BaseLayer extends UIComponent {
      constructor(idx) {
          super();
          this.idx = idx;
          this.name = "layer_" + idx;
          this.mouseThrough = true;
          this.mdrMap = {};
      }
      onResize() {
          this.width = Laya.stage.width;
          this.height = Laya.stage.height;
      }
      removeAll() {
          const numChild = this.numChildren;
          for (let i = 0; i < numChild; i++) {
              const child = this.getChildAt(i);
              if (!child)
                  continue;
              if (child instanceof Laya.Scene) {
                  child.close();
                  const mdrKey = child.name;
                  this.mdrMap[mdrKey] = undefined;
                  delete this.mdrMap[mdrKey];
              }
              child.removeSelf();
          }
      }
      doAddMdr(mdr, mdrKey) {
          if (this.mdrMap[mdrKey]) {
              return true;
          }
          const cls = new mdr();
          cls.name = mdrKey;
          this.addChild(cls);
          cls.open(false);
          this.mdrMap[mdrKey] = cls;
          return true;
      }
      doRemoveMdr(mdrKey) {
          if (!this.mdrMap[mdrKey]) {
              return false;
          }
          const mdr = this.mdrMap[mdrKey];
          if (mdr) {
              mdr.close();
              mdr.removeSelf();
              mdr.destroy();
          }
          this.mdrMap[mdrKey] = undefined;
          delete this.mdrMap[mdrKey];
          return true;
      }
  }
  class MapLayer extends BaseLayer {
      constructor() {
          super(0);
      }
  }
  class WinLayer extends BaseLayer {
      constructor() {
          super(1);
      }
  }
  class ModalLayer extends BaseLayer {
      constructor() {
          super(2);
      }
  }
  class TipsLayer extends BaseLayer {
      constructor() {
          super(3);
      }
  }
  class LayerMgr extends SingletonClass {
      constructor() {
          super();
          this._layers = {};
          this._layers = {};
          this.setLayer(new MapLayer());
          this.setLayer(new WinLayer());
          this.setLayer(new ModalLayer());
          this.setLayer(new TipsLayer());
      }
      setLayer(layer) {
          this._layers[layer.idx] = layer;
          Laya.stage.addChild(layer);
      }
      getLayer(idx) {
          return this._layers[idx];
      }
      onResize() {
          if (!Laya.stage) {
              return;
          }
          for (const idx in this._layers) {
              const layer = this._layers[idx];
              layer && layer.onResize();
          }
      }
  }

  function createMdrKey(data) {
      return `mv_${data.module}_${data.view}`;
  }
  class OpenViewCmd extends BaseCommand {
      exec(e) {
          const data = e.data;
          const module = facade.retModule(data.module);
          if (!module) {
              console.error(`App.showView error, module:${data.module}`);
              return;
          }
          const mdrCls = module.retMdr(data.view);
          if (!mdrCls) {
              console.error(`App.showView error, module:${data.module}, viewType:${data.view}`);
              return;
          }
          const layerIdx = module.retMdrIdx(data.view);
          const layer = LayerMgr.ins().getLayer(layerIdx);
          const mdrKey = createMdrKey(data);
          layer.doAddMdr(mdrCls, mdrKey);
      }
  }

  class CloseViewCmd extends BaseCommand {
      exec(e) {
          const data = e.data;
          const module = facade.retModule(data.module);
          if (!module) {
              console.error(`App.showView error, module:${data.module}`);
              return;
          }
          const mdrCls = module.retMdr(data.view);
          if (!mdrCls) {
              console.error(`App.showView error, module:${data.module}, viewType:${data.view}`);
              return;
          }
          const layerIdx = module.retMdrIdx(data.view);
          const layer = LayerMgr.ins().getLayer(layerIdx);
          layer.doRemoveMdr(createMdrKey(data));
      }
  }

  class MiscModule extends BaseModule {
      constructor() {
          super(2);
      }
      initCmd() {
          super.initCmd();
          this.regCmd("open_view", OpenViewCmd);
          this.regCmd("close_view", CloseViewCmd);
      }
  }

  class MathUtils {
      static getRandom(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
      }
  }

  var Handler$2 = Laya.Handler;
  var Pool = Laya.Pool;
  class HpSingleMdr extends ui.modules.hp.HpSingleUI {
      constructor() {
          super();
          this._maxHp = 0;
          this._maxHp1 = 0;
      }
      onAwake() {
          super.onAwake();
          console.log(`HpSingle onAwake`);
      }
      onEnable() {
          super.onEnable();
          console.log(`HpSingle onEnable`);
          this._maxHp = this._maxHp1 = 100000;
          this.timer.loop(500, this, this.onUpdateHp);
      }
      open(closeOther, param) {
          super.open(closeOther, param);
      }
      close(type) {
          super.close(type);
      }
      onUpdateHp() {
          const subHp = MathUtils.getRandom(0, 5000);
          this.tweenHp(subHp);
          this._maxHp1 = this._maxHp1 - subHp;
          console.log(`11111 ${this._maxHp1}, ${this._maxHp1 / this._maxHp}`);
          const w = 500 * (this._maxHp1 / this._maxHp);
          Laya.Tween.to(this.imgHp, { width: w }, 500, null, Handler$2.create(this, () => {
              if (w <= 0) {
                  this.timer.clearAll(this);
                  emitter.emit("close_view", {
                      module: 999,
                      view: 1,
                  });
              }
          }));
      }
      tweenHp(hp) {
          const lab = Pool.getItemByClass("HpLabel", Laya.Label);
          lab.text = "-" + hp;
          lab.fontSize = 24;
          lab.color = "#ff0000";
          lab.centerX = 0;
          lab.y = 200;
          lab.alpha = 1;
          this.boxVal.addChild(lab);
          Laya.Tween.to(lab, { y: 20, alpha: 0 }, 1000, null, Handler$2.create(this, () => {
              lab.removeSelf();
              Pool.recover("HpLabel", lab);
          }));
      }
  }

  const HP_RES_ARY = [
      "hp/img_hp1.png",
      "hp/img_hp2.png",
      "hp/img_hp3.png",
      "hp/img_hp4.png",
      "hp/img_hp5.png",
      "hp/img_hp6.png",
  ];
  const HP_RES_END = "hp/img_hp7.png";
  const HP_SINGLE = 1000;
  function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function createMaxHp() {
      return getRandom(10, 15) * 1000;
  }
  function createSubHp() {
      return getRandom(0, 1000);
  }
  class MainHpMdr extends ui.modules.hp.MainHpUI {
      constructor() {
          super();
          this._radio = 0;
          this._hpResIdx = 0;
      }
      onAwake() {
          super.onAwake();
      }
      onEnable() {
          super.onEnable();
          this._maxHp = createMaxHp();
          this._leftHp = this._maxHp;
          this._radio = 1;
          this.timerLoop(500, this, this.onUpdateHp);
      }
      onUpdateHp() {
          this._leftHp -= createSubHp();
          if (this._leftHp < 0) {
              this._leftHp = this._maxHp = createMaxHp();
          }
          const radio = this._leftHp / this._maxHp;
          if (radio === this._radio) {
              return;
          }
          this._radio = radio;
          console.log(this._radio);
          this.updateLabHp();
          this.updateHpSkin();
      }
      updateLabHp() {
          const num = (this._leftHp / this._maxHp) * 100;
          this.labHp.text =
              "x" + Math.ceil(this._leftHp / HP_SINGLE) + "    " + num.toFixed(2) + "%";
      }
      updateHpSkin() {
          if (this._hpResIdx >= HP_RES_ARY.length) {
              this._hpResIdx = 0;
          }
          this.imgHp.skin = HP_RES_ARY[this._hpResIdx++];
      }
  }

  class TestPanelMdr extends ui.modules.test.TestPanelUI {
      constructor() {
          super();
      }
      onEnable() {
          super.onEnable();
          this.autoDestroyAtClosed = true;
          const panel = this.panel;
          panel.hScrollBarSkin = "";
          panel.vScrollBarSkin = "";
      }
  }

  var Handler$3 = Laya.Handler;
  var Tween$1 = Laya.Tween;
  class TestPanelCloudMdr extends ui.modules.test.TestPanelCloudUI {
      constructor() {
          super();
          this._max = 10;
          this._actList = [1];
      }
      onEnable() {
          super.onEnable();
          this.list.renderHandler = Handler$3.create(this, this.onRenderList, undefined, false);
          this.list.vScrollBarSkin = "";
          const ary = this.getShowList();
          this.list.array = ary.reverse();
          this.list.scrollTo(ary.length);
      }
      getShowList() {
          const list = this._actList.sort((a, b) => a - b);
          if (list.length >= this._max) {
              return list;
          }
          const maxNum = list[list.length - 1];
          return [...list, maxNum + 1];
      }
      onRenderList(item, index) {
          const data = item.dataSource;
          const labLayer = item.getChildByName("labLayer");
          labLayer.text = `第${data}层`;
          const btn = item.getChildByName("btn");
          btn.clickHandler = Handler$3.create(this, this.onClickBtn, [item, index], false);
          const isActed = this._actList.indexOf(data) > -1;
          const boxCloud = item.getChildByName("boxCloud");
          const imgCloud1 = boxCloud.getChildAt(0);
          const imgCloud2 = boxCloud.getChildAt(1);
          boxCloud.visible = !isActed;
          if (!isActed) {
              imgCloud1.x = 0;
              imgCloud2.x = 300;
          }
          btn.visible = !isActed;
      }
      onClickBtn(item, index) {
          const data = item.dataSource;
          if (this._actList.indexOf(data) < 0) {
              this._actList.push(data);
          }
          const boxCloud = item.getChildByName("boxCloud");
          const imgCloud1 = boxCloud.getChildAt(0);
          const imgCloud2 = boxCloud.getChildAt(1);
          Tween$1.to(imgCloud1, { x: imgCloud1.x - 500 }, 1000);
          Tween$1.to(imgCloud2, { x: imgCloud2.x + 500 }, 1000, null, Handler$3.create(this, this.tweenList, [index - 2], true));
          const btn = item.getChildByName("btn");
          btn.visible = false;
      }
      tweenList(index) {
          const child = this.list.array.length;
          if (child < this._max) {
              const newList = this.getShowList();
              const maxNum = newList[newList.length - 1];
              this.list.addItemAt(maxNum, 0);
              this.list.scrollTo(1);
          }
          this.list.tweenTo(index - 1, 500);
      }
  }

  class TestProxy extends BaseProxy {
  }

  class TestModule extends BaseModule {
      constructor() {
          super(999);
      }
      initProxy() {
          super.initProxy();
          this.regProxy(999, TestProxy);
      }
      initCmd() {
          super.initCmd();
      }
      initMdr() {
          super.initMdr();
          this.regMdr(1, HpSingleMdr);
          this.regMdr(2, MainHpMdr);
          this.regMdr(3, TestPanelMdr);
          this.regMdr(4, TestPanelCloudMdr);
      }
  }

  class MapCellData {
  }
  MapCellData.GameCellWidth = 32;
  MapCellData.GameCellHeight = 32;
  MapCellData.GameSliceWidth = 256;
  MapCellData.GameSliceHeight = 256;
  MapCellData.GameAoiWidth = 256;
  MapCellData.GameAoiHeight = 256;

  var Sprite = Laya.Sprite;
  var Image = Laya.Image;
  var Handler$4 = Laya.Handler;
  var UIComponent$1 = Laya.UIComponent;
  class SceneMap extends Sprite {
      constructor() {
          super();
          this._bmpMap = {};
      }
      init(mapId) {
          this._mapId = mapId;
          this._sprite = new Sprite();
          this.addChild(this._sprite);
          this.setBg();
      }
      setBg() {
          Laya.loader.load(`map/${this._mapId}/info.json`, Handler$4.create(this, this.onLoad), null, Laya.Loader.JSON, 4);
      }
      onLoad(mapData) {
          const img = new Image();
          img.skin = `map/${this._mapId}/mini.jpg`;
          img.width = mapData.width;
          img.height = mapData.height;
          this._miniImg = img;
          this.addChildAt(img, 0);
          const rows = Math.ceil(mapData.height / mapData.sliceHeight);
          const cols = Math.ceil(mapData.width / mapData.sliceWidth);
          for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                  const bmp = new MapBmp();
                  bmp.init(this._mapId, i, j);
                  this._sprite.addChild(bmp);
                  this._bmpMap[bmp.name] = bmp;
              }
          }
      }
  }
  class MapBmp extends UIComponent$1 {
      init(mapId, row, col) {
          const url = `map/${mapId}/tiles/${row}_${col}.jpg`;
          this.x = col * MapCellData.GameSliceWidth;
          this.y = row * MapCellData.GameSliceHeight;
          this.name = `${mapId}_${row}_${col}`;
          if (!this._bmp) {
              this._bmp = new Image();
              this.addChild(this._bmp);
          }
          this._bmp.skin = url;
      }
      destroy(destroyChild) {
          super.destroy(destroyChild);
      }
      onDestroy() {
          super.onDestroy();
          this._bmp && this._bmp.destroy();
      }
  }

  class CompMgr {
      static addComp(comp) {
          if (!comp) {
              return;
          }
          if (!this._compMap[comp.type]) {
              this._compMap[comp.type] = [];
          }
          this._compMap[comp.type].push(comp);
      }
      static removeComp(comp) {
          if (!comp || !this._compMap[comp.type].length) {
              return;
          }
          const idx = this._compMap[comp.type].indexOf(comp);
          if (idx > -1) {
              this._compMap[comp.type].splice(idx, 1);
          }
      }
      static start() {
          Laya.timer.frameLoop(1, this, this.tick);
      }
      static stop() {
          Laya.timer.clearAll(this);
      }
      static tick(delta) {
          this.dealComp();
      }
      static dealComp() {
          for (const key in this._compMap) {
              const list = this._compMap[key];
              if (list.length) {
                  list.forEach((comp) => {
                      if (comp.isRun) {
                          comp.tick(Laya.timer.delta);
                      }
                  });
              }
          }
      }
  }
  CompMgr._compMap = {};
  DebugMgr.ins().debug("CompMgr", CompMgr);

  class BaseComp {
      get entity() {
          return this._entity;
      }
      set entity(value) {
          this._entity = value;
      }
      get isRun() {
          return this._isRun;
      }
      set isRun(value) {
          this._isRun = value;
      }
      get type() {
          return this._type;
      }
      set type(value) {
          this._type = value;
      }
      start() {
          this.isRun = true;
      }
      stop() {
          this.isRun = false;
      }
      tick(delta) {
      }
  }

  var Animation = Laya.Animation;
  var Handler$5 = Laya.Handler;
  var UIComponent$2 = Laya.UIComponent;
  class AvatarComp extends BaseComp {
      constructor() {
          super();
          this.type = 1;
      }
      get display() {
          return this._display;
      }
      set display(value) {
          this._display = value;
      }
      start() {
          super.start();
          if (!this._animation) {
              this._animation = new Animation();
          }
          if (!this.display) {
              this.display = new UIComponent$2();
              this.display.x = this.display.y = 100;
              this.display.width = 200;
              this.display.height = 200;
              this.display.graphics.drawRect(0, 0, 200, 200, "#0f0f0f");
              this.display.anchorX = 0.5;
              this.display.anchorY = 0.5;
              this.display.name = "avatarComp";
          }
          this._animation.loadAtlas("player/move_4.atlas", Handler$5.create(this, this.onLoadComplete));
          emitter.emit("base_add_to_scene", this);
      }
      stop() {
          super.stop();
          emitter.emit("base_remove_from_scene", this);
      }
      onLoadComplete() {
          this._animation.interval = 200;
          this._animation.play();
          this._display.addChild(this._animation);
      }
  }

  const CompTypeMap = {
      [1]: AvatarComp,
  };

  class SceneEntity {
      constructor() {
          this._comps = {};
      }
      get vo() {
          return this._vo;
      }
      set vo(value) {
          this._vo = value;
      }
      init(vo) {
          this.vo = vo;
      }
      addComp(type) {
          if (this._comps[type]) {
              return false;
          }
          const comp = CompTypeMap[type];
          const compIns = new comp();
          compIns.type = type;
          compIns.entity = this;
          compIns.start();
          CompMgr.addComp(compIns);
          this._comps[type] = compIns;
          return true;
      }
      removeComp(type) {
          if (!this._comps[type]) {
              return false;
          }
          const compIns = this._comps[type];
          compIns.type = 0;
          compIns.entity = null;
          compIns.stop();
          CompMgr.removeComp(compIns);
          this._comps[type] = null;
          delete this._comps[type];
          return true;
      }
      getComp(type) {
          return this._comps[type];
      }
      tick(delta) {
      }
      onAlloc() {
      }
      onRelease() {
      }
  }
  class ScenePlayer extends SceneEntity {
      init(vo) {
          super.init(vo);
          this.addComp(1);
      }
  }
  class SceneMonster extends SceneEntity {
      init(vo) {
          super.init(vo);
      }
  }
  class SceneDrop extends SceneEntity {
      init(vo) {
          super.init(vo);
      }
  }

  var Sprite$1 = Laya.Sprite;
  class SceneMdr extends Laya.Scene {
      constructor() {
          super();
      }
      onEnable() {
          super.onEnable();
          emitter.on("base_add_to_scene", this.onAddEntity, this);
          emitter.on("base_remove_from_scene", this.onDelEntity, this);
      }
      createEntitySprite() {
          const sprite = new Sprite$1();
          sprite.width = Laya.stage.width;
          sprite.height = Laya.stage.height;
          sprite.name = "_entitySprite";
          sprite.mouseEnabled = false;
          sprite.mouseThrough = true;
          return sprite;
      }
      open(closeOther, param) {
          super.open(closeOther, param);
          this._map = new SceneMap();
          this._map.init(1001);
          this.addChild(this._map);
          if (!this._entitySprite) {
              this._entitySprite = this.createEntitySprite();
              this.addChild(this._entitySprite);
          }
          const playerVo = {
              entityId: 1001,
              name: "zpj",
              hp: 10000,
              maxHp: 10000,
              power: 999999,
              type: 1,
              vip: 0,
          };
          const player = new ScenePlayer();
          player.init(playerVo);
          CompMgr.start();
      }
      onAddEntity(e) {
          const avatar = e.data;
          if (avatar) {
              this._entitySprite.addChild(avatar.display);
          }
      }
      onDelEntity(e) {
          const avatar = e.data;
          if (avatar.display) {
              avatar.display.removeSelf();
          }
      }
  }

  class SceneModule extends BaseModule {
      constructor() {
          super(4);
      }
      initMdr() {
          super.initMdr();
          this.regMdr(1, SceneMdr, 0);
      }
  }

  function regModules() {
      facade.push(MiscModule);
      facade.push(LoginModule);
      facade.push(SceneModule);
      facade.push(TestModule);
  }
  function insModules() {
      facade.instantiate();
  }
  function initModules() {
      regModules();
      insModules();
  }

  var Event$1 = Laya.Event;
  class App {
      static init() {
          initEmitter();
          initFacade();
          initModules();
          App.layerMgr.onResize();
          Laya.stage.on(Event$1.RESIZE, this.layerMgr, this.layerMgr.onResize);
      }
      static get layerMgr() {
          return LayerMgr.ins();
      }
  }
  DebugMgr.ins().debug("App", App);

  const ScenePrototype = Laya.Scene.prototype;
  ScenePrototype.open = function (closeOther, param) {
      this.onOpened(param);
  };
  const NodePrototype = Laya.Node.prototype;
  NodePrototype.getChildByName = function (name) {
      const nodes = this._children;
      if (nodes) {
          for (let i = 0, n = nodes.length; i < n; i++) {
              const node = nodes[i];
              if (node.name === name || node.var === name) {
                  return node;
              }
          }
      }
      return null;
  };

  var Event$2 = Laya.Event;
  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") === "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          App.init();
          emitter.emit("open_view", {
              module: 1,
              view: 1,
          });
          Laya.stage.on(Event$2.CLICK, this, this.onClick);
      }
      onClick(e) {
          console.log(`11111`, e.stageX, e.stageY);
          emitter.emit("base_stage_click", [e.stageX, e.stageY]);
      }
  }
  new Main();

}());
//# sourceMappingURL=bundle.js.map
