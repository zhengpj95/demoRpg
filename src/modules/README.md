# 说明

此目录下每一个文件夹都是一个模块

InitModules.ts 是注册和实例化所有模块

注意事项：

此目录下的文件夹不能相互引用，否则会出现循环引用 (Circular dependency) 的问题。

解决方案就是在各自的 `def/xx.d.ts` 下定义接口，其他模块再调用这个接口即可。

一般mdr或command都不可以引用，通过事件监听处理。一般要调用的都是proxy内的业务逻辑。

```ts
// 定义接口
import { BaseProxy } from "@base/mvc/BaseProxy";
export interface ILoginProxy extends BaseProxy {
  func: () => void;
}

// 实现接口
export class LoginProxy extends BaseProxy implements ILoginProxy {
  func(): void {
    console.log("do something...");
  }
}

// 调用
const proxy: ILoginProxy = getProxy(module, proxy);
proxy.func();
```
