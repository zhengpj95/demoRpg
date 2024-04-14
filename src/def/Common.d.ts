/**
 * @date 2024/4/13
 */
import { ModuleType } from "@def/ModuleConst";

export const enum CommonEvent {
  OPEN_VIEW = "open_view",
  CLOSE_VIEW = "close_view",
}

/**打开关闭界面参数*/
export interface IOpenCloseData {
  module: ModuleType;
  view: number;
  param?: any;
}
