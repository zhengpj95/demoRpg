export class GameUtils {
  /**
   * 返回对象的完全限定类名
   * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number)和类对象
   * @returns 包含完全限定类名称的字符串。
   */
  public static getQualifiedClassName(value: any): string {
    const type = typeof value;
    if (!value || (type !== "object" && !value.prototype)) {
      return type;
    }
    const prototype = value.prototype
      ? value.prototype
      : Object.getPrototypeOf(value);
    if (Object.prototype.hasOwnProperty.call(prototype, "__class__")) {
      return prototype["__class__"];
    } else if (type === "function" && value.name) {
      return value.name;
    } else if (prototype.constructor.name) {
      return prototype.constructor.name;
    }

    const constructorString = prototype.constructor.toString().trim();
    const index = constructorString.indexOf("(");
    let className = constructorString.substring(9, index);

    if (!className && type === "function") {
      className = "anonymous";
    }

    Object.defineProperty(prototype, "__class__", {
      value: className,
      enumerable: false,
      writable: true,
    });
    return className;
  }
}
