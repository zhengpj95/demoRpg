import { BaseComponent } from "@base/component/BaseComponent";
import { BmpMovieClip } from "@base/movieclip/BmpMovieClip";
import { ScenePlayerVO } from "@base/entity/SceneEntityVO";
import { ComponentType } from "@base/component/ComponentConst";
import { CallBack } from "@base/CallBack";
import PoolMgr from "@base/core/PoolMgr";
import Sprite = Laya.Sprite;

function getSkillEffect(skillId: number): string {
  return "effect/circle_explosion";
}

let sprite: Sprite;

function createContainer(): Sprite {
  if (!sprite) {
    sprite = new Sprite();
  }
  sprite.x = sprite.y = 0;
  sprite.height = sprite.width = NaN;
  sprite.scaleX = sprite.scaleY = sprite.alpha = 1;
  return sprite;
}

/**
 * @author zpj
 * @date 2025/4/20
 */
export class SkillComponent extends BaseComponent {
  private _mc: BmpMovieClip;
  private _skillId: number;
  private _skillEffect: string;

  public start(): void {
    super.start();
    if (!this._mc) {
      this._mc = PoolMgr.alloc(BmpMovieClip);
      const skills = (this.entity.vo as ScenePlayerVO).skills || [];
      this._skillId = skills.shift();
      this._skillEffect = getSkillEffect(this._skillId);
      if (this._skillEffect) {
        const sprite = createContainer();
        const vo = this.entity.battle.vo;
        this.entity.battle
          .getComponent(ComponentType.AVATAR)
          .display.addChildAt(sprite, 0);
        this._mc.play(
          this._skillEffect,
          1,
          sprite,
          CallBack.alloc(this, this.playSkillEnd),
          true,
          true,
        );
      }
    }
  }

  private playSkillEnd(): void {
    this.entity.removeComponent(this.type);
  }

  public stop(): void {
    super.stop();
  }
}
