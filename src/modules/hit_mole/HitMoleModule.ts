/**
 * @date 2024/11/16
 */
import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType } from "@def/ModuleConst";
import { HitMoleViewType } from "@def/hit_mole";
import { HitMoleStartMdr } from "./mdr/HitMoleStartMdr";
import { HitMoleRuleMdr } from "./mdr/HitMoleRuleMdr";
import { HitMoleMainMdr } from "./mdr/HitMoleMainMdr";

export class HitMoleModule extends BaseModule {
  constructor() {
    super(ModuleType.HIT_MOLE);
  }

  protected initCmd(): void {}

  protected initProxy(): void {}

  protected initMdr(): void {
    this.regMdr2(HitMoleViewType.START, HitMoleStartMdr);
    this.regMdr2(HitMoleViewType.RULE, HitMoleRuleMdr);
    this.regMdr2(HitMoleViewType.MAIN, HitMoleMainMdr);
  }
}
