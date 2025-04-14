import { BaseComp } from "@base/comps/BaseComp";

const ATTACK_DIS = 50;

/**
 * @date 2024/6/26
 */
export class BattleComp extends BaseComp {
  private _isAttack = false;

  public start(): void {
    super.start();
  }

  public stop(): void {
    super.stop();
    this._isAttack = false;
  }

  public tick(delta: number): void {
    super.tick(delta);
    const entity = this.entity;
    if (!entity.battle) {
      return;
    }

    if (!this._isAttack) {
      if (this.canAttack()) {
        this.startAttack();
      }
    } else {
      if (!this.canAttack()) {
        this.stopAttack();
      }
    }
  }

  private canAttack(): boolean {
    const attackDis = ATTACK_DIS;
    const vo = this.entity.vo;
    const battleVo = this.entity.battle.vo;
    return (
      Math.abs(battleVo.point.x - vo.point.x) <= attackDis &&
      Math.abs(battleVo.point.y - vo.point.y) <= attackDis
    );
  }

  private startAttack(): void {
    this._isAttack = true;
    const battleObj = this.entity.battle;
    if (!battleObj) {
      battleObj.battle = this.entity;
    }
    console.log(
      `11111 BattleComp ${this.entity.vo.name} attack ${this.entity.battle.vo.name}`,
    );
  }

  private stopAttack(): void {
    this._isAttack = false;
    this.entity.battle = null;
  }
}
