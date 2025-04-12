# 项目

## 项目说明

Laya版本：2.12.0

发布模式：分离模式

发布目录：bin

游戏初始化配置：GameConfig.ts

游戏入口文件：Main.ts

## ignore.cfg

在laya目录下，此文件作用就是过滤src目录下的文件夹或者文件不在ui编辑器中展示。

ui编辑器的 **Scripts文件夹** 下不展示ignore.cfg过滤的ts文件或文件夹。

## tsconfig.json

不要使用严格模式，否则生成的 layaMaxUI.ts 有问题

设置baseUrl+paths，设置导入模块的方式。

```shell
// paths 设置模块名和模块路径的映射，也就是typescript如何导入require或imports语句加载的模块。
// paths 基于 baseUrl 进行加载的，所有必须同时设置 baseUrl

"baseUrl": "./",
"paths": {
    "@base/*": ["src/base/*"],
    "@def/*": ["src/def/*"],
    "@ui/*": ["src/ui/*"]
}

// 设置上诉模块后，导入src/base下的内容，就像下面的处理方式了
// import { BaseProxy } from "@base/mvc/BaseProxy";
```

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

## 序列帧

```xml
{
  "filename": "Circle_explosion/Circle_explosion1",
  "frame": { "x": 98, "y": 208, "w": 50, "h": 43 }, // 表示在大图中，这帧图像的位置和尺寸
  "rotated": false, // 此帧没有被旋转
  "trimmed": true, // 原图裁剪了透明边界，只保留了有效像素
  "spriteSourceSize": { "x": 106, "y": 109, "w": 50, "h": 43 }, // 原图中，这个小图的偏移位置（绘制用）
  "sourceSize": { "w": 256, "h": 256 } // 原始帧图为 256x256，包含空白
}
```


