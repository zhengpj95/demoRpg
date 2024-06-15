/**
 * @date 2024/4/13
 */
import { ui } from "@ui/layaMaxUI";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import { ModuleType } from "@def/ModuleConst";
import { TestViewType } from "@def/test";
import { emitter } from "@base/MessageMgr";

export class LoginMdr extends ui.login.LoginUI {
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
      module: ModuleType.TEST,
      view: TestViewType.HP_SINGLE,
    });
  }

  // noinspection JSUnusedGlobalSymbols 皮肤中ClickScale调用到
  private onClickScale(): void {
    console.log(`11111 onClickScale: ${Date.now()}`);
  }
}
