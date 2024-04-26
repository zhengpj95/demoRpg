/**
 * @date 2024/4/13
 */
import { LoginModule } from "./login/LoginModule";
import { facade } from "@base/mvc/Facade";
import { MiscModule } from "./misc/MiscModule";
import { TestModule } from "./test/TestModule";

// 注册所有模块 TODO
function regModules(): void {
  facade.push(MiscModule);
  facade.push(LoginModule);
  facade.push(TestModule);
}

// 实例化所有模块
function insModules(): void {
  facade.instantiate();
}

export function initModules(): void {
  regModules();
  insModules();
}
