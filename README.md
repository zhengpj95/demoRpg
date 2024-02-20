# 说明

版本：2.12.0

## ignore.cfg

在laya目录下，此文件作用就是过滤src目录下的文件夹或者文件不在ui编辑器中展示。

ui编辑器的 **Scripts文件夹** 下不展示ignore.cfg过滤的ts文件或文件夹。

## panel滚动

test/TestPanel.ts 文件

不需要展示滚动条但是有需要滚动效果的，则需要在代码中设置下面内容：

```ts
panel.hScrollBarSkin = "";
panel.vScrollBarSkin = "";
```

在ui编辑器中设置 `vScrollBarSkin` 和 `hScrollBarSkin` 为 `""` 的话，在游戏运行过程时候会报错，资源错误。

如果需要滚动条，则使用laya默认提供的图片资源即可。

## 血条变化

src/script/MainHp.ts 文件
