/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.hp {
    export class HpSingleUI extends Scene {
		public boxVal:Laya.Box;
		public imgHp:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("hp/HpSingle");
        }
    }
    REG("ui.hp.HpSingleUI",HpSingleUI);
    export class MainHpUI extends Scene {
		public imgHpNext:Laya.Image;
		public imgHpTween:Laya.Image;
		public imgHp:Laya.Image;
		public labHp:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("hp/MainHp");
        }
    }
    REG("ui.hp.MainHpUI",MainHpUI);
}
export module ui.test {
    export class TestPanelUI extends View {
		public panel:Laya.Panel;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("test/TestPanel");
        }
    }
    REG("ui.test.TestPanelUI",TestPanelUI);
    export class TestSceneUI extends Scene {
		public scoreLbl:Laya.Label;
		public tipLbll:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("test/TestScene");
        }
    }
    REG("ui.test.TestSceneUI",TestSceneUI);
}