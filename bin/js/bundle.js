(function () {
    'use strict';

    var View = Laya.View;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var hp;
        (function (hp) {
            class HpSingleUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("hp/HpSingle");
                }
            }
            hp.HpSingleUI = HpSingleUI;
            REG("ui.hp.HpSingleUI", HpSingleUI);
            class MainHpUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("hp/MainHp");
                }
            }
            hp.MainHpUI = MainHpUI;
            REG("ui.hp.MainHpUI", MainHpUI);
        })(hp = ui.hp || (ui.hp = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var test;
        (function (test) {
            class TestPanelUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestPanel");
                }
            }
            test.TestPanelUI = TestPanelUI;
            REG("ui.test.TestPanelUI", TestPanelUI);
            class TestPanelCloudUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestPanelCloud");
                }
            }
            test.TestPanelCloudUI = TestPanelCloudUI;
            REG("ui.test.TestPanelCloudUI", TestPanelCloudUI);
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

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
    class MainHp extends ui.hp.MainHpUI {
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

    class TestPanel extends ui.test.TestPanelUI {
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

    var Handler = Laya.Handler;
    var Tween = Laya.Tween;
    class TestPanelCloud extends ui.test.TestPanelCloudUI {
        constructor() {
            super();
            this._max = 10;
            this._actList = [1];
        }
        onEnable() {
            super.onEnable();
            this.list.renderHandler = Handler.create(this, this.onRenderList, undefined, false);
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
            btn.clickHandler = Handler.create(this, this.onClickBtn, [item, index], false);
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
            Tween.to(imgCloud1, { x: imgCloud1.x - 500 }, 1000);
            Tween.to(imgCloud2, { x: imgCloud2.x + 500 }, 1000, null, Handler.create(this, this.tweenList, [index - 2], true));
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

    class GameUI extends ui.test.TestSceneUI {
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
            reg("script/MainHp.ts", MainHp);
            reg("test/TestPanel.ts", TestPanel);
            reg("test/TestPanelCloud.ts", TestPanelCloud);
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
    GameConfig.startScene = "hp/HpSingle.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class MathUtils {
        static getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }

    var Handler$1 = Laya.Handler;
    var Pool = Laya.Pool;
    class HpSingle extends ui.hp.HpSingleUI {
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
        onUpdateHp() {
            const subHp = MathUtils.getRandom(0, 5000);
            this.tweenHp(subHp);
            this._maxHp1 = this._maxHp1 - subHp;
            console.log(`11111 ${this._maxHp1}, ${this._maxHp1 / this._maxHp}`);
            const w = 500 * (this._maxHp1 / this._maxHp);
            Laya.Tween.to(this.imgHp, { width: w }, 500, null, Handler$1.create(this, () => {
                if (w <= 0) {
                    this.timer.clearAll(this);
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
            Laya.Tween.to(lab, { y: 20, alpha: 0 }, 1000, null, Handler$1.create(this, () => {
                lab.removeSelf();
                Pool.recover("HpLabel", lab);
            }));
        }
    }

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
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
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
            const mdr = new HpSingle();
            Laya.stage.addChild(mdr);
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map
