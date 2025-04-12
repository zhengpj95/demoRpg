/**
 * @author zpj
 * @date 2025/4/11
 */

/** 单张图片格式 */
export interface IFrameData {
  filename: string;
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}

/** 序列帧格式 */
export interface ITextureAtlas {
  frames: IFrameData[];
  meta: {
    image: string;
    size: { w: number; h: number };
    scale: string;
  };
}
