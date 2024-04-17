/**
 * @date 2024/4/17
 */

// 兼容打开界面的方式，调用onOpened
const ScenePrototype = Laya.Scene.prototype;
ScenePrototype.open = function (closeOther, param): void {
  this.onOpened(param);
};

// 兼容预制体中通过var获取组件
const NodePrototype = Laya.Node.prototype;
NodePrototype.getChildByName = function (name: string): Laya.Node {
  const nodes = this._children;
  if (nodes) {
    for (let i = 0, n = nodes.length; i < n; i++) {
      const node = nodes[i];
      if (node.name === name || node.var === name) {
        return node;
      }
    }
  }
  return null;
};
