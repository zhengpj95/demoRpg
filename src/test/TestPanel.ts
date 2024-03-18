import { ui } from "../ui/layaMaxUI";

/**
 * 继承场景类的实现方式 Laya.Scene
 * 注意选择发布模式，不能是文件模式，文件模式下使用不了。
 * 在UI编辑器中，如果给 hScrollBarSkin 和 vScrollBarSkin 都赋值为 ""，那么游戏内就会出现资源报错问题。
 * 所以一般在代码中设置，这样虽然不会出现资源报错，但是会出现 lose skin 问题。
 * 只要 hScrollBarSkin 和 vScrollBarSkin 不为 undefined 和 null，就可以实现滑动效果了。
 */
export default class TestPanel extends ui.test.TestPanelUI {
  constructor() {
    super();
  }

  onEnable() {
    super.onEnable();
    this.autoDestroyAtClosed = true; // 场景被关闭后，自动销毁

    const panel = this.panel;
    panel.hScrollBarSkin = "";
    panel.vScrollBarSkin = "";
  }
}
