/**
 * @date 2024/4/13
 */

import { BaseProxy } from "@base/mvc/BaseProxy";

export interface ILoginProxy extends BaseProxy {
  //
}

export const enum LoginViewType {
  LOGIN = 1,
}

export const enum LoginEvent {
  LOGIN = "login",
}
