/**
 * @author zpj
 * @date 2025/4/28
 */
import { IPlatformAdapter, PlatformType } from "./PlatformConst";
import { Platform } from "./Platform";
import { WechatAdapter } from "./WechatAdapter";
import { WebAdapter } from "./WebAdapter";

export class AdapterFactory {
  public static getAdapter(): IPlatformAdapter {
    switch (Platform.platform) {
      case PlatformType.WX:
        return new WechatAdapter();
      case PlatformType.WEB:
        return new WebAdapter();
      default:
        throw new Error(`Unsupported platform!`);
    }
  }
}
