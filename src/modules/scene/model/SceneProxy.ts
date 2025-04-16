import SingletonClass from "@base/core/SingletonClass";

/**
 * @author zpj
 * @date 2025/4/16
 */
export class SceneProxy extends SingletonClass {
  public static ins: () => SceneProxy;

  public constructor() {
    super();
  }
}
