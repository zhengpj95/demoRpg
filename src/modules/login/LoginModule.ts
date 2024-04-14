/**
 * @date 2024/4/13
 */
import { LoginProxy } from "./LoginProxy";
import { LoginMdr } from "./LoginMdr";
import { BaseModule } from "@base/mvc/BaseModule";
import { LoginViewType } from "@def/Login";
import { ModuleType, ProxyType } from "@def/ModuleConst";

export class LoginModule extends BaseModule {
  constructor() {
    super(ModuleType.LOGIN);
  }
  initCmd(): void {
    super.initCmd();
  }

  initProxy(): void {
    super.initProxy();
    this.regProxy(ProxyType.LOGIN, LoginProxy);
  }

  initMdr(): void {
    super.initMdr();
    this.regMdr(LoginViewType.LOGIN, LoginMdr);
  }
}
