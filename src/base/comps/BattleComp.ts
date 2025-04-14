import { BaseComp } from "@base/comps/BaseComp";

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
    const attackDis = 50;
    return (
      Math.abs(this.entity.battle.vo.point.x - this.entity.vo.point.x) <=
        attackDis &&
      Math.abs(this.entity.battle.vo.point.y - this.entity.vo.point.y) <=
        attackDis
    );
  }

  private startAttack(): void {
    this._isAttack = true;
    const battleObj = this.entity.battle;
    if (!battleObj) {
      battleObj.battle = this.entity;
    }
    console.log(1, "_attack");
  }

  private stopAttack(): void {
    this._isAttack = false;
    this.entity.battle = null;
  }
}
