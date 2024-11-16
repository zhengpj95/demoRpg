/**
 * @date 2024/11/16
 */
import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType } from "@def/ModuleConst";
import { HitMoleViewType } from "@def/hit_mole";
import { HitMoleStartMdr } from "./HitMoleStartMdr";
import { HitMoleRuleMdr } from "./HitMoleRuleMdr";
import { HitMoleMainMdr } from "./HitMoleMainMdr";

export class HitMoleModule extends BaseModule {
  constructor() {
    super(ModuleType.HIT_MOLE);
  }

  initMdr() {
    super.initMdr();
    this.regMdr(HitMoleViewType.START, HitMoleStartMdr);
    this.regMdr(HitMoleViewType.RULE, HitMoleRuleMdr);
    this.regMdr(HitMoleViewType.MAIN, HitMoleMainMdr);
  }
}
