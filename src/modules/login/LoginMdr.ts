/**
 * @date 2024/4/13
 */
import { BaseMediator } from "@base/mvc/BaseMediator";
import { ui } from "@ui/layaMaxUI";
import { LayerIndex } from "@base/LayerMgr";
import LoginUI = ui.modules.login.LoginUI;

export class LoginMdr extends BaseMediator<LoginUI> {
  constructor() {
    super("modules/login/Login.scene", LayerIndex.WIN);
  }

  protected addEvents(): void {}

  protected initUI(): void {}

  protected onClose(): void {}

  protected onOpen(): void {
    // this.btnLogin.clickHandler = Handler.create(
    //   this,
    //   this.onClick,
    //   undefined,
    //   false,
    // );
  }

  protected removeEvents(): void {}

  private onClick(): void {
    console.log(`11111 onClick...`);
    // emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
    //   module: ModuleType.SCENE,
    //   view: SceneViewType.SCENE,
    // });
    // emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
    //   module: ModuleType.LOGIN,
    //   view: LoginViewType.LOGIN,
    // });
  }

  // noinspection JSUnusedGlobalSymbols 皮肤中ClickScale调用到
  private onClickScale(): void {
    console.log(`11111 onClickScale: ${Date.now()}`);
  }
}
