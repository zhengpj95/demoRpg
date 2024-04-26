/**
 * @date 2024/4/27
 */
import { BaseProxy } from "@base/mvc/BaseProxy";

export interface ITestProxy extends BaseProxy {
  //
}

export const enum TestViewType {
  HP_SINGLE = 1,
  HP_MAIN = 2,
  TEST_PANEL = 3,
  TEST_PANEL_CLOUD = 4,
}
