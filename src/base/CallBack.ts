/**
 * @author zpj
 * @date 2025/3/5
 */
export class CallBack<T extends any[] = [], R = void, C = any> {
  private static _pool: CallBack<any, any, any>[] = [];
  private static _idCounter = 0;

  private _id: number = 0;
  private _context: C | null = null;
  private _method: ((this: C, ...args: T) => R) | null = null;
  private _args: T = [] as unknown as T;
  private _once: boolean = false;

  public static alloc<T extends any[], R, C>(
    context: C,
    func: (this: C, ...args: T) => R,
    once?: boolean,
  ): CallBack<T, R, C>;
  public static alloc<T extends any[], R, C, A0>(
    context: C,
    func: (this: C, arg0: A0, ...args: T) => R,
    args: [A0],
    once?: boolean,
  ): CallBack<T, R, C>;
  public static alloc<T extends any[], R, C, A0, A1>(
    context: C,
    func: (this: C, arg0: A0, arg1: A1, ...args: T) => R,
    args: [A0, A1],
    once?: boolean,
  ): CallBack<T, R, C>;

  /**
   * 创建一个 Callback 实例，优先从对象池中获取
   * @param func 回调函数
   * @param context 执行回调的上下文
   * @param once 是否只执行一次
   * @param args 额外参数
   * @returns Callback 实例
   */
  public static alloc<T extends any[], R, C>(
    context: C,
    func: (this: C, ...args: T) => R,
    args?: T | boolean,
    once?: boolean,
  ): CallBack<T, R, C> {
    console.log(11111, typeof func);
    if (typeof func !== "function") {
      throw new Error("CallBack func must be Function!");
    }
    if (typeof args === "boolean") {
      once = args;
      args = undefined;
    }
    const instance =
      this._pool.length > 0
        ? (this._pool.pop()! as CallBack<T, R, C>)
        : new CallBack<T, R, C>();
    instance._id = ++CallBack._idCounter;
    instance._context = context || null;
    instance._method = func;
    instance._args = <T>args;
    instance._once = !!once;
    return instance;
  }

  /**
   * 执行回调
   * @param extraArgs 额外传入的参数
   * @returns 回调函数的返回值
   */
  public exec(...extraArgs: T): R | undefined {
    if (this._method) {
      let args: T | undefined;
      if (!extraArgs.length) {
        args = this._args;
      } else if (this._args) {
        args = <T>this._args.concat(extraArgs);
      } else {
        args = extraArgs;
      }
      const result = this._method.apply(this._context!, args);
      if (this._once) {
        this.free();
      }
      return result;
    }
    return undefined;
  }

  /**
   * 释放回调对象到对象池
   */
  public free(): void {
    this._method = null;
    this._context = null;
    this._args.length = 0;
    this._once = false;
    this._id = 0;
    CallBack._pool.push(this);
  }

  /**
   * 获取回调 ID
   */
  public getId(): number {
    return this._id;
  }
}
