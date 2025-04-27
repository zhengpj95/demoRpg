/**
 * @date 2024/4/13
 */
import { LoginProxy } from "./LoginProxy";
import { LoginMdr } from "./LoginMdr";
import { BaseModule } from "@base/mvc/BaseModule";
import { LoginViewType } from "@def/login";
import { ModuleType, ProxyType } from "@def/ModuleConst";

export class LoginModule extends BaseModule {
  constructor() {
    super(ModuleType.LOGIN);
  }

  protected initCmd(): void {}

  protected initProxy(): void {
    this.regProxy(ProxyType.LOGIN, LoginProxy);
  }

  protected initMdr(): void {
    this.regMdr(LoginViewType.LOGIN, LoginMdr);
  }
}
