/**
 * @date 2024/4/13
 */
import { LoginModule } from "./login/LoginModule";
import { facade } from "@base/mvc/Facade";

// 注册所有模块
export function initModules(): void {
  facade.push(LoginModule);
}

// 实例化所有模块
export function insModules(): void {
  facade.instantiate();
}
