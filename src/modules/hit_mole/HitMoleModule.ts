/**
 * @date 2024/11/16
 */
import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleName } from "@def/ModuleConst";
import { HitMoleViewType } from "@def/hit_mole";
import { HitMoleStartMdr } from "./mdr/HitMoleStartMdr";
import { HitMoleRuleMdr } from "./mdr/HitMoleRuleMdr";
import { HitMoleMainMdr } from "./mdr/HitMoleMainMdr";

export class HitMoleModule extends BaseModule {
  constructor() {
    super(ModuleName.HIT_MOLE);
  }

  protected initCmd(): void {}

  protected initProxy(): void {}

  protected initMdr(): void {
    this.regMdr(HitMoleViewType.START, HitMoleStartMdr);
    this.regMdr(HitMoleViewType.RULE, HitMoleRuleMdr);
    this.regMdr(HitMoleViewType.MAIN, HitMoleMainMdr);
  }
}
