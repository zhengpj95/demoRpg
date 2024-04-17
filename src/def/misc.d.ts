/**
 * @date 2024/4/17
 */

import { ModuleType } from "@def/ModuleConst";

/**公共事件*/
export const enum CommonEvent {
  OPEN_VIEW = "open_view",
  CLOSE_VIEW = "close_view",
}

/**打开关闭界面接口*/
export interface IOpenCloseData {
  module: ModuleType;
  view: number;
  param?: any;
}
