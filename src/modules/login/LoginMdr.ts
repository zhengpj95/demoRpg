/**
 * @date 2024/4/13
 */
import { ui } from "@ui/layaMaxUI";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import { ModuleType } from "@def/ModuleConst";
import { emitter } from "@base/MessageMgr";
import { SceneViewType } from "@def/scene";
import { LoginViewType } from "@def/login";

export class LoginMdr extends ui.modules.login.LoginUI {
  onEnable() {
    super.onEnable();

    // this.btnLogin.clickHandler = Handler.create(
    //   this,
    //   this.onClick,
    //   undefined,
    //   false,
    // );
  }

  onOpened(param: any) {
    super.onOpened(param);
  }

  close(type?: string) {
    super.close(type);
  }

  private onClick(): void {
    emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
      module: ModuleType.SCENE,
      view: SceneViewType.SCENE,
    });
    emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
      module: ModuleType.LOGIN,
      view: LoginViewType.LOGIN,
    });
  }

  // noinspection JSUnusedGlobalSymbols 皮肤中ClickScale调用到
  private onClickScale(): void {
    console.log(`11111 onClickScale: ${Date.now()}`);
  }
}
